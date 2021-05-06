import React from 'react'
import styled from 'styled-components'
import { Modal, Text } from '@geist-ui/react'
import ButtonCTA from 'components/ButtonCTA'
import { AlertTriangle } from 'react-feather'
import { AutoColumn } from '../Column'
import { Wrapper, Section, BottomSection } from './helpers'

const StyledText = styled(Text)`
  margin: 0;
  font-size: 14px;
`

type TransactionErrorContentProps = { message: string; onDismiss: () => void }

const TransactionErrorContent = ({ message, onDismiss }: TransactionErrorContentProps) => {
  return (
    <Wrapper>
      <Section>
        <Modal.Title>Error</Modal.Title>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0 0' }} gap="24px" justify="center">
          <AlertTriangle style={{ stroke: '#4bf2cd', strokeWidth: 1.5 }} size={64} />
          <StyledText style={{ textAlign: 'center', fontSize: 16, color: '#4bf2cd', width: '85%' }}>{message}</StyledText>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonCTA onClick={onDismiss}>Dismiss</ButtonCTA>
      </BottomSection>
    </Wrapper>
  )
}

export default TransactionErrorContent
