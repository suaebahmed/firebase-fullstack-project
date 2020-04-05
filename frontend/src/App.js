import React from 'react';
import './App.css';
import Routes from './routes'
import Layout from './components/loyout'


function App() {
  return (
    <div className="App">
      <Layout/>
      <Routes/> 
    </div>
  );
}

export default App;
