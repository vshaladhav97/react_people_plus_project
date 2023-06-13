import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import Carousel from './index'

describe('Carousel Component', () => {
  it('should render the Carousel', () => {
    const bannerlist = [{ text: 'Banner1' }, { text: 'Banner2' }]
    const { getByText } = render(<Carousel items={bannerlist} individualBanner={(item) => <p>{item.text}</p>} showDots={false} />)
    expect(getByText(bannerlist[0].text)).toBeInTheDocument()
  })

  it('should render when there is only one item', () => {
    const bannerlist = [{ text: 'Banner1' }]
    const { getByText } = render(<Carousel items={bannerlist} individualBanner={(item) => <p>{item.text}</p>} />)
    expect(getByText(bannerlist[0].text)).toBeInTheDocument()
  })

  it('should toggle slides when navigation buttons are pressed', () => {
    const bannerlist = [{ text: 'Banner1' }, { text: 'Banner2' }]
    const { container } = render(<Carousel showDots items={bannerlist} individualBanner={(item) => <p>{item.text}</p>} />)
    fireEvent.click(container.getElementsByClassName('next')[0])
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].firstChild).display).toBe('none')
    fireEvent.click(container.getElementsByClassName('previous')[0])
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].firstChild).display).not.toBe('none')
    fireEvent.click(container.getElementsByClassName('dot')[1])
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].firstChild).display).toBe('none')
  })

  it('should display first slide when next is pressed and current slide is the last', () => {
    const bannerlist = [{ text: 'Banner1' }, { text: 'Banner2' }]
    const { container } = render(<Carousel items={bannerlist} individualBanner={(item) => <p>{item.text}</p>} />)
    bannerlist.forEach(() => fireEvent.click(container.getElementsByClassName('next')[0]))
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].firstChild).display).not.toBe('none')
  })

  it('should display last slide when previous is pressed and current slide is the first', () => {
    const bannerlist = [{ text: 'Banner1' }, { text: 'Banner2' }]
    const { container } = render(<Carousel items={bannerlist} individualBanner={(item) => <p>{item.text}</p>} />)
    bannerlist.forEach(() => fireEvent.click(container.getElementsByClassName('previous')[0]))
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].lastChild).display).not.toBe('none')
  })

  it('should change slide every three seconds', async () => {
    const bannerlist = [{ text: 'Banner1' }, { text: 'Banner2' }]
    const { container } = render(<Carousel items={bannerlist} individualBanner={(item) => <p>{item.text}</p>} />)
    await new Promise((r) => setTimeout(r, 3000)) //3 second delay
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].firstChild).display).toBe('none')
  })

  it('should change the slide when swiped on the screen', () => {
    const bannerlist = [{ text: 'Banner1' }, { text: 'Banner2' }]
    const { container } = render(<Carousel items={bannerlist} individualBanner={(item) => <p>{item.text}</p>} />)

    //swipe right
    fireEvent.touchStart(container.getElementsByClassName('carousel-container')[0].firstChild, {
      changedTouches: [{ pageX: 534.2604370117188, pageY: 539.3170776367188 }],
    })
    fireEvent.touchEnd(container.getElementsByClassName('carousel-container')[0].firstChild, {
      changedTouches: [{ pageX: -447.3200378417969, pageY: 562.0645141601562 }],
    })
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].firstChild).display).toBe('none')

    //swipe left
    fireEvent.touchStart(container.getElementsByClassName('carousel-container')[0].firstChild, {
      changedTouches: [{ pageX: -42.926116943359375, pageY: 512.9024658203125 }],
    })
    fireEvent.touchEnd(container.getElementsByClassName('carousel-container')[0].firstChild, {
      changedTouches: [{ pageX: 578.18359375, pageY: 512.9024658203125 }],
    })
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].firstChild).display).not.toBe('none')
  })

  it('should not change the slide when swiped on the screen and restraint is crossed', () => {
    const bannerlist = [{ text: 'Banner1' }, { text: 'Banner2' }]
    const { container } = render(<Carousel items={bannerlist} individualBanner={(item) => <p>{item.text}</p>} />)
    fireEvent.touchStart(container.getElementsByClassName('carousel-container')[0].firstChild, {
      changedTouches: [{ pageX: 545.611328125, pageY: 551.6019287109375 }],
    })
    fireEvent.touchEnd(container.getElementsByClassName('carousel-container')[0].firstChild, {
      changedTouches: [{ pageX: -446.3200378417969, pageY: 764.9019165039062 }],
    })
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].firstChild).display).not.toBe('none')
  })

  it('should not change the slide when swiped on the screen and elapsed time exceeds the allowed time limit', async () => {
    const bannerlist = [{ text: 'Banner1' }, { text: 'Banner2' }]
    const { container } = render(<Carousel items={bannerlist} individualBanner={(item) => <p>{item.text}</p>} />)
    fireEvent.touchStart(container.getElementsByClassName('carousel-container')[0].firstChild, {
      changedTouches: [{ pageX: 534.2604370117188, pageY: 539.3170776367188 }],
    })
    await new Promise((r) => setTimeout(r, 400)) //400 ms delay
    fireEvent.touchEnd(container.getElementsByClassName('carousel-container')[0].firstChild, {
      changedTouches: [{ pageX: -447.3200378417969, pageY: 562.0645141601562 }],
    })
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].firstChild).display).not.toBe('none')
  })

  it('should not auto play when autoPlay is false', async () => {
    const bannerlist = [{ text: 'Banner1' }, { text: 'Banner2' }]
    const { container } = render(<Carousel items={bannerlist} autoPlay={false} individualBanner={(item) => <p>{item.text}</p>} />)
    await new Promise((r) => setTimeout(r, 3001)) //3001 ms delay, in autoPlay slide changes every 3 seconds.
    expect(window.getComputedStyle(container.getElementsByClassName('carousel-container')[0].firstChild).display).not.toBe('none')
  })
})
