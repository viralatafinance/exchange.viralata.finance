import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { Text, Button, Input } from '@geist-ui/react'
import { useUserSlippageTolerance } from 'state/user/hooks'
import useI18n from 'hooks/useI18n'
import QuestionHelper from '../QuestionHelper'

const MAX_SLIPPAGE = 5000
const RISKY_SLIPPAGE_LOW = 50
const RISKY_SLIPPAGE_HIGH = 500

const StyledSlippageToleranceSettings = styled.div`
  margin-bottom: 24px;
`

const Option = styled.div`
  padding: 0 4px;
`

const Options = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;

  ${Option}:first-child {
    padding-left: 0;
  }

  ${Option}:last-child {
    padding-right: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 10px;
`

const StyleButton = styled(Button)`
  color: #666 !important;
  border: 1px solid #ddd !important;

  &:hover {
    // background-color: #4bf2cd !important;
    color: #4bf2cd !important;
    border: 1px solid #4bf2cd !important;
  }

  &.selected {
    background-color: #4bf2cd !important;
    color: #fff !important;
    border: 1px solid #4bf2cd !important;
  }
`

const predefinedValues = [
  { label: '0.1%', value: 0.1 },
  { label: '0.5%', value: 0.5 },
  { label: '1%', value: 1 },
]

const SlippageToleranceSettings = () => {
  const TranslateString = useI18n()
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [value, setValue] = useState(userSlippageTolerance / 100)
  const [error, setError] = useState<string | null>(null)
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseFloat(inputValue))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 100
      if (!Number.isNaN(rawValue) && rawValue > 0 && rawValue < MAX_SLIPPAGE) {
        setUserslippageTolerance(rawValue)
        setError(null)
      } else {
        setError(TranslateString(1144, 'Enter a valid slippage percentage'))
      }
    } catch {
      setError(TranslateString(1144, 'Enter a valid slippage percentage'))
    }
  }, [value, setError, setUserslippageTolerance, TranslateString])

  // Notify user if slippage is risky
  useEffect(() => {
    if (userSlippageTolerance < RISKY_SLIPPAGE_LOW) {
      setError(TranslateString(1146, 'Your transaction may fail'))
    } else if (userSlippageTolerance > RISKY_SLIPPAGE_HIGH) {
      setError(TranslateString(1148, 'Your transaction may be frontrun'))
    }
  }, [userSlippageTolerance, setError, TranslateString])

  return (
    <StyledSlippageToleranceSettings>
      <Label>
        <Text style={{ fontWeight: 600, margin: 0 }}>{TranslateString(88, 'Slippage tolerance')}</Text>
        <QuestionHelper text={TranslateString(186, 'Your transaction will revert if the price changes unfavorably by more than this percentage.')} />
      </Label>
      <Options>
        <Flex mb={['8px', 0]} mr={[0, '8px']} flexDirection="row">
          {predefinedValues.map(({ label, value: predefinedValue }) => {
            const handleClick = () => setValue(predefinedValue)

            return (
              <Option key={predefinedValue}>
                <StyleButton ghost auto className={`${value === predefinedValue ? 'selected' : ''}`} onClick={handleClick}>
                  {label}
                </StyleButton>
              </Option>
            )
          })}
        </Flex>
        <Flex alignItems="center">
          <Option>
            <Input
              iconRight={<Text type={error !== null ? 'error' : 'default'}>%</Text>}
              type="number"
              size="large"
              step={0.1}
              min={0.1}
              placeholder="5%"
              value={value.toString()}
              onChange={handleChange}
              status={error !== null ? 'error' : 'default'}
            />
          </Option>
        </Flex>
      </Options>
      {error && (
        <Text type="error" style={{ marginTop: 8, fontSize: 14 }}>
          {error}
        </Text>
      )}
    </StyledSlippageToleranceSettings>
  )
}

export default SlippageToleranceSettings
