import { Currency, ETHER, JSBI, TokenAmount } from '@pancakeswap-libs/sdk'
import styled from 'styled-components'
import React, { useCallback, useEffect, useState } from 'react'
import { ChevronDownIcon, AddIcon, CardBody } from '@pancakeswap-libs/uikit'
import { Text, Link } from '@geist-ui/react'
import CardNav from 'components/CardNav'
import { LightCard } from 'components/Card'
import { AutoColumn, ColumnCenter } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { FindPoolTabs } from 'components/NavigationTabs'
import { MinimalPositionCard } from 'components/PositionCard'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import ButtonCTA from 'components/ButtonCTA'
import { PairState, usePair } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { usePairAdder } from 'state/user/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { StyledInternalLink } from 'components/Shared'
import { currencyId } from 'utils/currencyId'
import useI18n from 'hooks/useI18n'
import AppBody from '../AppBody'
import { Dots } from '../Pool/styleds'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const Button = styled(ButtonCTA)`
  border: 1px solid #f6f6f6 !important;
  background-color: #fff !important;
  color: #333 !important;
  text-transform: none !important;
  text-align: left !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  height: 60px !important;

  &:hover {
    border: 1px solid #4bf2cd !important;
    color: #4bf2cd !important;
    background-color: #fff !important;
  }

  span.icon.right {
    color: inherit !important;
  }

  span.icon.right:hover {
    color: inherit !important;
  }

  span.icon.right > svg {
    fill: currentColor !important;
    color: inherit !important;
    width: 24px;
    height: 24px;
  }

  span.icon.right > svg:hover {
    fill: currentColor !important;
    color: inherit !important;
    width: 24px;
    height: 24px;
  }
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

export default function PoolFinder() {
  const { account } = useActiveWeb3React()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()

  const TranslateString = useI18n()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(pairState === PairState.EXISTS && pair && JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) && JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0)))

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField]
  )

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const prerequisiteMessage = (
    <LightCard padding="15px 0px 10px">
      <StyledText style={{ textAlign: 'center' }}>
        {!account ? TranslateString(1174, 'Connect to a wallet to find pools') : TranslateString(208, 'Select a token to find your liquidity.')}
      </StyledText>
    </LightCard>
  )

  return (
    <>
      <AppBody>
        <FindPoolTabs />
        <AutoColumn gap="md">
          <Button
            onClick={() => {
              setShowSearch(true)
              setActiveField(Fields.TOKEN0)
            }}
            iconRight={<ChevronDownIcon width="24px" color="white" />}
          >
            {currency0 ? (
              <div style={{ marginTop: 5, display: 'flex', alignItems: 'center' }}>
                <CurrencyLogo currency={currency0} style={{ marginRight: '.5rem', width: 24 }} />
                {currency0.symbol}
              </div>
            ) : (
              TranslateString(82, 'Select a Token')
            )}
          </Button>

          <ColumnCenter style={{ marginTop: 10 }}>
            <AddIcon color="#111" />
          </ColumnCenter>

          <Button
            style={{ textAlign: 'left' }}
            onClick={() => {
              setShowSearch(true)
              setActiveField(Fields.TOKEN1)
            }}
            iconRight={<ChevronDownIcon width="24px" color="white" />}
          >
            {currency1 ? (
              <div style={{ marginTop: 5, display: 'flex', alignItems: 'center' }}>
                <CurrencyLogo currency={currency1} style={{ marginRight: '.5rem', width: 24 }} />
                {currency1.symbol}
              </div>
            ) : (
              TranslateString(82, 'Select a Token')
            )}
          </Button>

          {hasPosition && (
            <ColumnCenter style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '5px' }}>
              <StyledText style={{ textAlign: 'center' }}>{TranslateString(210, 'Pool found!')}</StyledText>
            </ColumnCenter>
          )}

          {currency0 && currency1 ? (
            pairState === PairState.EXISTS ? (
              hasPosition && pair ? (
                <MinimalPositionCard pair={pair} />
              ) : (
                <LightCard padding="15px 0px">
                  <AutoColumn gap="sm" justify="center">
                    <StyledText style={{ textAlign: 'center' }}>{TranslateString(212, 'You don’t have liquidity in this pool yet.')}</StyledText>
                    <StyledLink href={`#/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      <StyledText style={{ textAlign: 'center' }}>{TranslateString(168, 'Add Liquidity')}</StyledText>
                    </StyledLink>
                  </AutoColumn>
                </LightCard>
              )
            ) : validPairNoLiquidity ? (
              <LightCard padding="15px 0px">
                <AutoColumn gap="sm" justify="center">
                  <StyledText style={{ textAlign: 'center' }}>{TranslateString(214, 'No pool found.')}</StyledText>
                  <StyledLink href={`#/add/${currencyId(currency0)}/${currencyId(currency1)}`}>Create pool.</StyledLink>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.INVALID ? (
              <LightCard padding="15px 0px">
                <AutoColumn gap="sm" justify="center">
                  <StyledText style={{ textAlign: 'center' }}>{TranslateString(136, 'Invalid pair.')}</StyledText>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.LOADING ? (
              <LightCard padding="15px 0px">
                <AutoColumn gap="sm" justify="center">
                  <StyledText style={{ textAlign: 'center' }}>
                    Loading
                    <Dots />
                  </StyledText>
                </AutoColumn>
              </LightCard>
            ) : null
          ) : (
            prerequisiteMessage
          )}
        </AutoColumn>

        <CurrencySearchModal
          isOpen={showSearch}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={handleSearchDismiss}
          showCommonBases
          selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
        />
      </AppBody>
    </>
  )
}
