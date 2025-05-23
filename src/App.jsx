import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import Contact from './components/Contact';
import OrderPage from './components/Order';
import Success from './components/Success';
import Cancel from './components/Cancel';
import AdminOrders from './components/AdminOrders';
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
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;