import React from 'react'

const TableData = ({ children, className = '', otherProps, dataHeading = '' }) => (
  <td className={`table__data ${className || ''}`} {...otherProps} data-heading={dataHeading}>
    {children}
  </td>
)

export default React.memo(TableData)
