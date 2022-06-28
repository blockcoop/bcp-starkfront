import "../styles/custom.scss";
import Head from "next/head";
import { InjectedConnector, StarknetProvider } from '@starknet-react/core'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  const connectors = [new InjectedConnector()]

  return (
    <StarknetProvider autoConnect connectors={connectors}>
      <Head>
        <title>BlockCOOP | StarkNet</title>
        <meta
          name="description"
          content="Create you COOP on Blockchain"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <ToastContainer />
      <Component {...pageProps} />
      <Footer />
    </StarknetProvider>
  )
}

export default MyApp
