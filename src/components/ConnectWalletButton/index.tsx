import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { ButtonProps, ConnectorNames } from '@pancakeswap-libs/uikit'
import { useWalletModal } from 'components/WalletModal'
import { connectorsByName } from 'connectors'
import useI18n from 'hooks/useI18n'
import ButtonCTA from 'components/ButtonCTA'

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n()
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId: ConnectorNames) => {
    const connector = connectorsByName[connectorId]
    if (connector) {
      activate(connector)
    }
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return <ButtonCTA onClick={onPresentConnectModal}>{TranslateString(292, 'Unlock Wallet')}</ButtonCTA>
}

export default UnlockButton
