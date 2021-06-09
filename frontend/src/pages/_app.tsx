import { AppProps } from 'next/app';
import Axios from 'axios';
import React, { Fragment } from 'react';
import { useRouter } from 'next/router';

import '../styles/tailwind.css';

import Navbar from '../components/Navbar';

Axios.defaults.baseURL = 'http://localhost:5000/api';
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname); //returns true for login/signup page
  return (
    <Fragment>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </Fragment>
  );
}

export default App;
