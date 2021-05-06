import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Trade, TradeType } from '@pancakeswap-libs/sdk'
import { Text } from '@geist-ui/react'
import { ArrowDown, AlertTriangle } from 'react-feather'
import ButtonCTA from 'components/ButtonCTA'
import { isAddress, shortenAddress } from '../../utils'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { SwapShowAcceptChanges } from './styleds'

const StyledText = styled(Text)`
  margin: 0;
  fontsize: 14px;
`

const StyledAcceptButton = styled(ButtonCTA)`
  margin: 0 !important;
  min-width: auto !important;
  width: auto !important;
`

export default function SwapModalHeader({
  trade,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  // const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [trade, allowedSlippage])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap="md" style={{ marginTop: '25px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.inputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <StyledText
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? '#4bf2cd' : '#333',
            }}
          >
            {trade.inputAmount.toSignificant(6)}
          </StyledText>
        </RowFixed>
        <RowFixed gap="0px">
          <StyledText style={{ fontSize: 18, marginLeft: '10px', fontWeight: 500 }}>{trade.inputAmount.currency.symbol}</StyledText>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color="#4bf2cd" style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <StyledText
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: priceImpactSeverity > 2 ? theme.colors.failure : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT ? '#4bf2cd' : '#333',
            }}
          >
            {trade.outputAmount.toSignificant(6)}
          </StyledText>
        </RowFixed>
        <RowFixed gap="0px">
          <StyledText style={{ fontSize: 20, marginLeft: '10px', fontWeight: 500 }}>{trade.outputAmount.currency.symbol}</StyledText>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ color: '#4bf2cd', marginRight: '8px', minWidth: 24 }} />
              <StyledText style={{ color: '#4bf2cd' }}> Price Updated</StyledText>
            </RowFixed>
            <StyledAcceptButton onClick={onAcceptChanges}>Accept</StyledAcceptButton>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}

      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '16px 0 0' }}>
          <Text>
            Output will be sent to <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
