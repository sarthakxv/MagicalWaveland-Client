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
  CloseButton,
  useColorMode,
  Textarea,
  VStack,
  StackDivider,
  useColorModeValue
} from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";
import bgGrade from "../utils/images/bgGrad.png";

export const Homepage = () => {
  // getting address of connected wallet
  const [currentAccount, setCurrentAccount] = React.useState("");
  // number of waves
  const [count, setCount] = React.useState(undefined);
  // all waves array
  const [allWaves, setAllWaves] = React.useState([]);
  const [alertBox, setAlertBox] = React.useState(false);
  const [waveLoading, setWaveLoading] = React.useState(false);
  const [msgValue, setMsgValue] = React.useState("");

  // Color Mode of Chakra UI
  const { colorMode } = useColorMode();
  // Address of the contract I deployed on the blockchain
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  // check if wallet is available
  const checkWalletConnection = () => {
    const { ethereum } = window;

    // if (!ethereum) {
    //   console.log("Make sure you've metamask installed");
    // } else {
    //   console.log(`Great! The ethereum object is here: `, ethereum);
    // }

    // checking if we're authorized to access user's wallet
    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length !== 0) {
        // as accounts isn't empty, picking the first one
        const account = accounts[0];
        
        // console.log("Authorized account found: ", account);

        // Storing the user's public wallet address for later
        setCurrentAccount(account);
        getAllWaves();
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
        // console.log("Connected: ", accounts[0]);
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
    // console.log("Retrieved total wave count: ", count.toNumber());
    // loading On at wave button
    setWaveLoading(true);
    const waveTxn = await wavePortalContract.wave(msgValue, {
      gasLimit: 300000,
    });
    // console.log("Mining... ", waveTxn.hash);
    await waveTxn.wait();
    // console.log("WaveTxn -- ", waveTxn.hash);
    // loading off at wave button
    setWaveLoading(false);
    // emptying the text area
    setMsgValue("");
    count = await wavePortalContract.getTotalWaves();
    setCount(count.toNumber());
    // console.log("Retrieved total wave count: ", count.toNumber());
  };

  const getAllWaves = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    // calling getAllWaves in contract
    let waves = await wavePortalContract.getAllWaves();

    let wavesCleaned = [];
    waves.forEach((wave) => {
      wavesCleaned.push({
        address: wave[0],
        timestamp: new Date(wave[2] * 1000),
        message: wave[1],
      });
    });
    // console.log("Waves cleaned: ", waves);
    setAllWaves(wavesCleaned);

    wavePortalContract.on("NewWave", (from, timestamp, message) => {
      // console.log("NewWave: ", from, timestamp, message);
      setAllWaves((oldArray) => [
        ...oldArray,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
        },
      ]);
    });
  };

  const handleInputChange = (event) => {
    setMsgValue(event.target.value);
  };

  React.useEffect(() => {
    checkWalletConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Header
        connectWallet={connectWallet}
        setAlertBox={setAlertBox}
        address={currentAccount}
      />
      <Flex
        justify="center"
        align="center"
        direction="column"
        w="full"
        bgImg={bgGrade}
        bgRepeat="no-repeat"
        minH="92vh"
      >
        <Flex
          justify="center"
          align="center"
          direction="column"
          p={8}
          m="45px 15px"
          maxW="600"
          rounded="xl"
        >
          <Text fontSize="4xl" textAlign="center" fontWeight="bold">
            <span role="img" aria-label="wave">
              👋
            </span>{" "}
            Hello, I'm a decentralized bot
          </Text>
          <Text fontSize="md" mt={4} textAlign="center">
            I'm Sarthak, currently exploring Blockchain Rabbit-hole.
          </Text>
          <Text fontSize="md" textAlign="center">
            Connect your Ethereum wallet via Metamask (Use Rinkeby Network) and
            wave at me!
          </Text>
          <Text fontSize="md" mb={4} textAlign="center">
            PS: Get a chance to win some ETH 😉
          </Text>

          {currentAccount && (
            <TextInputArea
              value={msgValue}
              handleInputChange={handleInputChange}
              colorMode={useColorModeValue}
            />
          )}

          <Button
            onClick={currentAccount ? wave : () => setAlertBox(true)}
            colorScheme="yellow"
            isLoading={waveLoading}
            loadingText="waving..."
          >
            Wave at Me
          </Button>

          {alertBox && <AlertBox setAlert={setAlertBox} />}
        </Flex>

        {count && (
          <Box mt={6}>
            <Text fontSize="3xl">Total Waves: {count}</Text>
          </Box>
        )}

        <WaveDisplay allWaves={allWaves} colorMode={useColorModeValue} />
      </Flex>
      <Footer />
    </Box>
  );
};

// AlertBox Component
const AlertBox = (props) => (
  <Box mt={3} w="sm">
    <Alert
      status="error"
      rounded="lg"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <AlertIcon />
      <Box flex="1">
        <AlertTitle mr={2}>Wallet not connected!</AlertTitle>
        <AlertDescription>Please connect your wallet first.</AlertDescription>
      </Box>

      <CloseButton
        onClick={() => props.setAlert(false)}
        position="absolute"
        right="4px"
        top="8px"
      />
    </Alert>
  </Box>
);

const WaveDisplay = (props) => {
  return (
    <VStack
      divider={<StackDivider borderColor={useColorModeValue("gray.200", "gray.700")} />}
      spacing="2"
      align="center"
    >
      {props.allWaves.map((wave, index) => (
        <Box p={2} m={2} w="75%" key={index}>
          <Box
            bgColor={props.colorMode("green.100", "#60846A")}
            p={4}
            key={index}
            rounded="lg"
            boxShadow="0 5px 9px -1px rgba(0,0,0,0.21)"
            border="1px"
            borderColor={props.colorMode("#DAF6E2", "#8AAF94")}
          >
            <Text>
              <b>Address:</b> {wave.address}
            </Text>
            <Text>
              <b>Time:</b> {wave.timestamp.toString()}
            </Text>
            <Text>
              <b>Message:</b> {wave.message}
            </Text>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

const TextInputArea = (props) => (
  <Box m={4} w="80%">
    <Textarea
      value={props.value}
      onChange={props.handleInputChange}
      placeholder="Your message..."
      size="lg"
      border="1px"
      borderColor="#808A91"
      rounded="md"
      outline="none"
      bgColor={ props.colorMode("white", "#1A202C") }
      resize="none"
    />
  </Box>
);

export default Homepage;
