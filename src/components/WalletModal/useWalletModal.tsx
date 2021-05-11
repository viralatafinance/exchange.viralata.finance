import React from 'react'
import { useModal } from '@pancakeswap-libs/uikit'
import ConnectModal from './ConnectModal'
import AccountModal from './AccountModal'
import { Login } from './types'

interface ReturnType {
  onPresentConnectModal: () => void
  onPresentAccountModal: () => void
}

const useWalletModal = (login: Login, logout: () => void, account?: string): ReturnType => {
  const [onPresentConnectModal] = useModal(<ConnectModal isOpen={false} login={login} />)
  const [onPresentAccountModal] = useModal(<AccountModal isOpen={false}  account={account || ''} logout={logout} />)
  return { onPresentConnectModal, onPresentAccountModal }
}

export default useWalletModal
