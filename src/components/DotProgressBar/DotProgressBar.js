import React from 'react'
import './DotProgressBar.scss'
/**
 * Represents a Dot Progress Bar component
 *
 * @component
 * @example
 * <DotProgressBar currentIndex={1} progressBarItems={['Enter Details', 'Confirmation', 'Trade-In Value']} />
 */
const DotProgressBar = ({ currentIndex, progressBarItems, showStepCount, classNames = {}, reference, onDotClick, showTick = false }) => (
  <div className={`dot-progress-bar-container ${classNames.container || ''}`} ref={reference}>
    {progressBarItems.map((item, index) => (
      <div className={`dot-item  ${index <= currentIndex ? 'active' : ''} ${classNames.item || ''}`} key={index}>
        <div
          className={`dot-icon ${showTick ? 'dot-tick' : ''}  ${onDotClick && index <= currentIndex ? 'cursor-pointer' : ''} ${
            index !== progressBarItems.length - 1 && showStepCount && index === currentIndex ? 'current' : ''
          } ${classNames.icon || ''}`}
          onClick={index <= currentIndex ? () => onDotClick({ item, index }) : undefined}
        >
          {index === currentIndex && showStepCount && index !== progressBarItems.length - 1 && <span>{currentIndex + 1}</span>}
          <span className={`${index === currentIndex ? 'dot-circle' : ''}`}></span>
        </div>
        <div className={`dot-description ${classNames.description || ''}`}>{item}</div>
      </div>
    ))}
  </div>
)
export default DotProgressBar
