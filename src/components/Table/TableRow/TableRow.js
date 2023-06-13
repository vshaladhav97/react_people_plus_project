import React from 'react'

const TableRow = ({ children, className, otherProps }) => (
  <tr className={`table__row ${className || ''}`} {...otherProps}>
    {children}
  </tr>
)

export default React.memo(TableRow)
