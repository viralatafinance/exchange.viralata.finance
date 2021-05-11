import React from 'react'
import { Button, Flex, connectorLocalStorageKey } from '@pancakeswap-libs/uikit'
import { Modal, Text, Link } from '@geist-ui/react'
import CopyToClipboard from './CopyToClipboard'

interface Props {
  isOpen: boolean
  account: string
  logout: () => void
  onDismiss?: () => void
}

const AccountModal: React.FC<Props> = ({ isOpen, account, logout, onDismiss = () => null }) => (
  <Modal open={isOpen} onClose={onDismiss}>
    <Modal.Title>Your wallet</Modal.Title>
    <Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '8px' }}>{account}</Text>
    <Flex mb="32px" justifyContent="space-around">
      <Link href={`https://bscscan.com/address/${account}`}>View on BscScan</Link>
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
