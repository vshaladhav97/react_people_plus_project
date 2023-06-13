import React, { useCallback, useEffect, useRef } from 'react'
import Button from '../Button'
import './Carousel.scss'
/**
 * Represents an Carousel component
 *
 * @component
 * @example
 * <Carousel items={homeBannersList.filter((item) => item)}
    individualBanner={
     (item) => <img src={item.imgSrc} />
    }
    showDots
   />
 * @property {Array} items List of content to be displayed in the carousel.
 * @property {Boolean} showDots Boolean if true shows the clickable dots below the Carousel. (false by default).
 * @property {Boolean} showArrows Boolean if true shows the clickable arrows on either sides. (true by default).
 * @property {Boolean} autoPlay Boolean if true auto scrolls the slides. (true by default).
 * @property {Function} individualBanner Function that receives an item as an argument and returns the component to be displayed.
 * @property {Object} className Object to add additional classes to Carousel and it's sub components.
 * @property {String} leftArrowImg String if supplied shows the image instead of default left arrow button.
 * @property {String} rightArrowImg String if supplied shows the image instead of default right arrow button  
 */

let startX, startY, startTime
const threshold = 150 // required min distance traveled to be considered as swipe
const restraint = 100 // maximum distance allowed at the same time in perpendicular direction
const allowedTime = 300

const Carousel = (props) => {
  const {
    items,
    individualBanner,
    showDots = false,
    showArrows = true,
    className = {},
    autoPlay = true,
    leftArrowImg = '',
    rightArrowImg = '',
    reference,
  } = props

  const references = useRef([])
  const dots = useRef([])
  const interval = useRef(null)
  const slideIndex = useRef(1)

  const navigate = (n) => {
    showSlides((slideIndex.current += n))
  }

  const currentSlide = (index) => {
    showSlides((slideIndex.current = index))
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
        const swipedir = distX < 0 ? 1 : -1
        navigate(swipedir)
      }
    }
  }

  const showSlides = useCallback(
    (index) => {
      if (index > items.length) {
        slideIndex.current = 1
      }
      if (index < 1) {
        slideIndex.current = items.length
      }
      for (let i = 0; i < items.length; i++) {
        references.current[i].style.display = 'none'
        showDots && dots.current[i].classList.remove('carousel-active')
      }
      references.current[slideIndex.current - 1].style.display = 'flex'
      showDots && dots.current[slideIndex.current - 1].classList.add('carousel-active')
    },
    [items.length, showDots]
  )

  useEffect(() => {
    references.current[0].style.display = 'flex'
    if (items.length > 1) {
      showDots && dots.current[0].classList.add('carousel-active')
      if (autoPlay) {
        interval.current = setInterval(() => {
          showSlides((slideIndex.current += 1))
        }, 3000)
        return () => {
          clearInterval(interval.current)
        }
      }
    }
  }, [items.length, showSlides, showDots, autoPlay])

  return (
    <React.Fragment>
      <div
        className={`carousel-container ${className?.container || ''}`}
        onTouchStart={handleOnTouchStart}
        onTouchEnd={handleOnTouchEnd}
        ref={reference}
      >
        {items.map((item, index) => (
          <div key={index} className='carousel-element fade-carousel-element' ref={(node) => (references.current[index] = node)}>
            {individualBanner(item)}
          </div>
        ))}
        {items.length > 1 && showArrows && (
          <React.Fragment>
            <Button
              type='button'
              handleOnClick={() => {
                navigate(-1)
              }}
              classes={`previous ${className?.arrow || ''}`}
              isPointRipple={true}
              notBtnRipple={true}
            >
              {leftArrowImg ? <img src={leftArrowImg} alt='' className={`${className?.leftArrow || ''}`} /> : '<'}
            </Button>
            <Button
              type='button'
              handleOnClick={() => {
                navigate(1)
              }}
              classes={`next ${className?.arrow || ''}`}
              isPointRipple={true}
              notBtnRipple={true}
            >
              {rightArrowImg ? <img src={rightArrowImg} alt='' className={`${className?.rightArrow || ''}`} /> : '>'}
            </Button>
          </React.Fragment>
        )}
      </div>
      {showDots && items.length > 1 && (
        <div className={`dot-container ${className?.dotContainer || ''}`}>
          {items.map((item, index) => (
            <span
              key={index}
              className={`dot ${className?.dot || ''}`}
              ref={(node) => (dots.current[index] = node)}
              onClick={() => {
                currentSlide(index + 1)
              }}
            />
          ))}
        </div>
      )}
    </React.Fragment>
  )
}

export default React.memo(Carousel)
