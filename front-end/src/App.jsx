import { useState } from 'react'
import './App.css'
import Layout from './components/Layout/Layout'
import useDirection from './i18n/useDirection'
function App() {
  const [count, setCount] = useState(0)
  useDirection();

  return (
    <>
      <Layout/>
    </>
  )
}

export default App
