import React, { useEffect } from 'react'

/**
 * Represents an Captcha component
 *
 * @component
 * @example
 * <Captcha recaptcha='someCaptchaKey' />
 * @property {String} recaptcha The Google reCAPTCHA key, required.
 * @property {String} display Defaults to none. Can be passed to show the reCAPTCHA.
 */

const Captcha = (props) => {
  const { recaptcha, display, reference } = props

  useEffect(() => {
    recaptcha &&
      window.grecaptcha.ready(() => {
        window.grecaptcha.render('recaptcha', {
          sitekey: recaptcha,
          size: 'invisible',
        })
      })
  }, [recaptcha])

  return <div id='recaptcha' style={{ display: display || 'none' }} ref={reference} />
}

export default React.memo(Captcha)
