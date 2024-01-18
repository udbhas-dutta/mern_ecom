import { useEffect } from 'react';
import './App.css';
import Header from './components/layout/Header/Header.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import WebFont from "webfontloader"
import Footer from './components/layout/Footer/Footer.js'
import Home from './components/Home/Home.js';
import ProductDetails from './components/Product/ProductDetails.js';
import Products from './components/Product/Products.js'
import Search from './components/Product/Search.js'

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      },
    });
  }, [])

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/product/:id' element={<ProductDetails />}></Route>
          <Route exact path='/products' element={<Products />}></Route>
          <Route exact path='/products' element={<Products />}></Route>
          <Route path='/products/:keyword' element={<Products />}></Route>
          <Route exact path='/search' element={<Search />}></Route>
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
