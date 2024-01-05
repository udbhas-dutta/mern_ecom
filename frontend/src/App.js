import { useEffect } from 'react';
import './App.css';
import Header from './components/layout/Header/Header.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import WebFont from "webfontloader"
import Footer from './components/layout/Footer/Footer.js'
import Home from './components/layout/Home/Home.js';


function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      },
    });
  }, [])

  return (
    <Router>
      <Header />
      <Routes>
      <Route exact path='/' element={<Home/>}></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
