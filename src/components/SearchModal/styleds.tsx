import styled from 'styled-components'
import { Input } from '@geist-ui/react'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

export const FadedSpan = styled(RowFixed)`
  color: #333;
  font-size: 14px;
`

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 6px;
  padding-top: 12px;

  .token-search-input-container {
    .input-container {
      height: calc(1.875 * 22pt);
    }
  }
`

export const MenuItem = styled(RowBetween)`
  padding: 0px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: #eee;
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

export const SearchInput = styled(Input)`
  color: #111;
  font-size: 18px;

  ::placeholder {
    color: #666;
  }
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
`

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.tertiary};
`
