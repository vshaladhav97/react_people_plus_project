import { Route, Routes } from 'react-router-dom'
import Layout from './common/Layout'
import Login from './routes/Login/LandingPage'
import AuthorizedRoute from './AuthorizedRoute'
import './App.scss'

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path='*' element={<AuthorizedRoute />} />
          <Route path='/' element={<Login />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
