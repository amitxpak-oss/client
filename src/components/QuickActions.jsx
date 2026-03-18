import { Link } from 'react-router-dom'

const QuickActions = () => {
  const actions = [
    { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', bg: 'bg-red-50', text: 'text-red-600', label: 'Credit Cards', link: '/apply' },
    { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'bg-green-50', text: 'text-green-600', label: 'Personal Loan', link: '/apply' },
    { icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', bg: 'bg-blue-50', text: 'text-blue-600', label: 'Savings Account', link: '/apply' },
    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', bg: 'bg-purple-50', text: 'text-purple-600', label: 'Insurance', link: '/apply' },
    { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', bg: 'bg-orange-50', text: 'text-orange-600', label: 'Investments', link: '/apply' },
    { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', bg: 'bg-teal-50', text: 'text-teal-600', label: 'Net Banking', link: null },
  ]

  return (
    <section className="card-animate">
      <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-card">
        <h3 className="font-bold text-textDark text-lg sm:text-xl lg:text-2xl mb-1">Quick Access</h3>
        <p className="text-textGrey text-sm mb-4 sm:mb-6">Access all banking services instantly</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {actions.map((action, index) => (
            action.link ? (
              <Link 
                key={index} 
                to={action.link}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${action.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon}/>
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-textGrey text-center group-hover:text-red-600 transition-colors">{action.label}</span>
              </Link>
            ) : (
              <button 
                key={index} 
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${action.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon}/>
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-textGrey text-center group-hover:text-red-600 transition-colors">{action.label}</span>
              </button>
            )
          ))}
        </div>
      </div>
    </section>
  )
}

export default QuickActions
