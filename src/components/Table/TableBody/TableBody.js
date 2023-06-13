import React from 'react'

const TableBody = ({ children, className = '', otherProps }) => (
  <tbody className={`table__tbody ${className || ''}`} {...otherProps}>
    {children}
  </tbody>
)

export default React.memo(TableBody)
