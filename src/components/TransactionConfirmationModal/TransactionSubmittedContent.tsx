import { ChainId } from '@pancakeswap-libs/sdk'
import React from 'react'
import { Modal, Link } from '@geist-ui/react'
import styled from 'styled-components'
import { ArrowUpCircle } from 'react-feather'
import ButtonCTA from 'components/ButtonCTA'
import { AutoColumn } from '../Column'
import { getBscScanLink } from '../../utils'
import { Wrapper, Section, ConfirmedIcon } from './helpers'

const StyledLink = styled(Link)`
  font-size: 15px;
  font-weight: 600;
  color: #333 !important;
  margin-top: -10px;

  &:hover {
    color: #4bf2cd !important;
  }
`

type TransactionSubmittedContentProps = {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
}

const TransactionSubmittedContent = ({ onDismiss, chainId, hash }: TransactionSubmittedContentProps) => {
  return (
    <Wrapper>
      <Section>
        <Modal.Title>Transaction submitted</Modal.Title>
        <ConfirmedIcon>
          <ArrowUpCircle strokeWidth={0.5} size={80} color="#4bf2cd" />
        </ConfirmedIcon>
        <AutoColumn gap="8px" justify="center">
          {chainId && hash && (
            <StyledLink target="_blank" href={getBscScanLink(chainId, hash, 'transaction')}>
              View on BscScan
            </StyledLink>
          )}
          <ButtonCTA onClick={onDismiss} style={{ marginTop: '20px' }}>
            Close
          </ButtonCTA>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export default TransactionSubmittedContent
