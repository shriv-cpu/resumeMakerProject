import React, { useState } from 'react'
import { LayoutTemplate, Menu } from 'lucide-react';
import { landingPageStyles } from '../assets/dummystyle'

const LandingPage = () => {

  const [mobileMenuOpen, setMobileMenuOpen]=useState(false)
  return (
    <div className={landingPageStyles.container}>
      {/*header*/}

      <header className={landingPageStyles.header}>
        <div className={landingPageStyles.headerContainer}>
          <div className={landingPageStyles.logoContainer}>
            <div className={landingPageStyles.logoIcon} >
              <LayoutTemplate className={landingPageStyles.logoIconInner}/>
            </div>
            <span className={landingPageStyles.logoText}>
              ResumeXpert
            </span>
          </div>
          {/*mobile button menu*/}
          <button className={landingPageStyles.mobileMenuButton}
            onClick={()=> setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? 
              <X size={24} className={landingPageStyles.mobileMenuIcon}/> :
              <Menu size={24} className={landingPageStyles.mobileMenuIcon}/>} 
            

          </button>
          {/*desktop navigation*/}
              <div className='hidden md:flex items-center'>
                {user}
              </div>

        </div>

      </header>
      
    </div>
  )
}

export default LandingPage