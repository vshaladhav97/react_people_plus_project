import React from 'react'

const TableHeader = ({ children, className = '', otherProps }) => (
  <thead className={`table__thead ${className || ''}`} {...otherProps}>
    {children}
  </thead>
)

export default React.memo(TableHeader)
