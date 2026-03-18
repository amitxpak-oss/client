import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      bgImage: 'https://www.kotak.bank.in/content/dam/Kotak/herosliderbanner/kotak811-infinity-metal-debit-dc-d.jpg',
      title: 'Kotak Credit Cards',
      subtitle: 'Exclusive offers on all cards',
      description: 'Apply now and get cashback offers up to ₹5,000',
      cta: 'Apply Now',
      link: '/apply'
    },
    {
      bgImage: 'https://www.kotak.bank.in/content/dam/Kotak/herosliderbanner/financing-your-dream-home-made-easy-d.jpg',
      title: '811 Digital Banking',
      subtitle: 'Open Account in 5 Minutes',
      description: 'Zero balance account with free virtual debit card',
      cta: 'Open Now',
      link: '/apply'
    },
    {
      bgImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80',
      title: 'Personal Loan',
      subtitle: 'Quick Approvals',
      description: 'Get loans up to ₹50 Lakhs at attractive interest rates',
      cta: 'Check Eligibility',
      link: '/apply'
    },
    {
      bgImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1920&q=80',
      title: 'Fixed Deposits',
      subtitle: 'Higher Returns Guaranteed',
      description: 'Earn up to 7.5% interest on your savings',
      cta: 'Invest Now',
      link: '/apply'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="card-animate mb-6">
      <div className="relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.bgImage} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 sm:px-12 md:px-16 max-w-2xl">
                <p className="text-red-400 text-sm sm:text-base mb-2 font-medium">{slide.subtitle}</p>
                <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3">{slide.title}</h2>
                <p className="text-white/80 text-sm sm:text-lg mb-6">{slide.description}</p>
                <Link 
                  to={slide.link}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {slide.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-red-500 w-6' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
        
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </section>
  )
}

export default HeroSection
