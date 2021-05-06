import React, { useState } from 'react'
import { JSBI, Pair, Percent } from '@pancakeswap-libs/sdk'
import { Button, Card as UIKitCard, CardBody } from '@pancakeswap-libs/uikit'
import { Text, Link } from '@geist-ui/react'
import { darken } from 'polished'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import Card from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const StyledText = styled(Text)`
  font-size: 14px;
  margin: 0;
  color: #111 !important;
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

interface PositionCardProps {
  pair: Pair
  // eslint-disable-next-line react/no-unused-prop-types
  showUnwrapped?: boolean
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false), pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && (
        <AutoColumn gap="6px" style={{ padding: 20, border: '1px solid #f6f6f6', borderRadius: 5 }}>
          <FixedHeightRow>
            <StyledText style={{ textTransform: 'uppercase', fontWeight: 600, width: '100%', textAlign: 'center', marginBottom: 20 }}>LP Tokens in your Wallet</StyledText>
          </FixedHeightRow>
          <FixedHeightRow onClick={() => setShowMore(!showMore)}>
            <RowFixed>
              <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
              <StyledText>
                {currency0.symbol}/{currency1.symbol}
              </StyledText>
            </RowFixed>
            <RowFixed>
              <StyledText>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</StyledText>
            </RowFixed>
          </FixedHeightRow>
          <AutoColumn gap="4px">
            <FixedHeightRow>
              <StyledText>{currency0.symbol}:</StyledText>
              {token0Deposited ? (
                <RowFixed>
                  <StyledText style={{ marginLeft: 6 }}>{token0Deposited?.toSignificant(6)}</StyledText>
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <StyledText>{currency1.symbol}:</StyledText>
              {token1Deposited ? (
                <RowFixed>
                  <StyledText style={{ marginLeft: 6 }}>{token1Deposited?.toSignificant(6)}</StyledText>
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
          </AutoColumn>
        </AutoColumn>
      )}
    </>
  )
}

export default function FullPositionCard({ pair }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const HoverCard = styled(Card)`
    border: 1px solid ${showMore ? '#4bf2cd' : 'transparent'};

    :hover {
      border: 1px solid #4bf2cd;
    }

    border-radius: 5px;
    padding: 0;
  `

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw) ? new Percent(userPoolBalance.raw, totalPoolTokens.raw) : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false), pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)]
      : [undefined, undefined]

  return (
    <HoverCard>
      <AutoColumn gap="12px">
        <FixedHeightRow onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer', padding: '30px 20px' }}>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
            <StyledText style={{ fontWeight: 500, fontSize: 16 }}>{!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}</StyledText>
          </RowFixed>
          <RowFixed>{showMore ? <ChevronUp size="20" style={{ marginLeft: '10px' }} /> : <ChevronDown size="20" style={{ marginLeft: '10px' }} />}</RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px" style={{ padding: '0px 20px 20px' }}>
            <FixedHeightRow>
              <RowFixed>
                <StyledText>Pooled {currency0.symbol}:</StyledText>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <StyledText style={{ marginLeft: 6 }}>{token0Deposited?.toSignificant(6)}</StyledText>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px', width: 20 }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <StyledText>Pooled {currency1.symbol}:</StyledText>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <StyledText style={{ marginLeft: 6 }}>{token1Deposited?.toSignificant(6)}</StyledText>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px', width: 20 }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <StyledText>Your pool tokens:</StyledText>
              <StyledText>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</StyledText>
            </FixedHeightRow>
            <FixedHeightRow>
              <StyledText>Your pool share:</StyledText>
              <StyledText>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(2)}%` : '-'}</StyledText>
            </FixedHeightRow>

            <RowBetween marginTop="10px">
              <StyledLink href={`#/add/${currencyId(currency0)}/${currencyId(currency1)}`} style={{ width: '48%', textAlign: 'center', display: 'block' }}>
                Add
              </StyledLink>
              <StyledLink style={{ width: '48%', textAlign: 'center', display: 'block' }} href={`#/remove/${currencyId(currency0)}/${currencyId(currency1)}`}>
                Remove
              </StyledLink>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  )
}
