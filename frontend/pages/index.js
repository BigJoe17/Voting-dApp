import { useEffect, useState } from 'react'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ethers } from 'ethers'
import ProposalCard from '../components/ProposalCard'
import ABI from '../abis/VotingContract.json'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''

export default function Home() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  async function loadCandidates() {
    if (!CONTRACT_ADDRESS) return
    setLoading(true)
    setError('')
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask or Coinbase Wallet')
        setLoading(false)
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, provider)
      
      // Get all candidates using the new getAllCandidates function
      const result = await contract.getAllCandidates()
      
      // result is a tuple: (ids, names, imageCIDs, voteCounts)
      const [ids, names, imageCIDs, voteCounts] = result
      
      const candidateData = ids.map((id, index) => ({
        id: Number(id),
        name: names[index],
        imageCID: imageCIDs[index],
        votes: Number(voteCounts[index])
      }))
      
      setCandidates(candidateData)
      setError('') // Clear any previous errors on success
    } catch (e) {
      console.error('loadCandidates', e)
      // Don't show error for network issues, just log it
      // Users can still try to interact and will get wallet prompts
    }
    setLoading(false)
  }

  useEffect(() => {
    loadCandidates()
    
    // Poll for updates every 5 seconds (simpler than event listeners with BrowserProvider)
    const interval = setInterval(() => {
      loadCandidates()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  async function handleVote(candidateId) {
    if (!walletClient || !window.ethereum) {
      alert('Please connect your wallet')
      return
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer)
      
      const tx = await contract.vote(candidateId)
      console.log('Transaction sent:', tx.hash)
      await tx.wait()
      console.log('Vote confirmed!')
      // Reload candidates to show updated vote count
      await loadCandidates()
    } catch (e) {
      console.error('vote error', e)
      const message = e?.reason || e?.message || 'Vote failed'
      alert(message)
    }
  }

  if (!mounted) {
    return null // Prevent hydration errors
  }

  if (!CONTRACT_ADDRESS) {
    return (
      <main className="p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Voting DApp</h1>
        </header>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-bold">Configuration Required</p>
          <p>Set NEXT_PUBLIC_CONTRACT_ADDRESS in your .env.local file</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-indigo-600">🗳️ Voting DApp</h1>
        <ConnectButton />
      </header>

      <div className="mb-6 flex gap-3">
        <button 
          onClick={loadCandidates}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : '🔄 Refresh Candidates'}
        </button>
        
        <a 
          href="/admin"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
        >
          ⚙️ Admin Panel
        </a>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No candidates yet. Ask the admin to add candidates!</p>
          </div>
        )}
        {candidates.map((c) => (
          <ProposalCard 
            key={c.id} 
            proposal={c} 
            onVote={() => handleVote(c.id)} 
            connected={isConnected} 
          />
        ))}
      </section>
    </main>
  )
}
