import logo from '../static/logo.svg'
import './App.css'
import './1.scss'
import { print } from './utils'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
function App() {
  print()
  const a = 23
  return (
    <div className="app">
      {a}
      {/* {process.env.REACT_APP_DEPLOY_ENV} */}
      <Skeleton />
      <Skeleton count={5} />
      <header className="app-header">
        <img
          src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/b3d1c941b152d5d41042f9c1e1b7509a.jpg?w=2452&h=920"
          alt=""
        />
        <img src={logo} className="app-logo" alt="logo" />
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React 12 14 15 16 17 18 19 20
        </a>
      </header>
    </div>
  )
}

export default App
