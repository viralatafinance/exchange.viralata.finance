import React from 'react'
import { Trade, TradeType } from '@pancakeswap-libs/sdk'
import { ChevronRight } from 'react-feather'
import { Card, Text } from '@geist-ui/react'
import useI18n from 'hooks/useI18n'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'

function TradeSummary({ trade, allowedSlippage, showRoute }: { trade: Trade; allowedSlippage: number; showRoute: boolean }) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const TranslateString = useI18n()

  return (
    <Card style={{ border: 'none' }}>
      <Card.Body>
        <RowBetween>
          <RowFixed>
            <Text style={{ margin: 0, fontSize: 14 }}>{isExactIn ? TranslateString(1210, 'Minimum received') : TranslateString(220, 'Maximum sold')}</Text>
            <QuestionHelper text={TranslateString(202, 'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.')} />
          </RowFixed>
          <RowFixed>
            <Text style={{ margin: 0, fontSize: 14 }}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ?? '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text style={{ margin: 0, fontSize: 14 }}>Price Impact</Text>
            <QuestionHelper text={TranslateString(224, 'The difference between the market price and estimated price due to trade size.')} />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text style={{ margin: 0, fontSize: 14 }}>Liquidity Provider Fee</Text>
            <QuestionHelper text={TranslateString(230, 'For each trade a 0.2% fee is paid. 0.17% goes to liquidity providers and 0.03% goes to the PancakeSwap treasury.')} />
          </RowFixed>
          <Text style={{ margin: 0, fontSize: 14 }}>{realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}</Text>
        </RowBetween>

        {showRoute && (
          <RowBetween>
            <RowFixed>
              <Text style={{ margin: 0, fontSize: 14 }}>Route</Text>
              <QuestionHelper text={TranslateString(999, 'Routing through these tokens resulted in the best price for your trade.')} />
            </RowFixed>
            <Text style={{ margin: 0, fontSize: 14 }}>
              {trade.route.path.map((token, i, path) => {
                const isLastItem: boolean = i === path.length - 1
                return (
                  <>
                    {token.symbol}
                    {isLastItem ? null : <ChevronRight style={{color: '#333', width: 12, height: 12}} color="#333" />}
                  </>
                )
              })}
            </Text>
          </RowBetween>
        )}
      </Card.Body>
    </Card>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()
  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} showRoute={showRoute} />
          {/* {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <Text style={{ margin: 0, fontSize: 14 }}>Route</Text>
                  <QuestionHelper text={TranslateString(999, 'Routing through these tokens resulted in the best price for your trade.')} />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )} */}
        </>
      )}
    </AutoColumn>
  )
}
