import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { Settings } from '@geist-ui/react-icons'
import { Text, Link, Modal } from '@geist-ui/react'
import useI18n from 'hooks/useI18n'
import SlippageToleranceSetting from './SlippageToleranceSetting'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'

interface PageHeaderProps {
  title: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
}

const StyledPageHeader = styled.div`
  padding: 0px;
`

const Details = styled.div`
  flex: 1;
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

const PageHeader = ({ title, rightIcon, children }: PageHeaderProps) => {
  const [modalVisible, setModalVisible] = useState(false)
  const TranslateString = useI18n()

  return (
    <StyledPageHeader>
      <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Title>Settings</Modal.Title>
        <Modal.Content>
          <SlippageToleranceSetting />
          <TransactionDeadlineSetting />
        </Modal.Content>
      </Modal>
      <Flex alignItems="center">
        <Details>
          <Text h4 style={{ margin: 0 }}>
            {title}
          </Text>
        </Details>
        {rightIcon && <>{rightIcon}</>}
        {!rightIcon && (
          <StyledLink
            href={undefined}
            onClick={(e) => {
              e.preventDefault()
              setModalVisible(true)
            }}
            title={TranslateString(1200, 'Settings')}
          >
            <Settings />
          </StyledLink>
        )}
      </Flex>
      {children && <Text>{children}</Text>}
    </StyledPageHeader>
  )
}

export default PageHeader
