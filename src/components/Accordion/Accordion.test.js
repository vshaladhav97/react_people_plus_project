import React from 'react'
import Accordion from './index'
import { render, waitFor, fireEvent } from '@testing-library/react'

describe('Accordion', () => {
  it('should render Accordion in expanded state', () => {
    const { getByText } = render(
      <Accordion showAccordion={true} title='Accordion Title'>
        <p>Accordion Body</p>
      </Accordion>
    )
    expect(getByText('Accordion Body')).toBeInTheDocument()
  })

  it('should render Accordion in collapsed state', () => {
    const { getByText } = render(
      <Accordion showAccordion={false} title='Accordion Title'>
        <p>Accordion Body</p>
      </Accordion>
    )
    expect(getByText('Accordion Title')).toBeInTheDocument()
  })
})
