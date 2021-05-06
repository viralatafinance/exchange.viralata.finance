import React from 'react'
import { Button, Text, LinkExternal, Flex, Modal, connectorLocalStorageKey } from '@pancakeswap-libs/uikit'
import CopyToClipboard from './CopyToClipboard'

interface Props {
  account: string
  logout: () => void
  onDismiss?: () => void
}

const AccountModal: React.FC<Props> = ({ account, logout, onDismiss = () => null }) => (
  <Modal title="Your wallet" onDismiss={onDismiss}>
    <Text fontSize="20px" bold style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '8px' }}>
      {account}
    </Text>
    <Flex mb="32px">
      <LinkExternal small href={`https://bscscan.com/address/${account}`} mr="16px">
        View on BscScan
      </LinkExternal>
      <CopyToClipboard toCopy={account}>Copy Address</CopyToClipboard>
    </Flex>
    <Flex justifyContent="center">
      <Button
        scale="sm"
        variant="secondary"
        onClick={() => {
          logout()
          window.localStorage.removeItem(connectorLocalStorageKey)
          onDismiss()
        }}
      >
        Logout
      </Button>
    </Flex>
  </Modal>
)

export default AccountModal
