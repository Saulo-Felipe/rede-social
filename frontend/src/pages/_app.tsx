import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { Header } from '../components/core/Header';
import { OnlineUsers } from '../components/core/OnlineUsers';
import { SocketProvider } from '../hooks/useSocket';
import { AuthProvider } from '../hooks/useAuth';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} >
      <AuthProvider>
        <SocketProvider>
          <Header />

          <div id={"main-container"}>
            <OnlineUsers />
            <ToastContainer />

            <Component {...pageProps} />
          </div>
        </SocketProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}


export default MyApp
