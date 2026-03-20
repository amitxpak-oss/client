import { Link } from 'react-router-dom'

const CardActivation = () => {
  return (
    <section className="my-8 space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Card Status</h2>
        <p className="text-white/80 text-sm sm:text-base mb-6">Manage your credit card activation status</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/apply"
            className="flex-1 bg-white text-red-600 px-6 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Active Card
          </Link>
          <Link 
            to="/apply"
            className="flex-1 bg-red-800 text-white px-6 py-4 rounded-xl font-semibold hover:bg-red-900 transition-all shadow-lg flex items-center justify-center gap-3 border-2 border-white/30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
            </svg>
            Deactive Card
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-white text-xl sm:text-2xl font-bold">Card Protection</h2>
          </div>
        </div>
        <p className="text-white/90 text-sm sm:text-base mb-6">
          Protect yourself with India's first comprehensive card protection service. Stay safe from card loss, theft, with 24/7 support.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/apply"
            className="flex-1 bg-white text-blue-600 px-6 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            ACTIVATE
          </Link>
          <Link 
            to="/apply"
            className="flex-1 bg-blue-800 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-900 transition-all shadow-lg flex items-center justify-center gap-3 border-2 border-white/30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
            </svg>
            DEACTIVATE
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CardActivation
