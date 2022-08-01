import { Header } from '../components/core/Header';
import { OnlineUsers } from '../components/core/OnlineUsers';
import { SessionProvider } from 'next-auth/react';
import { SocketProvider } from '../hooks/useSocket';

import '../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {

  return (
    <SessionProvider session={pageProps.session} >
      <SocketProvider>
        <Header />

        <div id={"main-container"}>
          <OnlineUsers />

          <Component {...pageProps} />
        </div>
      </SocketProvider>
    </SessionProvider>
  );
}


export default MyApp
