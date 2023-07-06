import { useContext } from 'react'
import './index.css'
import logo from '../src/assets/logo.png'
import { MainContext } from './context'
import Dashboard from './pages/dashboard/Dashboard'
import Player from './pages/player/Player'

const App = () => {
  const { plugin, activePlayer } = useContext(MainContext);

  return (
    <div className='container'>
      {
        plugin
          ? activePlayer ? <Player /> : <Dashboard />
          : <div className="loading-page">
            <img src={logo} />
            <p>Streamer</p>
          </div>
      }
    </div>
  )
}

export default App