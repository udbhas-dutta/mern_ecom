import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const options = {
  autoClose: 3000,
  position: toast.POSITION.BOTTOM_CENTER,
  transition: Slide
};

const root = createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <ToastContainer {...options} />
    <App />
  </Provider>,
);
