import { Trade, TradeType } from '@pancakeswap-libs/sdk'
import styled from 'styled-components'
import React, { useMemo, useState } from 'react'
import ButtonCTA from 'components/ButtonCTA'
import { Text } from '@geist-ui/react'
import { Repeat, AlertTriangle } from 'react-feather'
import useI18n from 'hooks/useI18n'
import { Field } from '../../state/swap/actions'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, formatExecutionPrice, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'

const StyledText = styled(Text)`
  margin: 0;
  font-size: 14px;
`

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [allowedSlippage, trade])
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)
  const TranslateString = useI18n()

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <StyledText>Price</StyledText>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '8px',
              fontWeight: 500,
              margin: 0,
              color: '#111',
              fontSize: 14,
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <Repeat style={{ color: '#4bf2cd' }} size={14} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <StyledText>{trade.tradeType === TradeType.EXACT_INPUT ? TranslateString(1210, 'Minimum received') : TranslateString(220, 'Maximum sold')}</StyledText>
            <QuestionHelper text={TranslateString(202, 'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.')} />
          </RowFixed>
          <RowFixed>
            <StyledText>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </StyledText>
            <Text style={{ marginLeft: 4, marginRight: 0, marginTop: 0, marginBottom: 0 }}>
              {trade.tradeType === TradeType.EXACT_INPUT ? trade.outputAmount.currency.symbol : trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <StyledText>Price Impact</StyledText>
            <QuestionHelper text={TranslateString(224, 'The difference between the market price and your price due to trade size.')} />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <StyledText>Liquidity Provider Fee</StyledText>
            <QuestionHelper text={TranslateString(999, 'For each trade a 0.2% fee is paid. 0.17% goes to liquidity providers and 0.03% goes to the PancakeSwap treasury.')} />
          </RowFixed>
          <StyledText>{realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}</StyledText>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonCTA
          iconRight={!disabledConfirm && severity > 2 ? <AlertTriangle style={{color: "#fff"}} size={24} /> : null}
          onClick={onConfirm}
          disabled={disabledConfirm}
          id="confirm-swap-or-send"
        >
          {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
        </ButtonCTA>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
