import React from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap-libs/uikit'
import { ButtonGroup, Button, Tabs } from '@geist-ui/react'
import useI18n from 'hooks/useI18n'

const StyledNav = styled.div`
  margin-bottom: 40px;
  z-index: 3;
`

function Nav({ activeIndex = 0 }: { activeIndex?: number }) {
  const TranslateString = useI18n()
  const history = useHistory()
  return (
    <StyledNav>
      <ButtonGroup size="large" defaultValue={activeIndex}>
        <Button
          style={{ color: '#333', backgroundColor: activeIndex === 0 ? '#eee' : 'white' }}
          onClick={() => {
            history.push('/swap')
          }}
        >
          {TranslateString(1142, 'Swap')}
        </Button>
        <Button
          style={{ color: '#333', backgroundColor: activeIndex === 1 ? '#eee' : 'white' }}
          onClick={() => {
            history.push('/pool')
          }}
        >
          {TranslateString(262, 'Liquidity')}
        </Button>
        <Button
          style={{ color: '#333', backgroundColor: activeIndex === 2 ? '#eee' : 'white' }}
          onClick={() => {
            window.open('https://www.binance.org/en/bridge', '_blank')
          }}
        >
          Bridge
        </Button>
      </ButtonGroup>
    </StyledNav>
  )
}

export default Nav
