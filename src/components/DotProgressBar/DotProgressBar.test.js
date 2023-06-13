import React from 'react'
import { render } from '@testing-library/react'
import DotProgressBar from './'
import { fireEvent } from '@testing-library/react'

describe('DotProgressBar', () => {
  const props = {
    currentIndex: 2,
    showStepCount: true,
    progressBarItems: [
      'Claim Request Raised',
      'Verification',
      'Repair Initiation',
      'Diagnosis',
      'Estimation & Repair',
      'Return to Customer',
    ],
  }

  it('should render', () => {
    const { container } = render(<DotProgressBar {...props} />)
    expect(container.getElementsByClassName('active')).toHaveLength(3)
  })

  it('should make the dots clickable when onDotClick Callback function passed', () => {
    const { container } = render(<DotProgressBar {...props} onDotClick={() => {}} />)
    fireEvent.click(container.getElementsByClassName('dot-icon')[0])
    expect(container.getElementsByClassName('active')).toHaveLength(3)
  })

  it('should show tick when showTick prop is true', () => {
    const { container } = render(<DotProgressBar {...props} showTick />)
    expect(container.getElementsByClassName('dot-tick').length).toBeGreaterThan(0)
  })
})
