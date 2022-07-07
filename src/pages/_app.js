import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { useRouter } from 'next/router';
import { OnlineUsers } from '../components/OnlineUsers';
import { SessionProvider } from 'next-auth/react';

import '../styles/globals.scss'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const { pathname } = useRouter();
  const [loggedComponents, setLoggedComponents] = useState(false);

  useEffect(() => {
    if (pathname !== "/Login" && pathname !== "/Register");
      setLoggedComponents(true);
  }, []);

  return (
    <SessionProvider session={session} >
      { loggedComponents ? <Header /> : <></> }

      <div id={"main-container"}>
        <Component {...pageProps} />
        { loggedComponents ? <OnlineUsers /> : <></> }
      </div>
    </SessionProvider>
  );
}

export default MyApp
