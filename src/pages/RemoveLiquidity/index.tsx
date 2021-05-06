import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, ETHER, Percent, WETH } from '@pancakeswap-libs/sdk'
import { Text, Link } from '@geist-ui/react'
import { Button, Flex } from '@pancakeswap-libs/uikit'
import { ArrowDown, Plus } from 'react-feather'
import { RouteComponentProps } from 'react-router'

import { BigNumber } from '@ethersproject/bignumber'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ButtonCTA from 'components/ButtonCTA'
import useI18n from 'hooks/useI18n'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import { RowBetween, RowFixed } from '../../components/Row'

import Slider from '../../components/Slider'
import CurrencyLogo from '../../components/CurrencyLogo'
import { ROUTER_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { usePairContract } from '../../hooks/useContract'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { StyledInternalLink } from '../../components/Shared'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { currencyId } from '../../utils/currencyId'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import AppBody from '../AppBody'
import { ClickableText, Wrapper } from '../Pool/styleds'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { Dots } from '../../components/swap/styleds'
import { useBurnActionHandlers, useDerivedBurnInfo, useBurnState } from '../../state/burn/hooks'

import { Field } from '../../state/burn/actions'
import { useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'

const OutlineCard = styled.div`
  border: 1px solid #f6f6f6;
  border-radius: 5px;
  padding: 24px;
`

const StyledText = styled(Text)`
  font-size: 14px;
  margin: 0;
`

const StyledLink = styled(Link)`
  font-size: 16px !important;
  font-weight: 600;
  color: #333 !important;
  margin-top: 5px;

  &:hover {
    color: #4bf2cd !important;
  }
`

const StyledSliderButton = styled.div`
  font-size: 16px !important;
  font-weight: 400;
  color: #111 !important;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 15px;

  &:hover {
    color: #4bf2cd !important;
    border: 1px solid #4bf2cd;
  }
`

const Body = styled.div``

export default function RemoveLiquidity({
  history,
  match: {
    params: { currencyIdA, currencyIdB },
  },
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const TranslateString = useI18n()
  const [tokenA, tokenB] = useMemo(() => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)], [currencyA, currencyB, chainId])

  const theme = useContext(ThemeContext)

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]: independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]: independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS)
  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')
    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const deadlineForSignature: number = Math.ceil(Date.now() / 1000) + deadline

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
    const domain = {
      name: 'Pancake LPs',
      version: '1',
      chainId,
      verifyingContract: pair.liquidityToken.address,
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadlineForSignature,
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: 'Permit',
      message,
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadlineForSignature,
        })
      })
      .catch((e) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (e?.code !== 4001) {
          approveCallback()
        }
      })
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, val: string) => {
      setSignatureData(null)
      return _onUserInput(field, val)
    },
    [_onUserInput]
  )

  const onLiquidityInput = useCallback((val: string): void => onUserInput(Field.LIQUIDITY, val), [onUserInput])
  const onCurrencyAInput = useCallback((val: string): void => onUserInput(Field.CURRENCY_A, val), [onUserInput])
  const onCurrencyBInput = useCallback((val: string): void => onUserInput(Field.CURRENCY_B, val), [onUserInput])

  // tx sending
  const addTransaction = useTransactionAdder()
  async function onRemove() {
    if (!chainId || !library || !account) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB === ETHER
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH
    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadlineFromNow,
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadlineFromNow,
        ]
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }
    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName, index) =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((e) => {
            console.error(`estimateGas failed`, index, methodName, args, e)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) => BigNumber.isBigNumber(safeGasEstimate))

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await router[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencyA?.symbol} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${
              currencyB?.symbol
            }`,
          })

          setTxHash(response.hash)
        })
        .catch((e: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(e)
        })
    }
  }

  function modalHeader() {
    return (
      <AutoColumn gap="md" style={{ marginTop: '20px' }}>
        <RowBetween align="flex-end">
          <StyledText style={{ color: '#111', fontWeight: 700, fontSize: 20 }}>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</StyledText>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyA} size="24px" />
            <StyledText style={{ color: '#111', fontWeight: 700, fontSize: 20, marginLeft: 10 }}>{currencyA?.symbol}</StyledText>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <Plus size="16" color="#333" />
        </RowFixed>
        <RowBetween align="flex-end">
          <StyledText style={{ color: '#111', fontWeight: 700, fontSize: 20 }}>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</StyledText>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyB} size="24px" />
            <StyledText style={{ color: '#111', fontWeight: 700, fontSize: 20, marginLeft: 10 }}>{currencyB?.symbol}</StyledText>
          </RowFixed>
        </RowBetween>
        <StyledText style={{ fontStyle: 'italic', padding: '8px 0 0 0 ', marginTop: 5 }}>
          {`Output is estimated. If the price changes by more than ${allowedSlippage / 100}% your transaction will revert.`}
        </StyledText>
      </AutoColumn>
    )
  }

  function modalBottom() {
    return (
      <>
        <RowBetween>
          <StyledText>{`LP ${currencyA?.symbol}/${currencyB?.symbol}`} Burned</StyledText>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin />
            <Text>{parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}</Text>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween>
              <StyledText>{TranslateString(1182, 'Price')}</StyledText>
              <StyledText>
                1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </StyledText>
            </RowBetween>
            <RowBetween>
              <div />
              <StyledText>
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </StyledText>
            </RowBetween>
          </>
        )}
        <ButtonCTA disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)} onClick={onRemove}>
          {TranslateString(1136, 'Confirm')}
        </ButtonCTA>
      </>
    )
  }

  const pendingText = `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencyA?.symbol} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${
    currencyB?.symbol
  }`

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput]
  )

  const oneCurrencyIsETH = currencyA === ETHER || currencyB === ETHER
  const oneCurrencyIsWETH = Boolean(chainId && ((currencyA && currencyEquals(WETH[chainId], currencyA)) || (currencyB && currencyEquals(WETH[chainId], currencyB))))

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        history.push(`/remove/${currencyId(currency)}/${currencyIdA}`)
      } else {
        history.push(`/remove/${currencyId(currency)}/${currencyIdB}`)
      }
    },
    [currencyIdA, currencyIdB, history]
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        history.push(`/remove/${currencyIdB}/${currencyId(currency)}`)
      } else {
        history.push(`/remove/${currencyIdA}/${currencyId(currency)}`)
      }
    },
    [currencyIdA, currencyIdB, history]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxHash('')
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback
  )

  return (
    <>
      <AppBody>
        <AddRemoveTabs adding={false} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash || ''}
            content={() => <ConfirmationModalContent title={TranslateString(1156, 'You will receive')} topContent={modalHeader} bottomContent={modalBottom} />}
            pendingText={pendingText}
          />
          <AutoColumn gap="md">
            <Body>
              <OutlineCard>
                <AutoColumn>
                  <RowBetween>
                    <StyledText style={{ fontSize: 16, fontWeight: 500 }}>Amount</StyledText>
                    <StyledLink
                      style={{ marginTop: 0 }}
                      onClick={(e) => {
                        e.preventDefault()
                        setShowDetailed(!showDetailed)
                      }}
                    >
                      {showDetailed ? TranslateString(1184, 'Simple') : TranslateString(1186, 'Detailed')}
                    </StyledLink>
                  </RowBetween>
                  <Flex justifyContent="start">
                    <StyledText style={{ fontSize: 36, fontWeight: 500 }}>{formattedAmounts[Field.LIQUIDITY_PERCENT]}%</StyledText>
                  </Flex>
                  {!showDetailed && (
                    <>
                      <Flex mb="8px">
                        <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />
                      </Flex>
                      <Flex justifyContent="space-around">
                        <StyledSliderButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}>25%</StyledSliderButton>
                        <StyledSliderButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}>50%</StyledSliderButton>
                        <StyledSliderButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}>75%</StyledSliderButton>
                        <StyledSliderButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}>{TranslateString(166, 'Max')}</StyledSliderButton>
                      </Flex>
                    </>
                  )}
                </AutoColumn>
              </OutlineCard>
            </Body>
            {!showDetailed && (
              <>
                <ColumnCenter>
                  <ArrowDown size="16" color="#333" />
                </ColumnCenter>
                <Body>
                  <OutlineCard>
                    <AutoColumn gap="10px">
                      <RowBetween>
                        <StyledText style={{ fontWeight: 500, fontSize: 16 }}>{formattedAmounts[Field.CURRENCY_A] || '-'}</StyledText>
                        <RowFixed>
                          <CurrencyLogo currency={currencyA} style={{ marginRight: '12px', width: 24, height: 24 }} />
                          <StyledText style={{ fontWeight: 500, fontSize: 16 }} id="remove-liquidity-tokena-symbol">
                            {currencyA?.symbol}
                          </StyledText>
                        </RowFixed>
                      </RowBetween>
                      <RowBetween>
                        <StyledText style={{ fontWeight: 500, fontSize: 16 }}>{formattedAmounts[Field.CURRENCY_B] || '-'}</StyledText>
                        <RowFixed>
                          <CurrencyLogo currency={currencyB} style={{ marginRight: '12px', width: 24, height: 24 }} />
                          <StyledText style={{ fontWeight: 500, fontSize: 16 }} id="remove-liquidity-tokenb-symbol">
                            {currencyB?.symbol}
                          </StyledText>
                        </RowFixed>
                      </RowBetween>
                      {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                        <RowBetween style={{ justifyContent: 'flex-end' }}>
                          {oneCurrencyIsETH ? (
                            <StyledLink href={`#/remove/${currencyA === ETHER ? WETH[chainId].address : currencyIdA}/${currencyB === ETHER ? WETH[chainId].address : currencyIdB}`}>
                              {TranslateString(1188, 'Receive WBNB')}
                            </StyledLink>
                          ) : oneCurrencyIsWETH ? (
                            <StyledLink
                              href={`#/remove/${currencyA && currencyEquals(currencyA, WETH[chainId]) ? 'ETH' : currencyIdA}/${
                                currencyB && currencyEquals(currencyB, WETH[chainId]) ? 'ETH' : currencyIdB
                              }`}
                            >
                              {TranslateString(1190, 'Receive BNB')}
                            </StyledLink>
                          ) : null}
                        </RowBetween>
                      ) : null}
                    </AutoColumn>
                  </OutlineCard>
                </Body>
              </>
            )}
            <Body style={{ paddingBottom: '24px' }}>
              {showDetailed && (
                <>
                  <CurrencyInputPanel
                    value={formattedAmounts[Field.LIQUIDITY]}
                    onUserInput={onLiquidityInput}
                    onMax={() => {
                      onUserInput(Field.LIQUIDITY_PERCENT, '100')
                    }}
                    showMaxButton={!atMaxAmount}
                    disableCurrencySelect
                    currency={pair?.liquidityToken}
                    pair={pair}
                    id="liquidity-amount"
                  />
                  <ColumnCenter>
                    <ArrowDown size="16" color={theme.colors.textSubtle} />
                  </ColumnCenter>
                  <CurrencyInputPanel
                    hideBalance
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onUserInput={onCurrencyAInput}
                    onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                    showMaxButton={!atMaxAmount}
                    currency={currencyA}
                    label="Output"
                    onCurrencySelect={handleSelectCurrencyA}
                    id="remove-liquidity-tokena"
                  />
                  <ColumnCenter>
                    <Plus size="16" color={theme.colors.textSubtle} />
                  </ColumnCenter>
                  <CurrencyInputPanel
                    hideBalance
                    value={formattedAmounts[Field.CURRENCY_B]}
                    onUserInput={onCurrencyBInput}
                    onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                    showMaxButton={!atMaxAmount}
                    currency={currencyB}
                    label="Output"
                    onCurrencySelect={handleSelectCurrencyB}
                    id="remove-liquidity-tokenb"
                  />
                </>
              )}
              {pair && (
                <div style={{ padding: '24px', fontSize: 14 }}>
                  <Flex justifyContent="space-between" mb="8px">
                    Price:
                    <div>
                      1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
                    </div>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <div />
                    <div>
                      1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
                    </div>
                  </Flex>
                </div>
              )}
              <div style={{ position: 'relative' }}>
                {!account ? (
                  <ConnectWalletButton width="100%" />
                ) : (
                  <RowBetween>
                    <ButtonCTA onClick={onAttemptToApprove} disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}>
                      {approval === ApprovalState.PENDING ? <Dots>Approving</Dots> : approval === ApprovalState.APPROVED || signatureData !== null ? 'Approved' : 'Approve'}
                    </ButtonCTA>
                    <div style={{ width: 8 }} />
                    <ButtonCTA
                      onClick={() => {
                        setShowConfirm(true)
                      }}
                      disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                    >
                      {error || 'Remove'}
                    </ButtonCTA>
                  </RowBetween>
                )}
              </div>
            </Body>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
