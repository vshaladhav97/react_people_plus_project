import React from 'react'
import Loader from './index'
import { render } from '@testing-library/react'

describe('Loader', () => {
  it('should render', () => {
    const { container } = render(<Loader />)
    expect(container.firstChild).toHaveClass('loader')
  })
  it('should change style based on prop', () => {
    const { container,getByText } = render(<Loader isContentLoader={true} loaderText='test' />)
    expect(container.firstChild).toHaveStyle("position: absolute")
    expect(container.firstChild.firstChild).toHaveClass('loader-text')
    expect(getByText("test")).toBeInTheDocument("")
  })
})
