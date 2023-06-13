import React, { useRef, useEffect } from 'react'
import Button from '../Button'
import './Accordion.scss'

/**
 * Represents a Accordion component
 *
 * @component
 * @example
 *  <Accordion
 *     title='This is a test accordion'
 *     showAccordion={showAccordion}
 *     className={{
 *      container: 'container-class',
 *      button: 'accordion-btn-class',
 *      panel: 'accordion-panel-class',
 *     }}
 *     onClick={() => {
 *      setShowAccordion(!showAccordion)
 *     }}
 *  >
 *     <div className='p10'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, totam.</div>
 *  </Accordion>
 * @property {String | Component} title  Accordion title. can be a String, an HTML Element or a Component.
 * @property {String} id An identifier for the Accordion button.
 * @property {Component} children An element or a component could be passed to render inside the Accordion panel.
 * @property {Boolean} showAccordion Boolean if true expands the Accordion.
 * @property {Function} onClick Function to be called when Accordion is clicked.
 * @property {Object} className Classname object with multiple key value pairs. Refer the component.
 * @property {Component} closeIcon icon to be shown when the accordion is in expanded state.
 * @property {Component} openIcon icon to be shown when the accordion is in collapsed state.
 */

const Accordion = ({ title, children, showAccordion, onClick, className = {}, openIcon, closeIcon, id }) => {
  const contentRef = useRef(null)
  const timeoutID = useRef(null)

  useEffect(() => {
    if (showAccordion) {
      const transitionDuration = 300
      contentRef.current.style.height = contentRef.current.scrollHeight + 'px'
      contentRef.current.style.transitionDuration = `${transitionDuration}ms`

      // Add height=auto and overflow=visible to Accordion panel after transition time
      // To allow flexible height of accordion on inner element height change
      timeoutID.current = setTimeout(() => {
        contentRef.current.style.height = 'auto'
        contentRef.current.style.overflow = 'visible'
      }, transitionDuration)
    } else {
      contentRef.current.style.overflow = 'hidden'
      contentRef.current.style.height = 0 + 'px'

      // Clear timeout on accordion close to avoid spillover of timeout function on quick toggle of accordion
      clearTimeout(timeoutID.current)
      timeoutID.current = null
    }
  }, [showAccordion])

  const handleOnClick = (event) => {
    // Add height on click to allow animation on accordion close
    contentRef.current.style.height = contentRef?.current?.scrollHeight + 'px'
    onClick(event)
  }

  useEffect(() => {
    return () => clearTimeout(timeoutID.current)
  }, [])

  return (
    <div className={`accordion ${className.container || ''}`}>
      <Button type='button' handleOnClick={(e) => handleOnClick(e)} notBtnRipple={true} classes={`accordion__button ${className.button || ''}`} id={id}>
        {title}
        <span className={`accordion__button__icon ${className.buttonIcon || ''}`}>
          {showAccordion ? closeIcon || '\u2212' : openIcon || '\u002B'}
        </span>
      </Button>
      <div className={`accordion__panel ${className.panel || ''}`} ref={contentRef}>
        {children}
      </div>
    </div>
  )
}

export default React.memo(Accordion)
