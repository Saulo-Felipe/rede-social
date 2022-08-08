import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { Header } from '../components/core/Header';
import { OnlineUsers } from '../components/core/OnlineUsers';
import { SocketProvider } from '../hooks/useSocket';
import { AuthProvider } from '../hooks/useAuth';
import {useRouter} from "next/router";

import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [authComponent, setAuthComponents] = useState(false);
  const path = useRouter().pathname;

  useEffect(() => {
    if (path.indexOf("auth") !== -1) {
      setAuthComponents(false);
    } else {
      setAuthComponents(true);
    }
  }, [path]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} >
      <AuthProvider>
        <SocketProvider>
          {authComponent ? <Header /> : <></>}

          <div id={"main-container"}>
            {authComponent ? <OnlineUsers /> : <></>}
            <ToastContainer />

            <Component {...pageProps} />
          </div>
        </SocketProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}


export default MyApp
