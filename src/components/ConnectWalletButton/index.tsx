import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { ButtonProps, ConnectorNames } from '@pancakeswap-libs/uikit'
import { useModal } from '@geist-ui/react'

import { useWalletModal } from 'components/WalletModal'
import ConnectModal from 'components/WalletModal/ConnectModal'
import AccountModal from 'components/WalletModal/AccountModal'
import { connectorsByName } from 'connectors'
import useI18n from 'hooks/useI18n'
import ButtonCTA from 'components/ButtonCTA'

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n()
  const { account, activate, deactivate } = useWeb3React()
  const connectModal = useModal(false)
  const accountModal = useModal(false)

  const handleLogin = (connectorId: ConnectorNames) => {
    const connector = connectorsByName[connectorId]
    if (connector) {
      activate(connector)
    }
  }
  return (
    <>
      <ConnectModal isOpen={connectModal.visible} onDismiss={() => connectModal.setVisible(false)} login={handleLogin} />
      <AccountModal isOpen={accountModal.visible} onDismiss={() => accountModal.setVisible(false)} account={account || ''} logout={deactivate} />
      <ButtonCTA
        onClick={() => {
          if (account) {
            accountModal.setVisible(true)
          } else {
            connectModal.setVisible(true)
          }
        }}
      >
        {TranslateString(292, 'Unlock Wallet')}
      </ButtonCTA>
    </>
  )
}

export default UnlockButton
