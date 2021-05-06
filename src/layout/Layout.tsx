import { Page } from '@geist-ui/react'
import React from 'react'
import styled from 'styled-components'
import Header from './Header'

const Layout: React.FC = ({ children }) => {

  const StyledPage = styled(Page)`
    padding: 0px !important;
    min-height: 100vh;

    & > main {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    & main {
      padding: 0px !important;
    }
    & footer {
      width: 100% !important;
    }
  `

  const StyledContent = styled(Page.Content)`
    padding: 0px !important;
    width: 100%;
  `

  return (
    <StyledPage size="100%">
      <Header />
      <StyledContent>{children}</StyledContent>
      {/* <Footer /> */}
    </StyledPage>
  )
}
export default Layout
