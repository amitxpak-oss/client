import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-card text-center">
        <div className="flex justify-center mb-4 sm:mb-5 lg:mb-6">
          <img 
            src="/KOTAKBANK.NS.png" 
            alt="Kotak Bank" 
            className="w-32 sm:w-36 lg:w-40 object-contain"
          />
        </div>
        <h4 className="font-semibold text-textDark text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3">100% Secure & Trusted App</h4>
        <p className="text-textGrey text-sm sm:text-base lg:text-lg mb-5 sm:mb-6 lg:mb-8 max-w-md mx-auto leading-relaxed">
          Your security is our priority. Bank with confidence knowing your data is protected.
        </p>
        
        <Link to="/apply" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold text-sm sm:text-base shadow-md transition-all duration-300 hover:bg-red-700 hover:shadow-lg mb-6">
          Apply for Credit Card
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Link>
        
        <div className="flex justify-center gap-3 sm:gap-4 lg:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-green-50 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 rounded-full">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs sm:text-sm lg:text-base font-medium text-green-700">Secure Login</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-red-50 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 rounded-full">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs sm:text-sm lg:text-base font-medium text-red-700">SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-purple-50 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 rounded-full">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs sm:text-sm lg:text-base font-medium text-purple-700">Privacy Protected</span>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 lg:mt-10 pt-6 sm:pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-5">
            <a href="#" className="text-textGrey hover:text-red-600 text-sm sm:text-base transition-colors">About Us</a>
            <a href="#" className="text-textGrey hover:text-red-600 text-sm sm:text-base transition-colors">Privacy Policy</a>
            <a href="#" className="text-textGrey hover:text-red-600 text-sm sm:text-base transition-colors">Terms of Service</a>
            <a href="#" className="text-textGrey hover:text-red-600 text-sm sm:text-base transition-colors">Contact</a>
          </div>
          <p className="text-textGrey text-xs sm:text-sm">© 2026 Kotak Mahindra Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
