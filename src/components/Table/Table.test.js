import React from 'react'
import Table, { TableHeader, TableHeading, TableRow, TableBody, TableData, TableFilters } from './index'
import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const headings = ['ID', 'Name', 'Home Planet']
const data = [
  [400, 'Chewbacca', 'Kashyyyk'],
  [100, 'Darth Vader', 'Tatooine'],
  [300, 'Obi-Wan Kenobi', 'Yavin IV'],
  [200, 'Leia Organa', 'Alderaan'],
  [500, 'Han Solo', 'Corellia'],
]

describe('Input Component', () => {
  it('should render the Table component', () => {
    const { getByText } = render(
      <>
        <TableFilters
          showFilter
          filterableCols={['RandomHead', 'RandomHead2']}
          filterList={[]}
          addNewFilter={() => jest.fn()}
          clearFilters={() => jest.fn()}
          removeFilter={() => jest.fn()}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeading>Heading1</TableHeading>
              <TableHeading>Heading2</TableHeading>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableData>Data1</TableData>
              <TableData>Data2</TableData>
            </TableRow>
          </TableBody>
        </Table>
      </>
    )
    expect(getByText('Data1')).toBeInTheDocument()
  })

  it('should handle Pagination when required', () => {
    const { queryByText, getByText } = render(<Table data={data} headings={headings} pageLength={3} />)
    expect(queryByText('500')).not.toBeInTheDocument()
    fireEvent.click(getByText('2'))
    expect(queryByText('500')).toBeInTheDocument()
  })

  it('should allow Sorting when required', () => {
    const { queryByText, getByText } = render(<Table data={data} headings={headings} isSortable pageLength={4} />)
    userEvent.click(getByText('ID'))
    userEvent.click(getByText('ID'))
    userEvent.click(getByText('ID'))
    expect(queryByText('200')).toBeInTheDocument()
    // expect(queryByText('500')).not.toBeInTheDocument()
  })

  it('should allow Searching when required', () => {
    const { getByPlaceholderText, queryByText } = render(
      <Table data={data} headings={headings} pageLength={4} isSearchable className={{ tr: 'some-class' }} />
    )
    userEvent.type(getByPlaceholderText('Enter search text'), '500')
    expect(queryByText('500')).toBeInTheDocument()
    expect(queryByText('100')).not.toBeInTheDocument()
    userEvent.type(getByPlaceholderText('Enter search text'), '7897')
    expect(queryByText('No records found.')).toBeInTheDocument()
  })

  it('should run the custom search when required', () => {
    const customSearch = jest.fn()
    const { getByPlaceholderText } = render(
      <Table data={data} headings={headings} pageLength={4} isSearchable customSearch={customSearch} />
    )
    userEvent.type(getByPlaceholderText('Enter search text'), '500')
    expect(customSearch).toHaveBeenCalled()
  })

  it('should handle filtering accordingly', () => {
    const { getByText, getAllByText, getByPlaceholderText, queryByText } = render(
      <Table data={data} headings={headings} pageLength={4} isFilterable />
    )
    userEvent.click(getByText('Add new filter'))
    userEvent.click(getByText('Cancel'))

    userEvent.click(getByText('Add new filter'))
    userEvent.click(getByText('Filter By'))
    userEvent.click(getAllByText('Name')[0])
    userEvent.type(getByPlaceholderText('Enter Filter Text'), 'Darth Vader')
    userEvent.click(getByText('Add filter'))
    expect(queryByText('Darth Maul')).not.toBeInTheDocument()

    userEvent.click(getByText('Add new filter'))
    userEvent.click(getByText('Filter By'))
    userEvent.click(getAllByText('Name')[0])
    userEvent.type(getByPlaceholderText('Enter Filter Text'), 'test key')
    userEvent.click(getByText('Add filter'))

    userEvent.click(getAllByText('✕')[1])
    userEvent.click(getByText('Clear All Filters'))
  })

  it('should render filterableCols', () => {
    const { getByText } = render(
      <Table data={data} headings={headings} pageLength={4} isFilterable filterableCols={['ID', 'NAME', 'PLANET']} />
    )
    userEvent.click(getByText('Add new filter'))
    userEvent.click(getByText('Filter By'))
    expect(getByText('PLANET')).toBeInTheDocument()
  })

  it('should render the loading UI', () => {
    const { container } = render(<Table isLoading={true} />)
    expect(container.getElementsByClassName('shimmer')[0]).toBeInTheDocument()
  })

  it('should render the loading UI width classaNames', () => {
    const { container } = render(<Table isLoading={true} className={{ tableContainer: 'some-class', table: 'some-class' }} isResponsive />)
    expect(container.getElementsByClassName('shimmer')[0]).toBeInTheDocument()
  })

  it('should work when customFilter prop is passed', () => {
    const customFilter = jest.fn()
    const { getByText, getAllByText, getByPlaceholderText } = render(
      <Table data={data} headings={headings} pageLength={4} isFilterable customFilter={customFilter} />
    )
    userEvent.click(getByText('Add new filter'))
    userEvent.click(getByText('Filter By'))
    userEvent.click(getAllByText('Name')[0])
    userEvent.type(getByPlaceholderText('Enter Filter Text'), 'test key')
    userEvent.click(getByText('Add filter'))
    expect(customFilter).toHaveBeenCalled()

    userEvent.click(getByText('Add new filter'))
    userEvent.click(getByText('Filter By'))
    userEvent.click(getAllByText('Name')[0])
    userEvent.type(getByPlaceholderText('Enter Filter Text'), 'test key')
    userEvent.click(getByText('Add filter'))

    userEvent.click(getAllByText('✕')[1])
    userEvent.click(getByText('Clear All Filters'))
    expect(customFilter).toHaveBeenCalled()
  })
})
