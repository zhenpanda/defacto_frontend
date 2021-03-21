import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";

import App from './App';

const WebWrapper = () => {

  // web3 connectors    
  const web3Modal = new Web3Modal({
    network: "Kovan", // optional
    cacheProvider: true, // optional
    providerOptions: {}
  });
  
  let [web3, setWeb3] = useState(null);

  let callProvider = async () => {
    let provider = await web3Modal.connect(); 
    if(provider) {
      let web = new Web3(provider);
      setWeb3(web)
    }
  };
  
  useEffect(() => {
    if(!web3) {
      callProvider();
    }
  }, [web3])

  if(web3) {
    return(
      <App 
        web3={web3}
      />
    )
  }else{
    return <div />
  }

}
export default WebWrapper;