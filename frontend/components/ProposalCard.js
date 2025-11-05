export default function ProposalCard({ proposal, onVote, connected }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800">{proposal.name}</h2>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
          #{proposal.id}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500">Total Votes</p>
        <p className="text-3xl font-bold text-indigo-600">{proposal.votes}</p>
      </div>
      
      <button
        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={onVote}
        disabled={!connected}
        title={!connected ? "Connect wallet to vote" : "Cast your vote"}
      >
        {connected ? '✓ Vote' : '🔒 Connect to Vote'}
      </button>
    </div>
  )
}
