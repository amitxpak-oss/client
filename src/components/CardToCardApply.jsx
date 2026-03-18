import { Link } from 'react-router-dom'

const CardToCardApply = () => {
  return (
    <section className="card-animate">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-5 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 sm:w-60 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg sm:text-xl lg:text-2xl">Apply for Credit Card</h3>
              <p className="text-red-100 text-sm">Choose from 12+ card options</p>
            </div>
          </div>
          <p className="text-white/80 text-sm sm:text-base mb-5">
            Get exclusive cashback, rewards, and lifestyle benefits with Kotak credit cards.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/apply"
              className="flex-1 bg-white text-red-600 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-100 transition-all shadow-lg"
            >
              Apply Now
            </Link>
            <Link 
              to="/apply"
              className="flex-1 border-2 border-white text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-white/10 transition-all"
            >
              Compare Cards
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CardToCardApply
