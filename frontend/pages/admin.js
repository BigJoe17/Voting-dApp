import { useState, useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ethers } from 'ethers'
import VotingABI from '../abis/VotingContract.json'
import AuthABI from '../abis/AuthManager.json'

const VOTING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''
const AUTH_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AUTH_CONTRACT_ADDRESS || ''

import { withAuth } from '../utils/withAuth';
import { useAuth } from '../contexts/AuthContext';

const AdminPage = () => {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { user, isAdmin } = useAuth()

  // Form state
  const [candidateName, setCandidateName] = useState('')
  const [durationSeconds, setDurationSeconds] = useState(60)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auth is now handled by the withAuth HOC

  async function addCandidate(e) {
    e.preventDefault()
    if (!walletClient || !window.ethereum || !isAdmin) {
      alert('Please connect your wallet and ensure you have admin access')
      return
    }

    if (!candidateName.trim()) {
      alert('Please enter a candidate name')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VotingABI.abi, signer)

      const tx = await contract.addCandidate(candidateName)
      console.log('Transaction hash:', tx.hash)
      await tx.wait()

      alert('✅ Candidate added successfully!')
      setCandidateName('')
    } catch (error) {
      console.error('addCandidate error:', error)
      alert(error?.reason || error?.message || 'Failed to add candidate')
    }
  }

  async function addDefaultCandidates() {
    if (!walletClient || !window.ethereum) {
      alert('Please connect your wallet')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VotingABI.abi, signer)

      let tx = await contract.addCandidate('John Doe')
      console.log('Adding John Doe:', tx.hash)
      await tx.wait()

      tx = await contract.addCandidate('Jane Smith')
      console.log('Adding Jane Smith:', tx.hash)
      await tx.wait()

      alert('✅ Default candidates added successfully!')
    } catch (error) {
      console.error('addDefaultCandidates error:', error)
      alert(error?.reason || error?.message || 'Failed to add default candidates')
    }
  }

  async function startElection() {
    if (!walletClient || !window.ethereum) {
      alert('Please connect your wallet')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VotingABI.abi, signer)

      const tx = await contract.startElection(durationSeconds)
      await tx.wait()

      alert('🚀 Election started successfully!')
    } catch (error) {
      console.error('startElection error:', error)
      alert(error?.reason || error?.message || 'Failed to start election')
    }
  }

  async function endElection() {
    if (!walletClient || !window.ethereum) {
      alert('Please connect your wallet')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VotingABI.abi, signer)

      const tx = await contract.endElection()
      await tx.wait()

      alert('🛑 Election ended successfully!')
    } catch (error) {
      console.error('endElection error:', error)
      alert(error?.reason || error?.message || 'Failed to end election')
    }
  }

  if (!mounted) return null

  if (!VOTING_CONTRACT_ADDRESS || !AUTH_CONTRACT_ADDRESS) {
    return (
      <main className="p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-bold">Configuration Required</p>
          <p>Set NEXT_PUBLIC_CONTRACT_ADDRESS and NEXT_PUBLIC_AUTH_CONTRACT_ADDRESS in your .env.local file</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
        <div>
          <h1 className="text-3xl font-bold text-indigo-600">⚙️ Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">
            Admin: {user?.username} ({address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Loading...'})
          </p>
        </div>
        <ConnectButton />
      </header>

      {!isConnected && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          <p>Please connect your wallet to access admin functions</p>
        </div>
      )}

      {isConnected && !isAdmin && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Access Denied</p>
          <p>Only administrators can access this page.</p>
          <p className="text-sm mt-2">Your address: {address}</p>
          <p className="text-sm">Username: {user?.username || 'Not logged in'}</p>
        </div>
      )}

      {isConnected && isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">➕ Add Candidate</h2>
            <form onSubmit={addCandidate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Election duration (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Number(e.target.value))}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Add Candidate
                </button>

                <button
                  type="button"
                  onClick={addDefaultCandidates}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Add Default Candidates
                </button>

                <button
                  type="button"
                  onClick={startElection}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Start Election
                </button>
              </div>
            </form>

            <div className="mt-4">
              <button
                onClick={endElection}
                className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
              >
                End Election
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
          ← Back to Voting Page
        </a>
      </div>
    </main>
  )
}

export default withAuth(AdminPage);