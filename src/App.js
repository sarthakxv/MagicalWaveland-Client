import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export const App = () => {
	const [currentAccount, setCurrentAccount] = React.useState("");
	// Address of the contract I deployed on the blockchain
	const contractAddress = "0x1783aD7C27c0D7148BE7f373DacC7f55DebbD878";
	const contractABI = abi.abi;

	// check if wallet is available
  const checkWalletConnection = () => {
	  const { ethereum } = window;

	  if(!ethereum) {
		  console.log("Make sure you've metamask installed");
	  } else {
		  console.log(`Great! The ethereum object is here: `, ethereum);
	  }

		// checking if we're authorized to access user's wallet
		ethereum.request({ method: 'eth_accounts' })
			.then(accounts => {
				if(accounts.length !== 0) {
					// as accounts isn't empty, picking the first one
					const account = accounts[0];
					console.log("Authorized account found: ", account);

					// Storing the user's public wallet address for later
					setCurrentAccount(account);
				} else {
					console.log("No authorised account found");
				}
			})
  }

	// Connect your metamask wallet to your dapp
	const connectWallet = () => {
		const { ethereum } = window;

		if(!ethereum) {
			alert("Install metamask!");
		}

		ethereum.request({ method: 'eth_requestAccounts' })
			.then((accounts) => {
				console.log("Connected: ", accounts[0]);
				setCurrentAccount(accounts[0]);
			})
			.catch((err) => console.log("Error: ", err));
	}

	const wave = async () => {
		// Web3 provider wraps the standard web3 provider
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

		let count = await wavePortalContract.getTotalWaves();
		console.log("Retrieved total wave count: ", count.toNumber());

		const waveTxn = await wavePortalContract.wave();
		console.log("Mining... ", waveTxn.hash);
		await waveTxn.wait();
		console.log("WaveTxn -- ", waveTxn.hash);

		count = await wavePortalContract.getTotalWaves();
		console.log("Retrieved total wave count: ", count.toNumber());
	}

  React.useEffect(() => {
	  checkWalletConnection();
  }, []);
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
			<span role="img" aria-label="wave">👋</span>{' '}
         	Hello, I'm a decentralized bot
        </div>

        <div className="bio">
        I am Sarthak and I am having fun building on web3, that's pretty cool right?
		Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave} >
          Wave at Me
        </button>
				{currentAccount ? null : <button className="connectWallet" onClick={connectWallet}>
					Connect Wallet
				</button>}
      </div>
    </div>
  );
}

export default App;