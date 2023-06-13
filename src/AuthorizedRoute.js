import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './routes/Home'

const AuthorizedRoute = () => {
  const authorization = ''
  return authorization?.length > 0 ? (
    <main className='main-container'>
      <Routes>
        <Route path='home/*' element={<Home />}></Route>
        <Route path='*' element={<Navigate to='/home' replace />} />
      </Routes>
    </main>
  ) : (
    <Navigate to='/' replace />
  )
}

export default AuthorizedRoute
