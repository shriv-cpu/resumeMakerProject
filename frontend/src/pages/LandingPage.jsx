import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutTemplate, Menu, X, ArrowRight } from 'lucide-react';
import { landingPageStyles } from '../assets/dummystyle'
import { UserContext } from '../context/UserContext'

const LandingPage = () => {
  const {user} =useContext(UserContext)
  const navigate =useNavigate();
  const [openAuthModal, setOpenAuthModal]=useState(false)

  
  const [mobileMenuOpen, setMobileMenuOpen]=useState(false)
  const[currentPage,setCurrentPage]=useState("login")

  const handleCTA =()=>{
    if(!user){
      setOpenAuthModal(true)
    }else{
      navigate('/dashboard')
    }
  }
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
                {user ? (
                  <div>Welcome, {user.name || user.email || 'User'}</div>
                ): (
                  <button className={landingPageStyles.desktopAuthButton} onClick={()=>setOpenAuthModal(true)}>
                    <div className={landingPageStyles.desktopAuthButtonOverlay}></div>
                    <span className={landingPageStyles.desktopAuthButtonText}>Get Started</span>
                  </button>
                )}
              </div> 

        </div>
                   {/*Mobile menu*/} 
                   {mobileMenuOpen && (
                    <div className={landingPageStyles.mobileMenu}>
                      <div className={landingPageStyles.mobileMenuContainer}>
                        {user ? (
                          <div className={landingPageStyles.mobileMenuInfo}>
                            <div className={landingPageStyles.mobileUserWelcome}>
                              welcome back
                            </div>
                            <button className={landingPageStyles.mobileDashboardButton}
                            onClick={()=>{
                              navigate('/dashboard');
                              setMobileMenuOpen(false)
                            }}>
                            go to dashboard
                            </button>
                            
                          </div>
                        ) : (
                          <button className={landingPageStyles.mobileAuthButton } onClick={()=>setOpenAuthModal(true)}>
                            get started
                          </button>
                        )}
                      </div>
                    </div>
                   )}
      </header>
                   {/* main content*/}
                    <main className={landingPageStyles.main}>
<section className={landingPageStyles.heroSection}>
<div className={landingPageStyles.heroGrid}>
{/* LEFT CONTENT */}
<div className={landingPageStyles.heroLeft}>
<div className={landingPageStyles.tagline}>
Professional Resume Builder
</div>
<h1 className={landingPageStyles.heading}>
<span className={landingPageStyles.headingText}>Craft</span>
<span className={landingPageStyles.headingGradient}>Professional</span>
<span className={landingPageStyles.headingText}>Resumes</span>
</h1>
<p className={landingPageStyles.description}>
Create job-winning resumes with expertly designed templates.
ATS-friendly, recruiter-approved, and tailored to your career goals.
</p>

                  <div className={landingPageStyles.ctaButtons}>
<button className={landingPageStyles.primaryButton}
onClick={handleCTA}>
<div className={landingPageStyles.primaryButtonOverlay}></div>
<span className={landingPageStyles.primaryButtonContent}>
Start Building
<ArrowRight className={landingPageStyles.primaryButtonIcon} size={18}/>
</span>
</button>
<button className={landingPageStyles.secondaryButton} onClick={handleCTA}>
View Templates
</button>
</div>
</div>
</div>
</section>
</main>
                   
    </div>
  )
}

export default LandingPage