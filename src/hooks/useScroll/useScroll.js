import { useEffect } from 'react'

const useScroll = (handleScroll) => {
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])
}

export default useScroll
