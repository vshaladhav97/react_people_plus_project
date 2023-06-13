import { useEffect, useState } from 'react'

const useSlideAnimation = (pathname) => {
  const [className, setClassName] = useState('')
  const [isBackButtonPressed, setIsBackButtonPressed] = useState(false)

  useEffect(() => {
    window.addEventListener('popstate', onBackClick)
    return () => {
      window.removeEventListener('popstate', onBackClick)
    }
  }, [])

  const onBackClick = () => {
    setIsBackButtonPressed(true)
  }

  useEffect(() => {
    setClassName('')
  }, [pathname])

  useEffect(() => {
    if (!className) {
      setTimeout(() => {
        if (isBackButtonPressed) {
          setClassName('slide-out')
          setIsBackButtonPressed(false)
        } else {
          setClassName('slide-in')
        }
      }, 10)
    }
  }, [className, isBackButtonPressed])

  return className
}

export default useSlideAnimation
