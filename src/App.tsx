import { useContext } from 'react'
import './index.css'
import { Document, Dashboard } from './pages'
import { MainContext } from './context'

const App = () => {
  const { document } = useContext(MainContext);

  return (
    <div className='container'>
      {
        document 
        ? <Document />
        : <Dashboard />
      }
    </div>
  )
}

export default App