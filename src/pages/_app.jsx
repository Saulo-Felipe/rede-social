import { Header } from '../components/Header';
import { OnlineUsers } from '../components/OnlineUsers';
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
