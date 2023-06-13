import React, { useState } from 'react'
import './Tooltip.scss'

/**
 * Represents a Tooltip component
 * 
 * @component
 * @example
 * <Tooltip
      className={{
        tooltipContainer: 'tooltip-class',
        tooltipText: 'tooltip-text-class',
      }}
      position='bottom' 
      content='Lorem Ipsum is simply dummy text.'
    >
      <span className='icon'>&#9432;</span>
    </Tooltip>
 */

const Tooltip = (props) => {
  const { content, position = 'top', className, width, children, reference } = props
  const [active, setActive] = useState(false)

  const toggleTip = () => {
    setActive(!active)
  }

  return (
    <div className={`sfy-tooltip ${className?.tooltipContainer || ''}`} onMouseEnter={toggleTip} onMouseLeave={toggleTip} ref={reference}>
      <span style={{ cursor: 'pointer' }}>{children}</span>
      {active && (
        <span className={`tooltip-text ${className?.tooltipText || ''} ${position}`} style={{ minWidth: `${width}` }}>
          {content}
        </span>
      )}
    </div>
  )
}

export default Tooltip
