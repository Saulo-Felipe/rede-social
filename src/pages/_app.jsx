import { Header } from '../components/core/Header';
import { OnlineUsers } from '../components/core/OnlineUsers';
import { SessionProvider } from 'next-auth/react';

import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {

  return (
    <SessionProvider session={pageProps.session} >
      <Header />

      <div id={"main-container"}>
        <Component {...pageProps} />

        <OnlineUsers />
      </div>
    </SessionProvider>
  );
}


export default MyApp
