import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import AuthManagerABI from '../abis/AuthManager.json';

const AUTH_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AUTH_CONTRACT_ADDRESS;

const AuthContext = createContext({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  login: async () => {},
  logout: () => {},
  checkAuth: async () => {},
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    // Check authentication status when component mounts
    checkAuth();
  }, [address]);

  async function checkAuth() {
    try {
      if (!address) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      // Check if ethereum is available
      if (!window.ethereum) {
        console.log('MetaMask not detected');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const authContract = new ethers.Contract(AUTH_CONTRACT_ADDRESS, AuthManagerABI.abi, provider);

      // Check if user is registered
      const isRegistered = await authContract.isRegistered(address);
      if (!isRegistered) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      // Get user details
      const userDetails = await authContract.getUserDetails(address);
      const isAdmin = await authContract.isAdmin(address);

      setIsAuthenticated(true);
      setIsAdmin(isAdmin);
      setUser({
        address,
        username: userDetails.username,
        isAdmin,
        registeredAt: userDetails.registeredAt
      });

      return true;
    } catch (err) {
      console.error('Auth check error:', err);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  }

  async function login(username, password) {
    try {
      if (!window.ethereum || !address) {
        throw new Error('Please connect your wallet');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const authContract = new ethers.Contract(AUTH_CONTRACT_ADDRESS, AuthManagerABI.abi, provider);

      const passwordHash = ethers.keccak256(ethers.toUtf8Bytes(password));
      const isValid = await authContract.verifyCredentials(address, passwordHash);

      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const userDetails = await authContract.getUserDetails(address);
      const isAdmin = await authContract.isAdmin(address);

      setIsAuthenticated(true);
      setIsAdmin(isAdmin);
      setUser({
        address,
        username: userDetails.username,
        isAdmin,
        registeredAt: userDetails.registeredAt
      });

      return true;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  }

  function logout() {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}