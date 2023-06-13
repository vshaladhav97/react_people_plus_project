import React from 'react'
import { render } from '@testing-library/react'
import Pagination from './index'
import userEvent from '@testing-library/user-event'

describe('Pagination Component', () => {
  it('Should render the Pagination', () => {
    const { getByText } = render(<Pagination pages={10} activePage={8} />)
    expect(getByText('8').closest('button')).toHaveClass('button pagination__btn pagination__btn--active')
  })

  it('should call paginate when navigation button are pressed', () => {
    const paginate = jest.fn()
    const { getByText } = render(<Pagination pages={7} activePage={2} paginate={paginate} />)
    userEvent.click(getByText('>>'))
    userEvent.click(getByText('<<'))
    userEvent.click(getByText('>'))
    userEvent.click(getByText('<'))
    expect(paginate).toHaveBeenCalledTimes(4)
  })

  it('should show only 5 buttons at a time', () => {
    const { queryByText } = render(<Pagination pages={10} activePage={5} />)
    expect(queryByText('3')).toBeInTheDocument()
    expect(queryByText('8')).not.toBeInTheDocument()
  })
})
