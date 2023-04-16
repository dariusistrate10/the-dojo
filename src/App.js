// styles
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Create from './pages/create/Create'
import Project from './pages/project/Project'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useAuthContext } from './hooks/useAuthContext';
import OnlineUsers from './components/OnlineUsers';

function App() {
  const { user, authIsReady } = useAuthContext()

  return (
    <div className="App">
      {authIsReady && 
        <Router>
        {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>
              {user && <Route exact path='/' element={ <Dashboard />}/>}
              {!user && <Route exact path='/' element={ <Navigate replace to='/login'/>}/>}
              {!user && <Route path='/login' element={ <Login />}/>}
              {user && <Route path='/login' element={ <Navigate replace to='/' />}/>}
              {!user && <Route path='/signup' element={ <Signup />}/>}
              {user && <Route path='/signup' element={ <Navigate replace to='/' />}/>}
              {user && <Route path='/create' element={ <Create />}/>}
              {!user && <Route path='/create' element={ <Navigate replace to='/login' />}/>}
              {user && <Route path='/projects/:id' element={ <Project />}/>}
              {!user && <Route path='/projects/:id' element={ <Navigate replace to='/login' />}/>}
            </Routes>
          </div>
          {user && <OnlineUsers />}
        </Router>
      }
    </div>
  );
}

export default App;
