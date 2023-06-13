import { useEffect, useState } from 'react'

const XSMALL = 'xsmall'
const SMALL = 'small'
const MEDIUM = 'medium'
const LARGE = 'large'
const XLARGE = 'xlarge'

const useWindowResize = (customResizeHandler = () => {}) => {
  const [screenSize, setScreenSize] = useState('')

  useEffect(() => {
    const handleResize = (e) => {
      const windowWidth = window.innerWidth
      windowWidth < 600
        ? setScreenSize(XSMALL)
        : windowWidth < 768
        ? setScreenSize(SMALL)
        : windowWidth < 992
        ? setScreenSize(MEDIUM)
        : windowWidth < 1200
        ? setScreenSize(LARGE)
        : setScreenSize(XLARGE)
      customResizeHandler(e)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [customResizeHandler])
  return screenSize
}

export default useWindowResize
