// App.js
import { useEffect, useState } from 'react';
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
import ProtectedRoute from './components/Route/ProtectedRoute.js';
import UpdateProfile from './components/User/UpdateProfile.js';
import UpdatePassword from './components/User/UpdatePassword.js';
import ForgotPassword from './components/User/ForgotPasssword.js';
import ResetPassword from './components/User/ResetPassword.js';
import Cart from './components/Cart/Cart.js';
import Shipping from './components/Cart/Shipping.js';
import ConfirmOrder from './components/Cart/ConfirmOrder.js';
import Payment from './components/Cart/Payment.js';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './components/Cart/OrderSuccess.js';



function App() {

  const { isAuthenticated, user } = useSelector(state => state.user)

  const [stripeApiKey, setStripeApiKey] = useState("")

  async function getStripeApiKey() {
    const { data } = await axios.get('/api/v1/stripeapikey');

    setStripeApiKey(data.stripeApiKey)
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      },
    });
    store.dispatch(loadUser())

    getStripeApiKey()
  }, [])

  return (
    <>
      <Router>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/product/:id' element={<ProductDetails />} />
          <Route exact path='/products' element={<Products />} />
          <Route path='/products/:keyword' element={<Products />} />
          <Route exact path='/search' element={<Search />} />
          <Route exact path='/login' element={<LoginSignUp />} />
          <Route exact path='/cart' element={<Cart />} />
          <Route path="/account" element={<ProtectedRoute element={Profile} />} />
          <Route path="/me/update" element={<ProtectedRoute element={UpdateProfile} />} />
          <Route path="/password/update" element={<ProtectedRoute element={UpdatePassword} />} />

          <Route exact path='/password/forgot' element={<ForgotPassword />} />

          <Route exact path='/password/reset/:token' element={<ResetPassword />} />

          <Route path='/shipping' element={<ProtectedRoute element={Shipping} />} />

          <Route path='/order/confirm' element={<ProtectedRoute element={ConfirmOrder} />} />

          {stripeApiKey && (
            <Route path='/process/payment' element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <ProtectedRoute element={Payment} />
              </Elements>
            }
            />
          )}

          <Route path='/success' element={<ProtectedRoute element={OrderSuccess} />} />

        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
