import { Grid, Page, Tag, useMediaQuery, useModal } from '@geist-ui/react'
import { ConnectorNames, useWalletModal } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { connectorsByName } from 'connectors'
import React from 'react'
import styled from 'styled-components'

const StyledPageHeader = styled(Page.Header)`
  padding: 40px;
  position: fixed;
  z-index: 999;
`

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`

const Logo = styled.a`
  display: flex;
  color: #000;
`

const LogoImage = styled.img`
  height: 80px !important;
`

const StyledConnect = styled(Tag)`
  border: 2px solid #4bf2cd;
  background: transparent;
  color: #4bf2cd;
  font-size: 16px !important;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid #4bf2cd;
  padding: 10px 25px !important;
  height: auto !important;
  border-radius: 6px;
  display: inline-block;
  font-weight: 700;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  cursor: pointer;
  line-height: inherit !important;

  :hover {
    transform: scale(1.05);
  }
`

const Header: React.FC = () => {
  const { setVisible, bindings } = useModal()
  const isDesktop = useMediaQuery('md', { match: 'up' })

  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId: ConnectorNames) => {
    const connector = connectorsByName[connectorId]
    if (connector) {
      activate(connector)
    }
  }

  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <StyledPageHeader>
      <Grid.Container justify="center">
        <Logo href="https://viralata.finance">
          <LogoImage src={isDesktop ? '/images/logo-white.png' : '/images/logo.png'} alt="Vira-lata Finance" />
        </Logo>
        <Grid xs alignItems="center" justify="flex-end" />
        <FlexDiv>
          <StyledConnect onClick={account ? onPresentAccountModal : onPresentConnectModal}>
            {account ? `${account.substr(0, 4)}...${account.substr(-4)}` : `Connect Wallet`}
          </StyledConnect>
        </FlexDiv>
      </Grid.Container>
    </StyledPageHeader>
  )
}
export default Header
