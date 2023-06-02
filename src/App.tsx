import { useContext } from 'react'
import './index.css'
import { Document, Dashboard } from './pages'
import logo from '../src/assets/document.png'
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
          : <div className="loading-page">
              <img src={logo} />
            </div>
      }
    </div>
  )
}

export default App