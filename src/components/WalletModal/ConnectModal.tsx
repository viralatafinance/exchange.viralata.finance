import React from 'react'
import styled from 'styled-components'
import { HelpIcon } from '@pancakeswap-libs/uikit'
import { Modal, Link } from '@geist-ui/react'
import WalletCard from './WalletCard'
import config from './config'
import { Login } from './types'

interface Props {
  isOpen: boolean
  login: Login
  onDismiss?: () => void
}

const HelpLink = styled(Link)`
  display: flex;
  align-self: center;
  align-items: center;
  margin-top: 24px;
`

const ConnectModal: React.FC<Props> = ({ isOpen, login, onDismiss = () => null }) => (
  <Modal open={isOpen} onClose={onDismiss}>
    <Modal.Title>Connect to a wallet</Modal.Title>
    {config.map((entry, index) => (
      <WalletCard key={entry.title} login={login} walletConfig={entry} onDismiss={onDismiss} mb={index < config.length - 1 ? '8px' : '0'} />
    ))}
    <HelpLink href="https://docs.pancakeswap.finance/guides/faq#how-do-i-set-up-my-wallet-on-binance-smart-chain">
      <HelpIcon color="primary" mr="6px" />
      Learn how to connect
    </HelpLink>
  </Modal>
)

export default ConnectModal
