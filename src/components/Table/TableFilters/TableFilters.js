import React, { useState } from 'react'
import Input from '../../Input'
import Dropdown from '../../Dropdown'
import Button from '../../Button'
import Chip from '../../Chip'

/**
 * Provides a TableFilters Component
 * @component
 *
 * @property {Boolean} showSearch If true shows the built-in search UI.
 * @property {String} searchTxt String which represents the search text.
 * @property {Function} handleSearch Event handler Function that runs when search text changes.
 * @property {Boolean} showFilter If true shows the built-in filter UI.
 * @property {Function} addNewFilter Function that runs when user tries to add a filter, receives the filter Object as an argument.
 * @property {Function} removeFilter  Function that runs when user tries to remove a filter. receives the index of the filter in the filterList as argument.
 * @property {Function} clearFilters  Function that runs when user trues to remove all filters.
 * @property {Array} filterList List containing all filters.
 * @property {Array} filterableCols  Array containing names of columns of the table on which filter can be applied.
 * @property {*} children  Custom components to be rendered inside the TableFilters.
 */

const TableFilters = ({
  className = {},
  showSearch,
  searchTxt,
  handleSearch,
  showFilter,
  addNewFilter,
  filterableCols,
  filterList,
  removeFilter,
  clearFilters,
  children,
  filterButtonContent,
  filterDropdownPlaceholder,
  filterInputPlaceholder,
  searchInputPlaceholder,
}) => {
  const [showFilterInputs, setShowFilterInputs] = useState(false)
  const [filter, setFilter] = useState({ filterKey: '', filterText: '' })

  return (
    <div className={`filter-outer-container ${className.filterOuterContainer || ''}`}>
      <div className={`table__filter-container ${className.filterContainer || ''}`}>
        {children}
        {showSearch && (
          <Input
            label='Search'
            labelAlign='left'
            value={searchTxt}
            handleOnChange={handleSearch}
            className={{
              formControl: 'no-collapse filter-input-full-width',
              label: 'table__filter-label',
              inputContainer: 'table__filter-input',
            }}
            placeholder={searchInputPlaceholder || 'Enter search text'}
          />
        )}
        {showFilter && !showFilterInputs && (
          <Button type='button' classes='add-filter-button filter-button button-primary button-small' handleOnClick={() => setShowFilterInputs(true)}>
            {filterButtonContent || 'Add new filter'}
          </Button>
        )}
        {showFilter && showFilterInputs && (
          <form
            className='filter-form'
            onSubmit={(e) => {
              e.preventDefault()
              addNewFilter(filter)
              setFilter({ filterKey: '', filterText: '' })
              setShowFilterInputs(false)
            }}
          >
            <Dropdown
              id={`table-filter-dropdown`}
              value={filter.filterKey}
              options={filterableCols.map((col) => ({ value: col }))}
              searchText='Search'
              classObject={{ container: 'filter-dropdown', valueContainer: 'filter-dropdown-value' }}
              filterBy='value'
              handleOnChange={(heading) => setFilter({ ...filter, filterKey: heading.value })}
              placeholder={filterDropdownPlaceholder || 'Filter By'}
            />
            <Input
              id={`filter-text`}
              name='filterText'
              value={filter.filterText}
              placeholder={filterInputPlaceholder || 'Enter Filter Text'}
              handleOnChange={(e) => setFilter({ ...filter, filterText: e.target.value })}
              className={{ formControl: 'filter-text-input', inputContainer: 'table__filter-input' }}
            />
            <Button type='submit' classes='filter-button button-primary button-small'>
              {filter.filterKey && filter.filterText ? 'Add filter' : 'Cancel'}
            </Button>
          </form>
        )}
      </div>
      {filterList.length > 0 && (
        <div className='filter-chip-container'>
          {`Filters: `}
          {filterList.map((filter, id) => (
            <Chip
              key={id}
              className={{ chip: 'filter-chip' }}
              onDelete={() => removeFilter(filter, id)}
            >{`${filter.filterKey}: ${filter.filterText}`}</Chip>
          ))}
          <Chip className={{ chip: 'filter-chip button-chip' }} onClick={clearFilters}>
            Clear All Filters
          </Chip>
        </div>
      )}
    </div>
  )
}

export default TableFilters
