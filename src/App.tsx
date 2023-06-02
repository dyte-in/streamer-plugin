import { useContext } from 'react'
import './index.css'
import { Document, Dashboard } from './pages'
import { MainContext } from './context'

const App = () => {
  const { doc, plugin } = useContext(MainContext);

  return (
    <div className='container'>
      {
        plugin ? 
          doc 
            ? <Document plugin={plugin} /> 
            : <Dashboard />
          : <div>Loading Plugin...</div>
      }
      
    </div>
  )
}

export default App