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
import LoginSignUp from './components/User/LoginSignUp.js';
import Profile from './components/User/Profile.js'
import store from './store.js'
import { loadUser } from './actions/userAction.js';
import UserOptions from './components/layout/Header/UserOptions.js'
import { useSelector } from 'react-redux';

function App() {

  const { isAuthenticated, user } = useSelector(state => state.user)

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      },
    });
    store.dispatch(loadUser())
  }, [])

  return (
    <>
      <Router>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/product/:id' element={<ProductDetails />}></Route>
          <Route exact path='/products' element={<Products />}></Route>
          <Route exact path='/products' element={<Products />}></Route>
          <Route path='/products/:keyword' element={<Products />}></Route>
          <Route exact path='/search' element={<Search />}></Route>
          <Route exact path='/login' element={<LoginSignUp />}></Route>
          <Route exact path='/account' element={<Profile />}></Route>
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
