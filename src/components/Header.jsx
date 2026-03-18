import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto h-16 sm:h-18 md:h-20 px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/KOTAKBANK.NS.png" 
            alt="Kotak Bank" 
            className="h-10 sm:h-12 md:h-14 object-contain hover:scale-105 transition-transform duration-200 cursor-pointer"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-red-600 font-bold text-sm sm:text-base md:text-lg tracking-wide">Kotak</span>
            <span className="text-gray-700 font-semibold text-xs sm:text-sm md:text-base">Mahindra Bank</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-red-600 transition-colors text-sm font-semibold">Home</Link>
          <Link to="/apply" className="text-gray-700 hover:text-red-600 transition-colors text-sm font-semibold">Cards</Link>
          <a href="#" className="text-gray-700 hover:text-red-600 transition-colors text-sm font-semibold">Accounts</a>
          <a href="#" className="text-gray-700 hover:text-red-600 transition-colors text-sm font-semibold">Support</a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Link to="/apply" className="hidden sm:flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Apply Now
          </Link>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
