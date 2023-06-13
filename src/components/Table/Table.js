import React, { useState, useEffect } from 'react'
import './Table.scss'
import TableHeader from './TableHeader'
import TableHeading from './TableHeading'
import TableRow from './TableRow'
import TableBody from './TableBody'
import TableData from './TableData'
import Pagination from '../Pagination'
import TableFilters from './TableFilters'

/**
 * Provides a Table component
 *
 * @component
 * @example
 * <Table
    headings={headings}
    data={data}
    pageLength={4}
    isSearchable
    isResponsive
    isSortable
   />
 *
 * @property {Array} headings A list containing the Table Headings.
 * @property {Array} data A 2 dimentional list containing table content in rows and columns.
 * @property {Number} pageLength The number of records to showed in a page. If not specified pagination will not be applied to the table.
 * @property {Boolean} isSearchable Shows a input on the top of the Table which can be used to search data.
 * @property {Function} customSearch Function to search data if you choose to render the table grid manually.
 * @property {Boolean} isSortable Allows records to be sorted.
 * @property {Boolean} isFilterable Boolean to make the table data filterable.
 * @property {Function} customFilter Function to that receives array of filters and filters the data when rendering manually.
 * @property {Boolean} isResponsive Makes the table adaptable to different viewport sizes.
 * @property {String} searchInputId optional custom id for search input.
 * @property {Number} skeletonRows Number of rows to display in the skeleton UI for loading animation. Defaults to 3.
 * @property {Number} skeletonCols Number of columns to display in the skeleton UI for loading animation. Defaults to 3.
 * @property {Object} className Object for manipulating the classes
 * @property {*} children Custom child components to be rendered inside the table.
 * @property {Object} otherProps An object, which can be used to pass additional props.
 */

const ASC = 1
const DESC = -1
const Table = ({
  headings = [],
  data,
  pageLength,
  children,
  isSearchable,
  customSearch,
  isSortable,
  isFilterable,
  customFilter,
  isResponsive,
  filterableCols,
  className = {},
  isLoading,
  otherProps,
  skeletonRows,
  skeletonCols,
  reference,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageData, setPageData] = useState([])
  const [sortConfig, setSortConfig] = useState({ field: headings[0], order: ASC })
  const [searchTxt, setSearchTxt] = useState('')
  const [filterList, setFilterList] = useState([])
  const [pagination, setPagination] = useState({ endIndex: 0, startIndex: 0, currentPageData: [], maxPages: 0 })
  useEffect(() => {
    setPageData(data)
  }, [data])
  //Pagination
  useEffect(() => {
    const endIndex = currentPage * pageLength
    const startIndex = endIndex - pageLength
    const currentPageData = pageLength > 0 ? [...pageData].slice(startIndex, endIndex) : pageData
    const maxPages = Math.ceil(pageData?.length / pageLength) || 0
    setPagination({ endIndex, startIndex, currentPageData, maxPages })
  }, [currentPage, pageData, pageLength])
  //Sorting
  const sort = (field) => {
    let order = sortConfig.order === ASC ? DESC : ASC
    setSortConfig({ field, order })
    const sortedData = [...pageData].sort((row1, row2) => (row1[headings.indexOf(field)] > row2[headings.indexOf(field)] ? order : -order))
    setPageData(sortedData)
    setCurrentPage(1)
  }
  //Search
  const search = (text) => {
    const searchData = data.filter((row) => row.some((col) => col.toString().toLowerCase().includes(text.toLowerCase())))
    setPageData(searchData)
    setCurrentPage(1)
  }
  const handleSearch = (e) => {
    const text = e.target.value.trim()
    setSearchTxt(text)
    setFilterList([])
    customSearch ? customSearch(text) : data?.length && search(text)
  }
  //Filter
  const filterData = (filters) => {
    if (filters.length > 0) {
      let filteredData = data.filter((row) => {
        //returns true if data matches all filter constraints
        return filters.every((filter) => {
          let index = headings.indexOf(filter.filterKey)
          return row[index].toString().toLowerCase().includes(filter.filterText.toLowerCase())
        })
      })
      setPageData(filteredData)
    } else {
      setPageData(data)
    }
  }
  const addNewFilter = (filter) => {
    if (filter.filterKey && filter.filterText) {
      const newFilterList = [...filterList, filter]
      setFilterList(newFilterList)
      customFilter ? customFilter(newFilterList) : data?.length > 0 && filterData(newFilterList)
      setSearchTxt('')
    }
  }
  const clearFilters = () => {
    setFilterList([])
    customFilter ? customFilter([]) : data?.length > 0 && filterData([])
    setPageData(data)
  }
  const removeFilter = (_, id) => {
    const updatedFilterList = filterList.filter((_, filterId) => filterId !== id)
    setFilterList(updatedFilterList)
    customFilter ? customFilter(updatedFilterList) : data?.length > 0 && filterData(updatedFilterList)
  }
  return (
    <div className={`table-container ${className.tableContainer || ''}`} ref={reference}>
      {(isSearchable || isFilterable) && (
        <TableFilters
          className={{ filterContainer: className.filterContainer || '' }}
          showSearch={isSearchable}
          searchTxt={searchTxt}
          handleSearch={handleSearch}
          showFilter={isFilterable}
          addNewFilter={addNewFilter}
          filterableCols={filterableCols || headings}
          filterList={filterList}
          removeFilter={removeFilter}
          clearFilters={clearFilters}
        />
      )}
      <table className={`table ${isResponsive ? 'table--responsive' : ''} ${className.table || ''}`} {...otherProps}>
        {isLoading ? (
          <TableBody>
            {Array.from({ length: skeletonRows || 3 }).map((ele, index) => (
              <TableRow key={index}>
                {Array.from({ length: skeletonCols || 3 }).map((ele, index) => (
                  <TableData key={index} className='table-data--loading'>
                    <div className='shimmer'></div>
                  </TableData>
                ))}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <>
            {headings.length > 0 && (
              <TableHeader className={`${className.thead || ''}`}>
                <TableRow className={`${className.tr || ''}`}>
                  {headings.map((heading, index) => (
                    <TableHeading
                      classObject={{ header: `${className.th || ''}` }}
                      key={index}
                      onClick={isSortable ? () => sort(heading) : null}
                      showSortIcons={isSortable}
                      activeSortIcon={
                        heading === sortConfig.field && (sortConfig.order === ASC ? 'up' : sortConfig.order === DESC && 'down')
                      }
                    >
                      {heading}
                    </TableHeading>
                  ))}
                </TableRow>
              </TableHeader>
            )}
            {data?.length > 0 && (
              <TableBody className={className.tbody || ''}>
                {pagination.currentPageData.length > 0 ? (
                  <>
                    {pagination.currentPageData.map((row, rIndex) => (
                      <TableRow className={className.tr || ''} key={rIndex}>
                        {row.length > 0 &&
                          row.map((col, cIndex) => (
                            <TableData
                              className={className.td || ''}
                              key={cIndex}
                              dataHeading={headings.length >= cIndex - 1 && headings[cIndex]}
                            >
                              {col.toString()}
                            </TableData>
                          ))}
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow className={className.tr || ''}>
                    <TableData className={`table__data--message ${className.td || ''}`} otherProps={{ colSpan: data[0].length }}>
                      No records found.
                    </TableData>
                  </TableRow>
                )}
              </TableBody>
            )}
            {children}
          </>
        )}
      </table>
      {pageLength > 0 && (
        <Pagination
          pages={pagination.maxPages}
          paginate={(pageNo) => setCurrentPage(pageNo)}
          activePage={currentPage}
          paginationInfo={
            pageData.length > 0 &&
            `Showing ${pagination.startIndex + 1} to ${Math.min(pagination.endIndex, pageData.length)} of ${pageData.length} entries`
          }
          className={{ container: `table__pagination-container ${className.pagination || ''}` }}
        />
      )}
    </div>
  )
}
export default React.memo(Table)
