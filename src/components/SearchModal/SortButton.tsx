import React from 'react'
import { Text } from '@geist-ui/react'
import styled from 'styled-components'
import { RowFixed } from '../Row'

export const FilterWrapper = styled(RowFixed)`
  background-color: ${({ theme }) => theme.colors.invertedContrast};
  color: #111;
  border-radius: 8px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
    color: #4bf2cd !important;
  }
`

export default function SortButton({
  toggleSortOrder,
  ascending
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      <Text  style={{ fontWeight: 300, margin: 0 }}>{ascending ? '↑' : '↓'}</Text>
    </FilterWrapper>
  )
}
