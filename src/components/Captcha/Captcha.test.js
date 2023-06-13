import React from 'react'
import Captcha from './'
import { render } from '@testing-library/react'

describe('reCaptcha', () => {
  
  it('should render Component', () => {
    let recaptcha = 'abc123'
    window.grecaptcha = {
      ready: (callback) => {
         return callback()
      },
      render: () => {
        return recaptcha 
      }
    } 
    const {container} = render(<Captcha recaptcha='abc123' />)
    expect(container.firstChild).toHaveStyle('display : none') 
  })
})
