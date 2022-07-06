import { useEffect } from 'react';
import { Header } from '../components/Header';
import { useRouter } from 'next/router';

import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();


  return (
    <>
      { 
        pathname !== "/Login" && pathname !== "/Register" 
        ? <Header /> 
        : <></>
      }

      <Component {...pageProps} />
    </>
  );
}

export default MyApp
