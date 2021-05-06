import { Currency, CurrencyAmount, Fraction, Percent } from '@pancakeswap-libs/sdk'
import React from 'react'
import { Button } from '@pancakeswap-libs/uikit'
import { Text } from '@geist-ui/react'
import styled from 'styled-components'
import ButtonCTA from 'components/ButtonCTA'
import { TranslateString } from 'utils/translateTextHelpers'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'

const StyledText = styled(Text)`
  font-size: 14px;
  margin: 0;
`

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  return (
    <>
      <RowBetween>
        <StyledText>{currencies[Field.CURRENCY_A]?.symbol} Deposited</StyledText>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <StyledText>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</StyledText>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <StyledText>{currencies[Field.CURRENCY_B]?.symbol} Deposited</StyledText>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <StyledText>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</StyledText>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <StyledText>Rates</StyledText>
        <StyledText>{`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${currencies[Field.CURRENCY_B]?.symbol}`}</StyledText>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <StyledText>{`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${currencies[Field.CURRENCY_A]?.symbol}`}</StyledText>
      </RowBetween>
      <RowBetween>
        <StyledText>Share of Pool:</StyledText>
        <StyledText>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</StyledText>
      </RowBetween>
      <ButtonCTA onClick={onAdd}>{noLiquidity ? TranslateString(250, 'Create Pool & Supply') : TranslateString(252, 'Confirm Supply')}</ButtonCTA>
    </>
  )
}

export default ConfirmAddModalBottom
