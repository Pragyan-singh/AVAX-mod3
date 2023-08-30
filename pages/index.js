import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }


  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
      <main>
      <button className="custom-button" onClick={connectAccount}>Please connect your Metamask wallet</button>
      <style jsx>{`
      .custom-button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        align-items: center;
      }
    `}
    </style>
      </main>
      )
    }

    return (
      <main>
        <p className="custom-paragraph">Your Account: {account}</p>
        <button className="custom-button" onClick={deposit}>Deposit 1 ETH</button>
        <button className="custom-button" onClick={withdraw}>Withdraw 1 ETH</button>
        <style jsx>{`
        .custom-paragraph {
          font-size: 1.2rem;
          color: #555;
          margin-bottom: 1.5rem;
        }
      .custom-button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        align-items: center;
      }
    `}
    </style>
      </main>
      
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="custom-container">
      <header className="custom-header">
        <h1 className="custom-heading">
          || मेटाक्रैफ्टर्स वेबसाइट में आपका स्वागत है! ||
        </h1>
        <h2 className="custom-subheading">
          || मैं आपकी मदद कैसे कर सकता हूं ||
        </h2>
      </header>
      {initUser()}
      <style jsx>{`
        .custom-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #ffffe0;
          font-family: Arial, sans-serif;
        }
      
        .custom-header {
          text-align: center;
          margin-bottom: 2rem;
        }
      
        .custom-heading {
          font-size: 2.5rem;
          color: #FF5722; /* Orange color */
        }
      
        .custom-subheading {
          font-size: 1.5rem;
          color: #4CAF50; /* Green color */
        }
      `}
      </style>
    </main>
  )
}
