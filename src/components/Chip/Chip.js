import React from 'react'
import './Chip.scss'
import Button from '../Button'

/**
 * Provides a Chip component
 *
 * @component
 * @example
 * <Chip onDelete={() => alert('remove')}>Deletable</Chip>
 *
 * @property {String} id id of the Chip.
 * @property {Function} onDelete A function that is called when the cross icon is clicked.
 * @property {Function} onClick A function thats is called when the Chip is clicked.
 * @property {String} btnId id of the delete button.
 * @property {Object} className Which can used to attach custom className to the Checkbox.
 * @property {Object} otherProps An object, which can be used to pass additional props.
 * @property {*} children An element or a component could be passed to render.
 */

const Chip = ({ id, children, onClick, onDelete, className = {}, otherProps = {}, btnId, reference }) => {
  return (
    <div id={id} onClick={onClick} className={`chip ${className.chip ? className.chip : ''}`} {...otherProps} ref={reference}>
      <div className={`chip__content ${className.content ? className.content : ''}`}>{children}</div>
      {onDelete && (
        <Button
          type='button'
          handleOnClick={(e) => {
            e.stopPropagation()
            onDelete(e)
          }}
          classes={`chip__del-btn ${className.delBtn ? className.delBtn : ''}`}
          text={'\u2715'}
          id={btnId}
        />
      )}
    </div>
  )
}

export default Chip
