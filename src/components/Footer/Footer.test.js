import React from 'react'
import Footer from './index'
import { render } from '@testing-library/react'

describe('Footer Component', () => {
  it('should render the footer component', () => {
    const { getByText } = render(
      <Footer>
        <div>
          <p>Footer Component</p>
        </div>
      </Footer>
    )
    expect(getByText('Footer Component')).toBeInTheDocument()
  })
})


