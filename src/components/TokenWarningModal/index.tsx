import { Token } from '@pancakeswap-libs/sdk'
import { transparentize } from 'polished'
import { Modal, Text, Checkbox, Link } from '@geist-ui/react'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AlertTriangle } from 'react-feather'
import useI18n from 'hooks/useI18n'
import ButtonCTA from 'components/ButtonCTA'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens } from '../../hooks/Tokens'
import { getBscScanLink, shortenAddress } from '../../utils'
import { ExternalLink } from '../Shared'
import CurrencyLogo from '../CurrencyLogo'
import { AutoRow, RowBetween } from '../Row'
import { AutoColumn } from '../Column'

const Wrapper = styled.div<{ error: boolean }>`
  background: #fff;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #f6f6f6;
`

const WarningContainer = styled.div`
  max-width: 420px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  overflow: auto;
  text-align: left;
  margin-top: 20px;
`

const StyledWarningIcon = styled(AlertTriangle)`
  stroke: #4bf2cd;
`

const StyledText = styled(Text)`
  font-size: 16px;
  margin: 0px 0px;
  font-weight: 400;
`

const CheckboxWrapper = styled.div`
  margin-top: 5px;
  label {
    justify-content: start;
    font-size: 24px;
    font-weight: 500;
  }
`

const StyledLink = styled(Link)`
  font-size: 15px;
  font-weight: 600;
  color: #111 !important;
  margin-top: 5px;

  &:hover {
    color: #4bf2cd !important;
  }
`

interface TokenWarningCardProps {
  token?: Token
}

function TokenWarningCard({ token }: TokenWarningCardProps) {
  const { chainId } = useActiveWeb3React()
  const TranslateString = useI18n()
  const tokenSymbol = token?.symbol?.toLowerCase() ?? ''
  const tokenName = token?.name?.toLowerCase() ?? ''

  const allTokens = useAllTokens()

  const duplicateNameOrSymbol = useMemo(() => {
    if (!token || !chainId) return false

    return Object.keys(allTokens).some((tokenAddress) => {
      const userToken = allTokens[tokenAddress]
      if (userToken.equals(token)) {
        return false
      }
      return userToken.symbol?.toLowerCase() === tokenSymbol || userToken.name?.toLowerCase() === tokenName
    })
  }, [token, chainId, allTokens, tokenSymbol, tokenName])

  if (!token) return null

  return (
    <Wrapper error={duplicateNameOrSymbol}>
      <AutoRow gap="6px">
        <AutoColumn gap="24px">
          <CurrencyLogo currency={token} size="32px" />
        </AutoColumn>
        <AutoColumn gap="0px" justify="flex-start">
          <StyledText style={{ fontWeight: 700 }}>
            {token && token.name && token.symbol && token.name !== token.symbol ? `${token.name} (${token.symbol})` : token.name || token.symbol}{' '}
          </StyledText>
          {chainId && (
            <StyledLink style={{ fontWeight: 700 }} href={getBscScanLink(chainId, token.address, 'token')}>
              {shortenAddress(token.address)} {TranslateString(116, '(View on BscScan)')}
            </StyledLink>
          )}
        </AutoColumn>
      </AutoRow>
    </Wrapper>
  )
}

export default function TokenWarningModal({ isOpen, tokens, onConfirm }: { isOpen: boolean; tokens: Token[]; onConfirm: () => void }) {
  const [understandChecked, setUnderstandChecked] = useState(false)
  const toggleUnderstand = useCallback(() => setUnderstandChecked((uc) => !uc), [])
  const TranslateString = useI18n()

  const handleDismiss = useCallback(() => null, [])

  return (
    <Modal disableBackdropClick open={isOpen}>
      <Modal.Title>
        <StyledWarningIcon />
        <StyledText style={{ color: '#4bf2cd', fontSize: 20, fontWeight: 500, marginLeft: 5 }}>{TranslateString(1128, 'Token imported')}</StyledText>
      </Modal.Title>
      <WarningContainer className="token-warning-container">
        <AutoColumn gap="24px">
          <StyledText>
            {TranslateString(
              1130,
              'Anyone can create a BEP20 token on BSC with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.'
            )}
          </StyledText>
          <StyledText>
            {TranslateString(
              1132,
              'This interface can load arbitrary tokens by token addresses. Please take extra caution and do your research when interacting with arbitrary BEP20 tokens.'
            )}
          </StyledText>
          <StyledText>{TranslateString(1134, 'If you purchase an arbitrary token, you may be unable to sell it back.')}</StyledText>
          {tokens.map((token) => {
            return <TokenWarningCard key={token.address} token={token} />
          })}
          <CheckboxWrapper>
            <Checkbox checked={understandChecked} onChange={toggleUnderstand} size="large">
              {TranslateString(148, 'I understand')}
            </Checkbox>
          </CheckboxWrapper>
          <ButtonCTA
            disabled={!understandChecked}
            className="token-dismiss-button"
            onClick={() => {
              onConfirm()
            }}
          >
            {TranslateString(150, 'Continue')}
          </ButtonCTA>
        </AutoColumn>
      </WarningContainer>
    </Modal>
  )
}
