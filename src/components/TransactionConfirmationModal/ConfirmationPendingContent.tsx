import React from 'react'
import styled from 'styled-components'
import { Text, Spinner, Modal } from '@geist-ui/react'
import { AutoColumn } from '../Column'
import { Wrapper, Section, ConfirmedIcon } from './helpers'

type ConfirmationPendingContentProps = { pendingText: string }

const StyledText = styled(Text)`
  margin: 0;
  font-size: 14px;
`

const StyledSpinner = styled(Spinner)`
  & span {
    background-color: #4bf2cd !important;
  }
`

const ConfirmationPendingContent = ({ pendingText }: ConfirmationPendingContentProps) => {
  return (
    <Wrapper>
      <Section>
        <Modal.Title>Waiting for confirmation</Modal.Title>
        <ConfirmedIcon>
          <StyledSpinner style={{ color: '#4bf2cd', width: 64, margin: '2rem 0' }} size="large" />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <AutoColumn gap="12px" justify="center">
            <StyledText>
              <strong>{pendingText}</strong>
            </StyledText>
          </AutoColumn>
          <StyledText>Confirm this transaction in your wallet</StyledText>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export default ConfirmationPendingContent
