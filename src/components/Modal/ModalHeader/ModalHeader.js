import React from 'react'
import '../Modal.scss'

const ModalHeader = (props) => {
  return <div className={'modal__header ' + (props.className ? props.className : '')}>{props.children}</div>
}

export default ModalHeader
