import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import Contact from './components/Contact';
import OrderPage from './components/Order';
import './css/fonts.css';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;