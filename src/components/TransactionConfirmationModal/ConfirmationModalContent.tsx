import React from 'react'
import { Modal } from '@geist-ui/react'
import styled from 'styled-components'
import { Wrapper, Section, BottomSection } from './helpers'

const ModalTitle = styled(Modal.Title)`
  text-transform: none !important;
`

type ConfirmationModalContentProps = {
  title: string
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}

const ConfirmationModalContent = ({ title, bottomContent, topContent }: ConfirmationModalContentProps) => {
  return (
    <Wrapper>
      <Section>
        <ModalTitle>{title}</ModalTitle>
        {topContent()}
      </Section>
      <BottomSection gap="12px">{bottomContent()}</BottomSection>
    </Wrapper>
  )
}

export default ConfirmationModalContent
