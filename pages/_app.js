import { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import '../public/scss/global.scss';
import 'antd/dist/antd.css';
import '../public/css/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from '../context';
import Head from 'next/head';

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  // The following effect will be ignored on server,
  // but run on the browser to set the flag true, gets rid of useLayoutEffect error
  useEffect(() => setIsClient(true), []);
  return isClient;
}

function MyApp({ Component, pageProps }) {
  const isClient = useIsClient();

  return (
    <Provider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ToastContainer position="top-center" />
      {isClient && <TopNav />}
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
