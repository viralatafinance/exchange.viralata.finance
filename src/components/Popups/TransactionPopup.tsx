import React, { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import { Link, Text } from '@geist-ui/react'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { getBscScanLink } from '../../utils'
import { ExternalLink } from '../Shared'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

const StyledLink = styled(Link)`
  font-size: 15px;
  font-weight: 600;
  color: #333 !important;
  margin-top: -10px;

  &:hover {
    color: #4bf2cd !important;
  }
`

export default function TransactionPopup({ hash, success, summary }: { hash: string; success?: boolean; summary?: string }) {
  const { chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>{success ? <CheckCircle color="#4bf2cd" size={24} /> : <AlertCircle color="#4bf2cd" size={24} />}</div>
      <AutoColumn gap="8px">
        <Text style={{ margin: 0, fontSize: 14 }}>{summary ?? `Hash: ${hash.slice(0, 8)}...${hash.slice(58, 65)}`}</Text>
        {chainId && (
          <StyledLink target="_blank" href={getBscScanLink(chainId, hash, 'transaction')}>
            View on bscscan
          </StyledLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
