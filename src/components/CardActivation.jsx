import { useNavigate } from 'react-router-dom'

const CardActivation = () => {
  const navigate = useNavigate()
  
  const handleAction = (action) => {
    navigate(`/apply?type=${action}`)
  }

  return (
    <section className="my-8">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Card Status</h2>
        <p className="text-white/80 text-sm sm:text-base mb-6">Manage your credit card activation status</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => handleAction('activate')}
            className="flex-1 bg-white text-red-600 px-6 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Active Card
          </button>
          <button 
            onClick={() => handleAction('deactivate')}
            className="flex-1 bg-red-800 text-white px-6 py-4 rounded-xl font-semibold hover:bg-red-900 transition-all shadow-lg flex items-center justify-center gap-3 border-2 border-white/30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
            </svg>
            Deactive Card
          </button>
        </div>
      </div>
    </section>
  )
}

export default CardActivation
