import React, { useCallback, useState } from 'react'
import { HelpCircle } from '@geist-ui/react-icons'

import styled from 'styled-components'
import { Tooltip } from '@geist-ui/react'

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  background-color: #fff;
  color: #333;

  :hover,
  :focus {
    color: #111;
  }
`

export default function QuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <Tooltip text={text} visible={show}>
      <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
        <HelpCircle size={18} />
      </QuestionWrapper>
    </Tooltip>
  )
}
