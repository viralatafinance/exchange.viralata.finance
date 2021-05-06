import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@pancakeswap-libs/sdk'
import { CardBody } from '@pancakeswap-libs/uikit'
import { Text, Link } from '@geist-ui/react'
import { PlusCircle } from '@geist-ui/react-icons'
import Question from 'components/QuestionHelper'
import FullPositionCard from 'components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { StyledInternalLink } from 'components/Shared'
import { LightCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'

import { useActiveWeb3React } from 'hooks'
import { usePairs } from 'data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { Dots } from 'components/swap/styleds'
import useI18n from 'hooks/useI18n'
import PageHeader from 'components/PageHeader'
import AppBody from '../AppBody'

const StyledLink = styled(Link)`
  font-size: 16px !important;
  font-weight: 600;
  color: #111 !important;
  margin-top: 5px;

  &:hover {
    color: #4bf2cd !important;
  }
`

const StyledText = styled(Text)`
  font-size: 14px;
  margin: 0;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const TranslateString = useI18n()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(() => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })), [trackedTokenPairs])
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken), [tokenPairsWithLiquidityTokens])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens)

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(() => tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) => v2PairsBalances[liquidityToken.address]?.greaterThan('0')), [
    tokenPairsWithLiquidityTokens,
    v2PairsBalances,
  ])

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading = fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  return (
    <>
      <AppBody>
        <PageHeader
          title={TranslateString(262, 'Pool')}
          rightIcon={
            <StyledLink id="join-pool-button" href="#/add/ETH" style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
              <PlusCircle />
              <div style={{ width: 5 }} />
              {TranslateString(168, 'Add Liquidity')}
            </StyledLink>
          }
        />
        <AutoColumn gap="12px" justify="center">
          <CardBody style={{ width: '100%', padding: '12px', border: '1px solid #f6f6f6', borderRadius: 5, marginTop: 24 }}>
            <AutoColumn gap="12px" style={{ width: '100%' }}>
              <RowBetween padding="0 8px">
                <StyledText>{TranslateString(107, 'Your Liquidity')}</StyledText>
                <Question
                  text={TranslateString(
                    1170,
                    'When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.'
                  )}
                />
              </RowBetween>

              {!account ? (
                <LightCard padding="40px">
                  <StyledText style={{ textAlign: 'center', color: '#999', fontWeight: 500 }}>{TranslateString(156, 'Connect to a wallet to view your liquidity.')}</StyledText>
                </LightCard>
              ) : v2IsLoading ? (
                <LightCard padding="40px">
                  <StyledText style={{ textAlign: 'center' }}>
                    <Dots>Loading</Dots>
                  </StyledText>
                </LightCard>
              ) : allV2PairsWithLiquidity?.length > 0 ? (
                <>
                  {allV2PairsWithLiquidity.map((v2Pair) => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                </>
              ) : (
                <LightCard padding="40px">
                  <StyledText style={{ textAlign: 'center', color: '#999', fontWeight: 500 }}>{TranslateString(104, 'No liquidity found.')}</StyledText>
                </LightCard>
              )}
            </AutoColumn>
          </CardBody>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <StyledText style={{ padding: '.5rem 0 .6rem 0' }}>
              {TranslateString(106, "Don't see a pool you joined?")}{' '}
              <StyledLink id="import-pool-link" href="#/find">
                {TranslateString(108, 'Import it.')}
              </StyledLink>
            </StyledText>
          </div>
        </AutoColumn>
      </AppBody>
    </>
  )
}
