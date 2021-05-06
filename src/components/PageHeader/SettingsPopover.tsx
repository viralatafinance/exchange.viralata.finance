import React from 'react'
import SlippageToleranceSetting from './SlippageToleranceSetting'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'

const SettingsPopover = () => {
  return (
    <>
      <SlippageToleranceSetting />
      <TransactionDeadlineSetting />
    </>
  )
}

export default SettingsPopover
