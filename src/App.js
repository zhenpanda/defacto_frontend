import React, { useEffect, useState } from "react";
import gsap from "gsap";

import './assets/css/app.css';

import bgImg from './assets/images/bazaar_bg.png';
import dejureImg from './assets/images/tokens/dejure.png';
import defactoImg from './assets/images/tokens/defacto.png';
import merchantImg from './assets/images/merchant.png';
import arrowDownImg from './assets/images/arrow_down.png';

function App() {
  
  const [ merchantBox, setMerchantBox ] = useState(null);
  const [ workshop, setWorkshop ] = useState(null);
  const [ marketplace, setMarketplace ] = useState(null);
  const [ heroBox, setHeroBox ] = useState(null);
  const [ animationOn, setAnimationOn] = useState(false);

  useEffect(() => {
    
    if(!animationOn) {
      let tl = gsap.timeline({ repeat: -1 });
      tl.staggerFrom("#dotted-line circle", 0.7, { scale: 0.7, x: -2, y: .5, opacity: 0.5, delay:0.1, ease: "power2", repeat: 1, yoyo: true}, 0.1);
      setAnimationOn(true)
    }

  })

  return (
    <div className="app">

      <div className="header-title">
        <div className="title-main">De Facto</div>
        <div className="title-detail">A Rentable NFT Platform</div>
      </div>

      <div className="spacing" />

      <div className="bg-container">
        
        <div className="left-side-bar">
          <div className="floating-title">NFT Ownership</div>

          <div className="box-container">
            <div className="left-box">

              <div className="left-token-wrap">
                <img src={dejureImg} className="token-wrap-one" alt="" />
              </div>
              <div className="left-token-title">De Jure Owner</div>
              <div className="left-character-wrap">
                <img src={arrowDownImg} className="arrow-icon" alt="" />
                <img src={merchantImg} className="" alt="" />
              </div>

            </div>
            <div className="mid-box">
              <svg xmlns="http://www.w3.org/2000/svg" sXlink="http://www.w3.org/1999/xlink" className="line-wrapper">
                <g id="dotted-line" className="dotted-line">
                  <circle cx="40" cy="22" r="5"></circle>
                  <circle cx="60" cy="22" r="5"></circle>
                  <circle cx="80" cy="22" r="5"></circle>
                  <circle cx="100" cy="22" r="5"></circle>
                  <circle cx="120" cy="22" r="5"></circle>
                  <circle cx="140" cy="22" r="5"></circle>
                  <circle cx="160" cy="22" r="5"></circle>
                  <circle cx="180" cy="22" r="5"></circle>
                  <circle cx="200" cy="22" r="5"></circle>
                  <circle cx="220" cy="22" r="5"></circle>
                </g>
              </svg>
            </div>
            <div className="right-box">
              
              <div className="right-token-wrap">
                <img src={defactoImg} className="token-wrap-two" alt="" />
              </div>
              <div className="right-token-title">De Facto Owner</div>
              <div className="right-character-wrap">
                <img src={arrowDownImg} className="arrow-icon" alt="" />
                <img src={merchantImg} className="" alt="" />
              </div>

            </div>
          </div>

        </div>

        <div className="middle-bar">
          <img src={bgImg} className="bg-image" alt="" />

          <div className="character-name-plate">
            <div className="merchant-title">Merchant</div>
            <div className="hero-title">Hero</div>
          </div>
          
          <div className="character-boxes">
            <div className="merchant-body" onClick={() => setMerchantBox(true)} />
            <div className="hero-body" />
          </div>

        </div>
      
        <div className="right-side-bar">
          <div className="floating-title-green">NFT Rentals</div>
        </div>

      </div>

      {/* merchant wallet & hero wallet */}
      <div className="bottom-container">

        <div className="left-bottom-box">

        </div>

        <div className="right-bottom-box">

        </div>

      </div>

    </div>
  );

}

export default App;