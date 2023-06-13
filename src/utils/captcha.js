export const getCaptcha = async () => {
  try {
    return await window.grecaptcha.execute()
  } catch (e) {
    const error = {
      data: {},
      msg: 'reCAPTCHA unavailable !',
    }
    throw error
  }
}
