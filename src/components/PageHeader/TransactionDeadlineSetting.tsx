import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text, Input } from '@geist-ui/react'
import { useUserDeadline } from 'state/user/hooks'
import useI18n from 'hooks/useI18n'
import QuestionHelper from '../QuestionHelper'

const StyledTransactionDeadlineSetting = styled.div`
  margin-bottom: 16px;
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 0px;
`

const Field = styled.div`
  align-items: center;
  display: inline-flex;
`

const TransactionDeadlineSetting = () => {
  const TranslateString = useI18n()
  const [deadline, setDeadline] = useUserDeadline()
  const [value, setValue] = useState(deadline / 60) // deadline in minutes
  const [error, setError] = useState<string | null>(null)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseInt(inputValue, 10))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 60
      if (!Number.isNaN(rawValue) && rawValue > 0) {
        setDeadline(rawValue)
        setError(null)
      } else {
        setError(TranslateString(1150, 'Enter a valid deadline'))
      }
    } catch {
      setError(TranslateString(1150, 'Enter a valid deadline'))
    }
  }, [value, setError, setDeadline, TranslateString])

  return (
    <StyledTransactionDeadlineSetting>
      <Label>
        <Text style={{ fontWeight: 600, margin: 0 }}>{TranslateString(90, 'Transaction deadline')}</Text>
        <QuestionHelper text={TranslateString(188, 'Your transaction will revert if it is pending for more than this long.')} />
      </Label>
      <Field>
        <Input status={error !== null ? 'error' : 'default'} style={{ width: 80 }} type="number" size="large" step="1" min="1" value={value.toString()} onChange={handleChange} />
        <Text type={error !== null ? 'error' : 'default'} style={{ marginLeft: 10 }}>minutes</Text>
      </Field>
      {error && (
        <Text type="error" style={{ margin: 0, fontSize: 14 }}>
          {error}
        </Text>
      )}
    </StyledTransactionDeadlineSetting>
  )
}

export default TransactionDeadlineSetting
