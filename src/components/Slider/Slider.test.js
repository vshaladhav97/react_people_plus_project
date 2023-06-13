import React from 'react'
import Slider from './Slider'
import { render, fireEvent } from '@testing-library/react'

// Mocking the offsetWidth property since jsdom does not support element.offsetWidth
//Refer: https://github.com/testing-library/react-testing-library/issues/353#issuecomment-510046921
const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 350 })
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 350 })
})

afterAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight)
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth)
})

describe('Slider component', () => {
  it('should render', () => {
    const { container, getByText } = render(
      <Slider>
        <div>Item 1</div>
      </Slider>
    )
    fireEvent.keyDown(container.firstChild, { key: 'ArrowRight', keyCode: 39 }) //Move Right
    expect(getByText('Item 1')).toBeInTheDocument()
  })

  it('should navigate throught slides when Arrow keys are pressed', () => {
    const { container } = render(
      <Slider>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Slider>
    )

    for (let i = 0; i < 5; i++) {
      fireEvent.keyDown(container.firstChild, { key: 'ArrowRight', keyCode: 39 })
    }
    for (let i = 0; i < 4; i++) {
      fireEvent.keyDown(container.firstChild, { key: 'ArrowLeft', keyCode: 37 })
    }

    fireEvent.keyDown(container.firstChild, { key: 'ArrowUp', keyCode: 38 }) //Do nothing
    expect(container.querySelector('.slide').style.transform.replace(/[^\d.]/g, '')).toBe('0')
  })

  it('should also handle swipe left and swipe right', () => {
    const { container } = render(
      <Slider>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Slider>
    )

    //swipe right
    fireEvent.touchStart(container.firstChild, {
      changedTouches: [{ pageX: 534.2604370117188, pageY: 539.3170776367188 }],
    })
    fireEvent.touchEnd(container.firstChild, {
      changedTouches: [{ pageX: -447.3200378417969, pageY: 562.0645141601562 }],
    })
    //swipe left
    fireEvent.touchStart(container.firstChild, {
      changedTouches: [{ pageX: -42.926116943359375, pageY: 512.9024658203125 }],
    })
    fireEvent.touchEnd(container.firstChild, {
      changedTouches: [{ pageX: 578.18359375, pageY: 512.9024658203125 }],
    })
    expect(container.querySelector('.slide').style.transform.replace(/[^\d.]/g, '')).toBe('0')
  })

  it('should not change the slide when swiped on the screen and restraint is crossed', () => {
    const { container } = render(
      <Slider>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Slider>
    )
    fireEvent.touchStart(container.firstChild, {
      changedTouches: [{ pageX: 545.611328125, pageY: 551.6019287109375 }],
    })
    fireEvent.touchEnd(container.firstChild, {
      changedTouches: [{ pageX: -446.3200378417969, pageY: 764.9019165039062 }],
    })
    expect(container.querySelector('.slide').style.transform.replace(/[^\d.]/g, '')).toBe('0')
  })

  it('should not change the slide when swiped on the screen and elapsed time exceeds the allowed time limit', async () => {
    const { container } = render(
      <Slider>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Slider>
    )
    fireEvent.touchStart(container.firstChild, {
      changedTouches: [{ pageX: 534.2604370117188, pageY: 539.3170776367188 }],
    })
    await new Promise((r) => setTimeout(r, 400)) //400 ms delay
    fireEvent.touchEnd(container.firstChild, {
      changedTouches: [{ pageX: -447.3200378417969, pageY: 562.0645141601562 }],
    })
    expect(container.querySelector('.slide').style.transform.replace(/[^\d.]/g, '')).toBe('0')
  })
})
