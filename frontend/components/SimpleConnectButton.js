import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function SimpleConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleConnect = async () => {
    try {
      // Debug: show available connectors
      console.debug('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name, ready: c.ready })));

      // Find Coinbase Wallet connector first, then MetaMask as fallback
      const coinbaseConnector = connectors.find(
        (connector) => connector.id === 'coinbaseWallet' || connector.name?.includes('Coinbase')
      );
      
      const metaMaskConnector = connectors.find(
        (connector) => connector.id === 'metaMask' || connector.id === 'injected' || connector.name === 'MetaMask'
      );

      // Try Coinbase first
      if (coinbaseConnector && coinbaseConnector.ready) {
        console.log('Connecting with Coinbase Wallet');
        await connect({ connector: coinbaseConnector });
        return;
      }

      // If Coinbase connector exists but not ready, try to connect anyway
      if (coinbaseConnector) {
        console.log('Attempting Coinbase connection');
        try {
          await connect({ connector: coinbaseConnector });
          return;
        } catch (err) {
          console.warn('Coinbase connection failed, trying fallback:', err);
        }
      }

      // Fallback to MetaMask if available
      if (metaMaskConnector) {
        console.log('Falling back to MetaMask');
        await connect({ connector: metaMaskConnector });
        return;
      }

      // Final fallback to any injected provider
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          return;
        } catch (err) {
          throw err;
        }
      }

      alert('No wallet found. Please install Coinbase Wallet or MetaMask extension.');
    } catch (error) {
      console.error('Connection error:', error);

      // Common error cases and actionable messages
      if (error?.data?.method === 'PUBLIC_requestAccounts' || (error?.message && error.message.includes('No active wallet'))) {
        alert('No active wallet found. Make sure your wallet extension is unlocked and check for a pending connection request.');
      } else if (error?.code === -32002) {
        // request already pending
        alert('A connection request is already pending. Please open your wallet extension and confirm the request.');
      } else if (error?.code === 4001) {
        // user rejected
        alert('Connection request rejected. Please approve the request in your wallet.');
      } else {
        alert('Failed to connect. Ensure your wallet is installed, unlocked, and on Localhost 8545 (Chain ID: 1337).\nError: ' + (error?.message || error));
      }
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      Connect Wallet
    </button>
  );
}
