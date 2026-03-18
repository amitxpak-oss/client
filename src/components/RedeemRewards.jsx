import { Link } from 'react-router-dom'

const RedeemRewards = () => {
  return (
    <section className="card-animate">
      <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-card border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-textDark text-lg sm:text-xl">Rewards</h3>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">12,500 pts</span>
        </div>
        <p className="text-textGrey text-sm mb-4">Available reward points to redeem</p>
        
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold">₹</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-textDark text-sm">Cashback</p>
              <p className="text-xs text-textGrey">Convert points to cash</p>
            </div>
            <span className="text-xs text-textGrey">100 pts = ₹1</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-textDark text-sm">Gift Vouchers</p>
              <p className="text-xs text-textGrey">Amazon, Flipkart & more</p>
            </div>
          </div>
        </div>
        
        <Link to="/apply" className="block w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-red-700 transition-all">
          Redeem Now
        </Link>
      </div>
    </section>
  )
}

export default RedeemRewards
