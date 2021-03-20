import './assets/css/app.css';
import bgImg from './assets/images/bazaar_bg.png';
import React, { useEffect, useState } from "react";
import gsap from "gsap";

function App() {
  
  const [ merchantBox, setMerchantBox ] = useState(null);
  const [ workshop, setWorkshop ] = useState(null);
  const [ marketplace, setMarketplace ] = useState(null);
  const [ heroBox, setHeroBox ] = useState(null);

  useEffect(() => {
    let tl = gsap.timeline({ repeat: -1 });
    tl.staggerFrom("#dotted-line circle", 0.7, { scale: 0.7, x: -2, y: .5, opacity: 0.7, delay:0.1, ease: "power2", repeat: 1, yoyo: true}, 0.15);
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
          <div className="merchant-wallet-title">Merchant Wallet</div>
          <div className="">
          <svg xmlns="http://www.w3.org/2000/svg" sXlink="http://www.w3.org/1999/xlink" width="260px" height="45px">
            <g id="dotted-line" className="dotted-line">
              <circle cx="40" cy="22" r="3"></circle>
              <circle cx="60" cy="22" r="3"></circle>
              <circle cx="80" cy="22" r="3"></circle>
              <circle cx="100" cy="22" r="3"></circle>
              <circle cx="120" cy="22" r="3"></circle>
              <circle cx="140" cy="22" r="3"></circle>
              <circle cx="160" cy="22" r="3"></circle>
              <circle cx="180" cy="22" r="3"></circle>
              <circle cx="200" cy="22" r="3"></circle>
              <circle cx="220" cy="22" r="3"></circle>
            </g>
          </svg>
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

        </div>

      </div>

    </div>
  );

}

export default App;