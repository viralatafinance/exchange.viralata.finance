import React from 'react'
import styled from 'styled-components'
import { Card } from '@geist-ui/react'

export const BodyWrapper = styled(Card)`
  position: relative;
  width: 90%;
  z-index: 5;
  padding: 0px !important;
  min-width: 360px;
  max-width: 420px;

  background: rgb(255, 255, 255) !important;
  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px !important;
  border-radius: 5px !important;
  border: none !important;

  margin-top: 12vh !important;

  & > div.content {
    padding: 20px 20px !important;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
