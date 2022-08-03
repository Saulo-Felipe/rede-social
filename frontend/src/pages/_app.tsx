import { Header } from '../components/core/Header';
import { OnlineUsers } from '../components/core/OnlineUsers';
import { SessionProvider } from 'next-auth/react';
import { SocketProvider } from '../hooks/useSocket';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SSessionProvider } from '../hooks/useSession';

import '../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {

  return (
    <SSessionProvider>
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} >
      <SessionProvider session={pageProps.session} >
        <SocketProvider>
          <Header />

          <div id={"main-container"}>
            <OnlineUsers />
            <ToastContainer />

            <Component {...pageProps} />
          </div>
        </SocketProvider>
      </SessionProvider>
    </GoogleOAuthProvider>
    </SSessionProvider>
  );
}


export default MyApp
