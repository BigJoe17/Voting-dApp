/**
 * Helper to manually trigger MetaMask connection
 * Use this if RainbowKit isn't properly opening MetaMask extension
 */
export async function connectMetaMask() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed. Please install MetaMask extension.');
    return null;
  }

  try {
    // Request accounts - this will trigger the MetaMask popup
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    console.log('Connected to MetaMask:', accounts[0]);
    return accounts[0];
  } catch (error) {
    console.error('MetaMask connection error:', error);
    
    if (error.code === 4001) {
      alert('Connection rejected. Please approve the connection in MetaMask.');
    } else if (error.code === -32002) {
      alert('Connection request already pending. Please check MetaMask extension and approve the connection.');
    } else {
      alert('Failed to connect to MetaMask: ' + error.message);
    }
    
    return null;
  }
}

/**
 * Check if user needs to switch to localhost network
 */
export async function checkNetwork() {
  if (typeof window.ethereum === 'undefined') return false;

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    // Localhost is 0x539 (1337 in decimal)
    if (chainId !== '0x539') {
      console.log('Not on localhost network. Current chain:', chainId);
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }],
        });
        return true;
      } catch (switchError) {
        // Network doesn't exist, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x539',
                chainName: 'Localhost 8545',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['http://127.0.0.1:8545'],
              }],
            });
            return true;
          } catch (addError) {
            console.error('Error adding network:', addError);
            return false;
          }
        }
        console.error('Error switching network:', switchError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Network check error:', error);
    return false;
  }
}
