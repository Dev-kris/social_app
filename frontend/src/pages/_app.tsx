import { AppProps } from 'next/app';
import Axios from 'axios';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr'; //enables fetch data caching (reduce server load)

import { AuthProvider } from '../context/auth';

import '../styles/tailwind.css';

import Navbar from '../components/Navbar';

Axios.defaults.baseURL = 'http://localhost:5000/api';
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname); //returns true for login/signup page
  return (
    <SWRConfig
      value={{
        fetcher: (url) => Axios.get(url).then((res) => res.data),
        dedupingInterval: 5000, //limits fetching data from server to once / 5 seconds.
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
