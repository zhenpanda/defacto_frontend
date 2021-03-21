import React, { useEffect, useState } from "react";
import gsap from "gsap";
import ReactTooltip from 'react-tooltip';

import escrowRentAbi from './abi/EscrowRent.json';

import './assets/css/app.css';

import bgImg from './assets/images/bazaar_bg.png';
import dejureImg from './assets/images/tokens/dejure.png';
import defactoImg from './assets/images/tokens/defacto.png';
import merchantImg from './assets/images/merchant.png';
import heroImg from './assets/images/hero.png';
import arrowDownImg from './assets/images/arrow_down.png';

function App({web3}) {

  const [ account, setAccount ] = useState(null);

  const [ merchantBox, setMerchantBox ] = useState(null);
  const [ workshop, setWorkshop ] = useState(null);
  const [ marketplace, setMarketplace ] = useState(null);
  const [ heroBox, setHeroBox ] = useState(null);
  const [ animationOn, setAnimationOn] = useState(false);

  const [ setupStep, setSetupStep ] = useState(0);
  const [ payDue, setPayDue ] = useState(0);
  const [ payPeriod, setPayPeriod ] = useState(0);
  const [ deadline, setDeadline ] = useState(0);

  const [ marketView, setMarketView ] = useState(null);
  const [ defactoOwner, setDefactoOwner] = useState("Merchant");
  const [ heroWallet, setHeroWallet] = useState(null);

  useEffect(() => {
    
    if(!animationOn) {
      let tl = gsap.timeline({ repeat: -1 });
      tl.staggerFrom("#dotted-line circle", 0.7, { scale: 0.7, x: -2, y: .5, opacity: 0.5, delay:0.1, ease: "power2", repeat: 1, yoyo: true}, 0.1);
      setAnimationOn(true)
    };
    
    if(web3 && !account) {
      let callAcc = async() => {
        let acc = await web3.eth.getAccounts();
        console.log(acc);
        setAccount(acc);
      }
      callAcc()
    }

  })

  const contractAddress = "0xFb50817bBcb4E8F6F80d6133f92BD6A59277bf4F";
  const nateAddress = "0xd0C81E82AbDdF29C6505d660f5bEBe60CDFf03c5";
  const nftAddress = "0x564cC4Dc07fB2720328f07e1e22D78E15b110877";

  // ABI blockchain Methods
  // -----------------------------------------------------------------
  const listForRent = async () => {
    console.log("listForRent - called");
    let contract = new web3.eth.Contract(escrowRentAbi, contractAddress);
    let day = 60 * 60 * 24;
    let week = day * 7;
    await contract.methods.listForRent(nftAddress, 0, "100000000000000000", day, week).send({
      "from": account[0]
    });
  }
  // return a list of tokens that's offered on the market place
  const listAvilableToken = async () => {
    let contract = new web3.eth.Contract(escrowRentAbi, contractAddress);
    // console.log(contract);
    let dejures = await contract.methods.dejures(nateAddress,0).call();
    console.log(dejures);
  }
  const rentToken = async () => {
    let contract = new web3.eth.Contract(escrowRentAbi, contractAddress);
    await contract.methods.rent(nftAddress, 0).send({
      "from": account[0],
      "value": "100000000000000000"
    })
  }
  const returnToken = async () => {
    let contract = new web3.eth.Contract(escrowRentAbi, contractAddress);
    await contract.methods.returnRent(nftAddress, 0).send({
      "from": account[0]
    })
  }

  const displayRentalSetup = () => {
    switch(setupStep) {
      case 0: 
        return(
          <div className="">

            <div className="token-listing-wrap">
              <div className="token-display">
                
                <div className="right-token-wrap">
                  <img src={defactoImg} className="token-wrap-two" alt="" />
                </div>

              </div>
              <div className="token-setup">

                <div className="setup-text">Cost of rental per pay period (In ETH): <input className="input" value={payDue} onChange={(e) => setPayDue(e.value)}/></div>
                <div className="setup-text">Number hours per pay period: <input className="input" value={payPeriod} onChange={(e) => setPayPeriod(e.value)}/></div>
                <div className="setup-text">Max number of days for rent: <input className="input" value={deadline} onChange={(e) => setDeadline(e.value)}/></div>
                
              </div>
            </div>

            <div className="list-token-btn" onClick={() => {
              listForRent()
            }}>List Token For Rent</div>

          </div>
        )
      default:
        return <div />
    }
  }

  const displayMarket = (marketView) => {
    if(marketView === "forRent") {

      return(
        <div className="display-token">
          <div className="right-token-wrap">
            <img src={defactoImg} className="token-wrap-two" alt="" />
          </div>
          <div className="rent-btn" onClick={() => {
            // alert("renting request!");
            rentToken();
            setMarketView(null);
            setTimeout(() => {
              setDefactoOwner("Hero");
            }, 4000)
          }}>Rent It</div>
        </div>
      )

    }else{
      return <div />
    }
  }

  const displayDefactoOwner = (defactoOwner) => {
    switch(defactoOwner) {
      case "Merchant":
        return(
          <img src={merchantImg} className="" alt="" />
        )
      case "Hero":
        return(
          <img src={heroImg} className="" alt="" />
        )
      default: break;
    }
  }

  const displayHeroToken = (defactoOwner) => {
    switch(defactoOwner) {
      case "Hero":
        return(
          <div className="hero-token-wrap">
            <img src={defactoImg} className="token-wrap-two" alt="" />
          </div>
        )
      default: break;
    }
  }

  const displayToolTip = (input) => {
    switch(input) {
      case "defacto":
        return (
          <ReactTooltip type='light' place="right" effect="float" id="happyFace">
            <div className="item-description-box">
              <div className="item-title">[ Sword of Fighting ]</div>
              <div className="item-divider" />
              <span className="item-address">Owner = "Merchant" - Address: 0x0601...</span>
              <div className="item-divider" />
              <span className="item-address">Holder = "Hero" - Address: 0xb16...</span>
              <div className="item-divider" />
              <span className="item-detail">Holder of this NFT can open the portal of light in game version 0.5.1</span>
              <div className="item-divider" />
              <span className="item-detail-text">Details: The person who controls this swords pays a great price to hold it.</span>
            </div>
          </ReactTooltip>
        )
      default: break;
    }
  }

  const displayRentBtn = (defactoOwner) => {
    if(defactoOwner === "Hero") {
      return(
        <div className="return-token-btn" onClick={() => {
          returnToken();
          setTimeout(() => {
            setDefactoOwner("Merchant")
          }, 4000)
        }}>Return Token</div>
      )
    }else{
      return <div />
    }
  }

  if(web3 !== null) {

    return (
      <div className="app">
  
        <div className="header-title">
          <div className="title-main">De Facto</div>
          <div className="title-detail">A Rentable NFT Platform</div>
        </div>
  
        <div className="spacing" />
  
        {/* ownership / splash img / market place */}
        <div className="bg-container">
          
          <div className="left-side-bar">
            <div className="floating-title">[ NFT Ownership ]</div>
  
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
                <div className="right-token-title">De Facto Holder</div>
                <div className="right-character-wrap">
                  <img src={arrowDownImg} className="arrow-icon" alt="" />
                  {displayDefactoOwner(defactoOwner)}
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
            <div className="floating-title-green">NFT Rentals Market</div>
            <div className="refresh-btn" onClick={() => {
              listAvilableToken();
              setMarketView("forRent")
            }}>Refresh Market</div>
            {displayMarket(marketView)}
          </div>
  
        </div>
  
        {/* merchant wallet & hero wallet */}
        <div className="bottom-container">
  
          <div className="left-bottom-box">
            <div className="token-setup-title">Token Listing Setup</div>
            {displayRentalSetup()}
          </div>
  
          <div className="right-bottom-box">
            <div className="hero-wallet-title">Hero Wallet</div>
              
            <div data-tip data-for='happyFace'>
              {displayHeroToken(defactoOwner)}
            </div>

            {displayRentBtn(defactoOwner)}

            {displayToolTip("defacto")}
          </div>
  
        </div>
  
      </div>
    )

  }else{
    return <div />
  }

}

export default App;