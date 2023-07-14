import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { datadogRum } from '@datadog/browser-rum';
import Layout from '../components/Layout'
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon, mainnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Contractly",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

datadogRum.init({
    applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID as string,
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN as string,
    site: process.env.NEXT_PUBLIC_DATADOG_SITE,
    service: process.env.NEXT_PUBLIC_DATADOG_SERVICE,
    env: process.env.NEXT_PUBLIC_ENVIRONMENT,
    sessionSampleRate:100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel:'mask-user-input'
});
    
datadogRum.startSessionReplayRecording();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
      <Layout>
      <Component {...pageProps} />
      </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
