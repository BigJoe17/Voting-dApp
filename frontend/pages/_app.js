import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { AuthProvider } from '../contexts/AuthContext';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { localhost } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [localhost],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'VotingDApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'voting-dapp-local',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
      >
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
