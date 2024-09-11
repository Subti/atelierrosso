import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <Navbar />
      {/* <h1>WEBSITE UNDER CONSTRUCTION</h1>
      <h1 style={{ margin: 0 }}>VOTE HERE FOR THE BIWEEKLY FLAVOR SWAP!</h1>
      <a 
        href="https://forms.gle/GpAmYk6biBnxfuWi8" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#8B4513', // Brown background
          color: '#D2B48C', // Light brown text
          borderRadius: '5px', // Rounded corners
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: '20px'
        }}
      >
        Vote!
      </a> */}
      <Home />
    </>
  )
}

export default App
