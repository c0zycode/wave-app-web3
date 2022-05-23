import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
    const contractABI = abi.abi;
    const [userMessage, setUserMessage] = useState(""); 
    const [allWaves, setAllWaves] = useState([]);
    const [currentAccount, setCurrentAccount] = useState("");
    const contractAddress = "0x2924308941860407Ce3Ff98442A49EEa8E7a0AfA";
 
    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
            } else {
                console.log("We have the ethereum object", ethereum);
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account);
            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Implement your connectWallet method here
     */
    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const wave = async (userMessage) => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress,                        contractABI, signer);
              
                let count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total wave count...", count.toNumber());
             
                const waveTxn = await wavePortalContract.wave(userMessage, { gasLimit:                 300000 });
                console.log("Mining...", waveTxn.hash);
                await waveTxn.wait();
              
                console.log("Mined -- ", waveTxn.hash);
                count = await wavePortalContract.getTotalWaves();
              
                console.log("Retrieved total wave count...", count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();

      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);

    return (
        
        <div className="mainContainer">
            <div className="dataContainer">
                             
                <div className="header">👋 Hey there! 🌊</div>

                <div className="bio">
                    I am c0zy and I like to build stuff so that's pretty cool right? Connect your Ethereum wallet and wave at me! 👋🌊
                </div>

                <button className="waveButton" onClick={() => wave(userMessage)}>
                    🌊 Wave at Me 🌊
                </button>

                {!currentAccount && (
                    <button className="waveButton" onClick={connectWallet}>
                        🌊 Connect Wallet 🌊
                    </button>
              
                )}
              
                <div className="container-center">
                <label>Drop a message down below: </label>
                <input type="text"
                  className="container-input"
                  placeholder="Let me know what's on your mind..."
                  style={{ height: "35px", width: "565px", padding: "0 15px"}}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  />
                </div>

                <iframe src='https://www.youtube.com/embed/dQw4w9WgXcQ'
                  frameborder='0'
                  allow='autoplay; encrypted-media'
                  allowfullscreen
                  title='video'
                  width="100%"
                  height="360"
                />

                {allWaves.map((wave, index) => {
                    return (
                        <div key={index} style={{ backgroundColor: "#00abff", marginTop: "16px", padding: "8px" }}>
                            <div>Address: {wave.address}</div>
                            <div>Time: {wave.timestamp.toString()}</div>
                            <div>Message: {wave.message}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default App;