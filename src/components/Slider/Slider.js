import React, { useState, useRef, useCallback } from 'react'
import './Slider.scss'
import Button from '../Button'
import useWindowResize from '../../hooks/useWindowResize'

const DEFAULT_SPACING = 20
const DEFAULT_CONFIG = [
  { breakpoint: 0, items: 1 }, // for screen width above 0 show 1 item per slide
  { breakpoint: 768, items: 2 }, // for screen width above 678 show 2 items per slide
  { breakpoint: 992, items: 3 }, // for screen width above 992 show 3 items per slide
  { breakpoint: 1024, items: 4 }, // for screen width above 1024 show 4 items per slide
]

let startX, startY, startTime
const threshold = 150 // required min distance traveled to be considered as swipe
const restraint = 100 // maximum distance allowed at the same time in perpendicular direction
const allowedTime = 300

/**
 * Provides a Slider component
 *
 * @component
 *
 * @property {*} children components to be rendered inside the slider
 * @property {Array} config specifies number of slides to show for a breakpoint.
 * @property {Number} spacing specifies the amount of space between slides.
 */

const Slider = ({ config, spacing, children, className = {}, reference, activeSlideIndex = -1 }) => {
  const [x, setX] = useState(0)
  const [slideWidth, setSlideWidth] = useState()
  const [itemsPerSlide, setItemsPerSlide] = useState(1)

  const sliderRef = useRef(null)

  const showPreviousSlide = () => {
    !x <= 0 && setX(x - (slideWidth + (spacing || DEFAULT_SPACING)))
  }

  const showNextSlide = () => {
    x / (slideWidth + (spacing || DEFAULT_SPACING)) !== React.Children.count(children) - itemsPerSlide &&
      setX(x + slideWidth + (spacing || DEFAULT_SPACING))
  }

  const handleOnTouchStart = (e) => {
    let touchObject = e.changedTouches[0]
    startX = touchObject.pageX
    startY = touchObject.pageY
    startTime = new Date().getTime()
  }

  const handleOnTouchEnd = (e) => {
    let touchObject = e.changedTouches[0]
    const distX = touchObject.pageX - startX
    const distY = touchObject.pageY - startY
    const elapsedTime = new Date().getTime() - startTime
    if (elapsedTime <= allowedTime) {
      if (Math.abs(distX) > threshold && Math.abs(distY) <= restraint) {
        distX < 0 ? showNextSlide() : showPreviousSlide()
      }
    }
  }

  const setupSlider = useCallback(() => {
    let sliderConfig = config || DEFAULT_CONFIG
    let items = sliderConfig.reduce((acc, item) => (window.innerWidth > item.breakpoint ? item.items : acc), 1)
    items = Math.min(items, React.Children.count(children))
    const slideWidth = Math.floor(sliderRef.current.offsetWidth / items - (spacing || DEFAULT_SPACING))
    setItemsPerSlide(items)
    let initialSlide =
      activeSlideIndex > 0
        ? (slideWidth + (spacing || DEFAULT_SPACING)) *
          (activeSlideIndex + items - 1 >= children.length ? children.length - items : activeSlideIndex - 1)
        : 0
    setX(initialSlide)
    setSlideWidth(slideWidth)
  }, [children, spacing, config, activeSlideIndex])

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        showPreviousSlide()
        break
      case 'ArrowRight':
        showNextSlide()
        break
      default:
        return
    }
  }

  useWindowResize(setupSlider)

  const ArrowButton = ({ type }) => {
    const isDisabledClass =
      type === 'previous'
        ? x === 0
          ? 'slider__btn--disabled'
          : ''
        : x / (slideWidth + (spacing || DEFAULT_SPACING)) === React.Children.count(children) - itemsPerSlide
        ? 'slider__btn--disabled'
        : ''

    return (
      itemsPerSlide < React.Children.count(children) && (
        <Button
          type='button'
          classes={`slider__btn ${isDisabledClass} ${className.button || ''}`}
          handleOnClick={type === 'previous' ? showPreviousSlide : showNextSlide}
          isDisabled={isDisabledClass}
        >
          {type === 'previous' ? `\u2039` : `\u203A`}
        </Button>
      )
    )
  }

  return (
    <div
      className={`slider-container ${className.sliderContainer || ''}`}
      onTouchStart={handleOnTouchStart}
      onTouchEnd={handleOnTouchEnd}
      onKeyDown={handleKeyDown}
      ref={reference}
    >
      <ArrowButton type='previous' />
      <div className={`slider ${className.slider || ''}`} ref={sliderRef}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            className: `${child.props.className} track-slide slide`,
            style: {
              transform: `translate(-${x}px)`,
              minWidth: `${slideWidth}px`,
              width: `${slideWidth}px`,
              marginLeft: itemsPerSlide >= React.Children.count(children) && index === 0 ? '0px' : `${(spacing || DEFAULT_SPACING) / 2}px`,
              marginRight:
                itemsPerSlide >= React.Children.count(children) && index === React.Children.count(children) - 1
                  ? '0px'
                  : `${(spacing || DEFAULT_SPACING) / 2}px`,
            },
            key: index,
          })
        )}
      </div>
      <ArrowButton type='next' />
    </div>
  )
}

export default React.memo(Slider)
