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
      // Find MetaMask connector
      const metaMaskConnector = connectors.find(
        (connector) => connector.id === 'metaMask' || connector.name === 'MetaMask'
      );
      
      if (metaMaskConnector) {
        await connect({ connector: metaMaskConnector });
      } else {
        alert('MetaMask not found. Please install MetaMask extension.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect. Make sure MetaMask is unlocked and on Localhost network (Chain ID: 1337)');
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
      Connect MetaMask
    </button>
  );
}
