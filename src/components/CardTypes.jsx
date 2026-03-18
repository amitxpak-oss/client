import { Link } from 'react-router-dom'

const CardTypes = () => {
  const cardTypes = [
    {
      title: 'New Credit Card',
      description: 'Apply for a new Kotak credit card and enjoy exclusive benefits',
      icon: 'M12 4v16m8-8H4',
      color: 'red',
      link: '/apply'
    },
    {
      title: 'Add-on Card',
      description: 'Add family members to your existing credit card account',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      color: 'blue',
      link: '/apply'
    },
    {
      title: 'Card Upgrade',
      description: 'Upgrade your existing card to a premium variant',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      color: 'green',
      link: '/apply'
    }
  ]

  const colorClasses = {
    red: 'bg-red-50 text-red-600 group-hover:bg-red-100',
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100'
  }

  const buttonClasses = {
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700'
  }

  return (
    <section className="card-animate">
      <div className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-card">
        <h3 className="font-bold text-textDark text-lg sm:text-xl lg:text-2xl mb-1">Credit Card Types</h3>
        <p className="text-textGrey text-sm mb-4 sm:mb-6">Choose the card that suits your needs</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {cardTypes.map((card, index) => (
            <div 
              key={index}
              className="group p-5 sm:p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-gray-50/50"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${colorClasses[card.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon}/>
                </svg>
              </div>
              <h4 className="font-bold text-textDark text-base sm:text-lg mb-2">{card.title}</h4>
              <p className="text-textGrey text-sm mb-4">{card.description}</p>
              <Link 
                to={card.link}
                className={`inline-flex items-center gap-2 ${buttonClasses[card.color]} text-white px-4 py-2 rounded-lg font-medium text-sm transition-all hover:shadow-md`}
              >
                Apply
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CardTypes
