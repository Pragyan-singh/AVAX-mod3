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
      return <button onClick={connectAccount} style={{fontSize: "24px", backgroundColor: "rgba(255, 99, 71, 0.5)"}}>Please connect your Metamask wallet</button>
    }

    return (
      <div>
        <p style={{fontSize: "24px", textTransform: "uppercase", border: "2px solid Tomato"}}>Your Account: {account}</p>
        <button onClick={deposit} style={{fontSize: "24px", backgroundColor: "rgba(255, 99, 71, 0.5)"}}>Deposit 1 ETH</button>
        <button onClick={withdraw} style={{fontSize: "24px", backgroundColor: "rgba(255, 99, 71, 0.5)"}}>Withdraw 1 ETH</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header>
        <h1>
          || मेटाक्रैफ्टर्स वेबसाइट में आपका स्वागत है! ||
        </h1>
        <h2>
          || मैं आपकी मदद कैसे कर सकता हूं ||
        </h2>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}
      </style>
    </main>
  )
}
