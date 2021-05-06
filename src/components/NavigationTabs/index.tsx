import React from 'react'
import styled from 'styled-components'
// import { Link as HistoryLink } from 'react-router-dom'
import { Link } from '@geist-ui/react'
import { ArrowLeft } from '@geist-ui/react-icons'
import { RowBetween } from 'components/Row'
import QuestionHelper from 'components/QuestionHelper'
import useI18n from 'hooks/useI18n'

const Tabs = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: #111 !important;
`

const StyledLink = styled(Link)`
  font-size: 16px !important;
  font-weight: 600;
  color: #333 !important;

  &:hover {
    color: #4bf2cd !important;
  }

  svg {
    // fill: currentColor !important;
    color: inherit !important;
  }

  svg:hover {
    // fill: currentColor !important;
    color: inherit !important;
  }
`

export function FindPoolTabs() {
  const TranslateString = useI18n()
  return (
    <Tabs>
      <RowBetween style={{ padding: '0px 0px 15px 0px' }}>
        <StyledLink href="#/pool">
          <StyledArrowLeft />
        </StyledLink>
        <ActiveText>Import Pool</ActiveText>
        <QuestionHelper text={TranslateString(256, 'Use this tool to find pairs that do not automatically appear in the interface.')} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  const TranslateString = useI18n()
  return (
    <Tabs>
      <RowBetween style={{ padding: '0px 0px 20px 0px' }}>
        <StyledLink href="#/pool">
          <StyledArrowLeft />
        </StyledLink>
        <ActiveText>{adding ? TranslateString(258, 'Add') : TranslateString(260, 'Remove')} Liquidity</ActiveText>
        <QuestionHelper
          text={
            adding
              ? TranslateString(
                  264,
                  'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
                )
              : TranslateString(
                  266,
                  'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
                )
          }
        />
      </RowBetween>
    </Tabs>
  )
}
