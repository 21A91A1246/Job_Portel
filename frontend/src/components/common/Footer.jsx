import React from 'react'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './common.css'
const Footer = () => {
  return (
    <div>
        <div className='footerleftright'>
            <div className='footerleft'>
                <p style={{fontSize:'30px'}}>we're here to help</p>
                <p>Visit our Help Centre for answers to common questions or contact us directly.</p>
                <div className='footerbutton'><button type="button">Help Center</button> <button type="button">Contact Support</button> </div>
                
                <p style={{fontSize:'30px'}}>Connect with candidates faster</p>
            </div>
            <div className='footerright'>
                <ul>Indeed
                    <li><a href="/" >About Indeed</a></li>
                    <li><a href="/" >Accessibility at Indeed</a></li>
                    <li><a href="/" >Privacy Centre and ad choices</a></li>
                    <li><a href="/" >Press</a></li>
                    <li><a href="/" >Security</a></li>
                    <li><a href="/" >Terms</a></li>
                    <li><a href="/" >Work at Indeed</a></li>
                    <li><a href="/" >Countries</a></li>
                </ul>

                <ul>Employers
                    <li><a href="/" >Post a job</a></li>
                    <li><a href="/" >Products</a></li>
                    <li><a href="/" >Pricing</a></li>
                    <li><a href="/" >Employeer App</a></li>
                    <li><a href="/" >Insights</a></li>                    
                </ul>

                <ul>Resources
                    <li><a href="/" >How to hire employees</a></li>
                    <li><a href="/" >How to write job descriptions</a></li>
                    <li><a href="/" >Guide to hiring with Indeed</a></li>
                    <li><a href="/" >Interview questions guide</a></li>
                    <li><a href="/" >Indeed Events</a></li>
                </ul>
            </div>
        </div>
      <footer className='ftr'>
        <div className='ftrImgs'> 
            <img src="/imgs/gdpr.png" alt="" />
            <img src="/imgs/iso1.png" alt="" />
            <img src="/imgs/iso2.png" alt="" />
        </div>
        <center style={{fontSize:'12px',paddingTop:'10px'}}> {new Date().getFullYear()} JobPortal</center>
        <div className='ftrlogos'>
            <a href="https://facebook.com"><FaFacebook size={25} color="black" /></a>
            <a href="https://twitter.com"><FaTwitter size={25} color="black" /></a>
            <a href="https://linkedin.com"><FaLinkedin size={25} color="black" /></a>
            <a href="https://instagram.com"><FaInstagram size={25} color="black" /></a>
        </div>
      </footer>
    </div>
  )
}

export default Footer
