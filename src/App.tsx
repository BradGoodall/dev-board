import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// Components
import Home from './components/Home';
import Board from './components/Board';
import LoginForm from './components/LoginForm';
import SignedOut from './components/SignedOut';
// Routing
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {



  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/board">
            <Route index element={<Board />} />
            <Route path=":boardURL" element={<Board />} />
          </Route>
          <Route path="/signedout" element={<SignedOut />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
