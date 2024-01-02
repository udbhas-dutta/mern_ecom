import React from 'react'
import playStore from '../../../images/playstore.png'
import appStore from '../../../images/Appstore.png'
import "./Footer.css"

const Footer = () => {
    return (
        <footer id='footer'>
            <div className="leftFooter">
                <h4>Download Our App</h4>
                <p>Download App for Android and IOS </p>
                <img src={playStore} alt="playstore" />
                <img src={appStore} alt="playstore" />
            </div>

            <div className="midFooter">
                <h1>LOGO</h1>
                <p>Where customer meets satisfaction</p>

                <p>Copyright 2024 &copy; UdbhasDutta</p>
            </div>

            <div className="rightFooter">
                <h4>Follow Us</h4>
                <a href="https://www.linkedin.com/in/udbhas-dutta/">LinkedIn</a>
                <a href="https://www.linkedin.com/in/udbhas-dutta/">LinkedIn</a>
                <a href="https://www.linkedin.com/in/udbhas-dutta/">LinkedIn</a>
            </div>

        </footer>
    )
}

export default Footer
