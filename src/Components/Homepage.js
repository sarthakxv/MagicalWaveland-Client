import * as React from "react";
import { ethers } from "ethers";
import abi from "../utils/WavePortal.json";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Box,
  Text,
  Button,
  ButtonGroup,
  CloseButton,
} from "@chakra-ui/react";

export const Homepage = () => {
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [alertBox, setAlertBox] = React.useState(false);
  const [waveLoading, setWaveLoading] = React.useState(false);
  const [count, setCount] = React.useState(undefined);

  // Address of the contract I deployed on the blockchain
  const contractAddress = "0x1783aD7C27c0D7148BE7f373DacC7f55DebbD878";
  const contractABI = abi.abi;

  // check if wallet is available
  const checkWalletConnection = () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you've metamask installed");
    } else {
      console.log(`Great! The ethereum object is here: `, ethereum);
    }

    // checking if we're authorized to access user's wallet
    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length !== 0) {
        // as accounts isn't empty, picking the first one
        const account = accounts[0];
        console.log("Authorized account found: ", account);
        // Storing the user's public wallet address for later
        setCurrentAccount(account);
      } else {
        console.log("No authorised account found");
      }
    });
  };

  // Connect your metamask wallet to your dapp
  const connectWallet = () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Install metamask!");
    }

    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        console.log("Connected: ", accounts[0]);
        setCurrentAccount(accounts[0]);
      })
      .catch((err) => console.log("Error: ", err));
  };

  const wave = async () => {
    // Web3 provider wraps the standard web3 provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    let count = await wavePortalContract.getTotalWaves();
    setCount(count.toNumber());
    console.log("Retrieved total wave count: ", count.toNumber());
    // loading On at wave button
    setWaveLoading(true);
    const waveTxn = await wavePortalContract.wave();
    console.log("Mining... ", waveTxn.hash);
    await waveTxn.wait();
    console.log("WaveTxn -- ", waveTxn.hash);
    // loading off at wave button
    setWaveLoading(false);
    count = await wavePortalContract.getTotalWaves();
    setCount(count.toNumber());
    console.log("Retrieved total wave count: ", count.toNumber());
  };

  React.useEffect(() => {
    checkWalletConnection();
  }, []);

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      mt="64px"
      margin={8}
    >
      <Flex
        justify="center"
        align="center"
        direction="column"
        p={8}
        maxW="600"
        bg="blue.50"
        rounded="xl"
        boxShadow="0 5px 9px -1px rgba(0,0,0,0.21)"
      >
        <Text fontSize="4xl" textAlign="center" fontWeight="bold">
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          Hello, I'm a decentralized bot
        </Text>
        <Text fontSize="md" m={5} textAlign="center">
          I am Sarthak and I am having fun building on Web3. That's pretty cool
          right? Connect your Ethereum wallet and wave at me!
        </Text>

        <ButtonGroup>
          <Button
            onClick={currentAccount ? wave : () => setAlertBox(true)}
            colorScheme="yellow"
            isLoading={waveLoading}
            loadingText="waving..."
          >
            Wave at Me
          </Button>
          {currentAccount ? null : (
            <Button
              onClick={() => {
                connectWallet();
                setAlertBox(false);
              }}
              colorScheme="whatsapp"
              variant="outline"
            >
              Connect Wallet
            </Button>
          )}
        </ButtonGroup>

        {alertBox && (<Box mt={3} w="sm">
          <Alert status="error" rounded="lg" flexDirection="row" alignItems="center" justifyContent="center" textAlign="center">
            <AlertIcon />
            <Box flex="1">
                <AlertTitle mr={2}>Wallet not connected!</AlertTitle>
            <AlertDescription>
              Please connect your wallet first.
            </AlertDescription>
            </Box>
            
            <CloseButton onClick={() => setAlertBox(false)} position="absolute" right="4px" top="8px" />
          </Alert>
        </Box>)}
      </Flex>
      
      {count && (<Box mt={6}>
          <Text fontSize="3xl">Total Waves: {count}</Text>
      </Box>)}
    </Flex>
  );
};

export default Homepage;
