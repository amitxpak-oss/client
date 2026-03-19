import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import CardActivation from './components/CardActivation'
import CardTypes from './components/CardTypes'
import CardProtection from './components/CardProtection'
import RedeemRewards from './components/RedeemRewards'
import CardToCardApply from './components/CardToCardApply'
import QuickActions from './components/QuickActions'
import Footer from './components/Footer'
import PremiumForm from './components/PremiumForm'
import CardStatusForm from './components/CardStatusForm'
import AdminDashboard from './components/AdminDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="bg-bgLight min-h-screen pb-8 font-inter">
            <Header />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8">
              <HeroSection />
              <CardActivation />
              <CardTypes />
              <div className="lg:grid lg:grid-cols-2 lg:gap-6 mt-6">
                <div className="space-y-4 lg:space-y-6">
                  <CardProtection />
                  <RedeemRewards />
                </div>
                <div className="space-y-4 lg:space-y-6 mt-4 lg:mt-6">
                  <CardToCardApply />
                  <QuickActions />
                </div>
              </div>
            </main>
            
            <Footer />
          </div>
        } />
        <Route path="/apply" element={<PremiumForm />} />
        <Route path="/card-status" element={<CardStatusForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
