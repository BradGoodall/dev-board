import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// Components
import Home from './components/Home';
import Board from './components/Board';
import Auth from './components/Auth';
import SignedOut from './components/SignedOut';
// Routing
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {



  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
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
