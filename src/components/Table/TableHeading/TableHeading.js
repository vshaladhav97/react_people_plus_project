import React from 'react'

const TableHeading = ({ children, classObject = {}, otherProps, showSortIcons, activeSortIcon, onClick }) => (
  <th
    className={`table__heading ${onClick ? 'table__heading--clickable' : ''} ${classObject.header || ''}`}
    onClick={onClick}
    {...otherProps}
  >
    <div className={`table__heading-inner ${classObject.innerContainer || ''}`}>
      {children}
      {showSortIcons && (
        <div className={`table__sort-container ${classObject.sortContainer || ''}`}>
          <span className={`table__sort-btn ${classObject.sortUpBtn || ''} ${activeSortIcon === 'up' ? 'table__sort-btn--active' : ''}`}>
            {'\u25B2'}
          </span>
          <span
            className={`table__sort-btn ${classObject.sortDownBtn || ''} ${activeSortIcon === 'down' ? 'table__sort-btn--active' : ''}`}
          >
            {'\u25BC'}
          </span>
        </div>
      )}
    </div>
  </th>
)

export default React.memo(TableHeading)
