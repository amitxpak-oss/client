import { Link } from 'react-router-dom'

const CardProtection = () => {
  return (
    <section className="card-animate">
      <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-card border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-textDark text-lg sm:text-xl">Card Controls</h3>
          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Active
          </span>
        </div>
        
        <div className="space-y-3">
          <Link 
            to="/apply"
            className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-textDark">Activate Card</p>
              <p className="text-xs text-textGrey">Enable your card for transactions</p>
            </div>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
          
          <Link 
            to="/apply"
            className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-textDark">Deactivate Card</p>
              <p className="text-xs text-textGrey">Temporarily pause card usage</p>
            </div>
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
          
          <Link 
            to="/apply"
            className="flex items-center gap-4 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-textDark">Block Card</p>
              <p className="text-xs text-textGrey">Permanently block if lost/stolen</p>
            </div>
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
          
          <Link 
            to="/apply"
            className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-textDark">Set Card Limit</p>
              <p className="text-xs text-textGrey">Manage your spending limit</p>
            </div>
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CardProtection
