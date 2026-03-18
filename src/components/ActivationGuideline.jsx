import { Link } from 'react-router-dom'

const ActivationGuideline = () => {
  return (
    <section className="card-animate">
      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 sm:w-40 lg:w-52 h-32 sm:h-40 lg:h-52 bg-white/5 rounded-full -mr-16 sm:-mr-20 lg:-mr-24 -mt-16 sm:-mt-20 lg:-mt-24"></div>
        <div className="absolute bottom-0 left-0 w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-40 bg-white/5 rounded-full -ml-12 sm:-ml-16 lg:-ml-20 -mb-12 sm:-mb-16 lg:-mb-20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg sm:text-xl lg:text-2xl">New Card?</h3>
              <p className="text-red-100 text-xs sm:text-sm mt-0.5 sm:mt-1">Quick activation guide</p>
            </div>
          </div>
          <p className="text-red-100 text-sm sm:text-base lg:text-lg mb-4 sm:mb-5 lg:mb-6 leading-relaxed">
            Follow simple steps to activate your new credit card and start enjoying benefits.
          </p>
          <Link to="/apply" className="w-full bg-white text-red-600 py-3.5 sm:py-4 lg:py-4.5 px-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base lg:text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center">
            APPLY NOW
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ActivationGuideline
