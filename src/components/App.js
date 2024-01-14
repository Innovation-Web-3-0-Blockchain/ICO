// Import necessary libraries and components from React, React Bootstrap, and ethers
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers';

// Import custom components
import NavigationBar from './NavigationBar';
import Info from './Info';
import Progress from './Progress';
import Loading from './Loading';
import Buy from './Buy';

// Import contract ABIs and configuration
import TOKEN_ABI from '../abis/Token.json';
import ICO_ABI from '../abis/Ico.json';
import config from '../config.json';

// Define the main App component
function App() {
  // State variables for managing blockchain data
  const [provider, setProvider] = useState(null);
  const [ico, setIco] = useState(null); 

  const [account, setAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);

  const [price, setPrice] = useState(0); 
  const [maxTokens, setMaxTokens] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  // Function to load blockchain data
  const loadBlockchainData = async () => {
    // Create a Web3Provider using the Metamask provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    // Get the current network's chain ID
    const { chainId } = await provider.getNetwork()

    // Create instances of the Token and ICO contracts using their addresses and ABIs
    const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)
    const ico = new ethers.Contract(config[chainId].ico.address, ICO_ABI, provider)
    setIco(ico)

    // Request user accounts from Metamask and format the first account address
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);

    // Fetch and format the account balance 
    const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
    setAccountBalance(accountBalance)

    // Fetch and format the ICO price
    const price = ethers.utils.formatUnits(await ico.price(), 18)
    setPrice(price)

    // Fetch and format the maximum tokens
    const maxTokens = ethers.utils.formatUnits(await ico.maxTokens(), 18)
    setMaxTokens(maxTokens)

    // Fetch and format the tokens sold
    const tokensSold = ethers.utils.formatUnits(await ico.tokensSold(), 18)
    setTokensSold(tokensSold)

    // Update isLoading state to signal the end of data loading
    setIsLoading(false)
  };

  // UseEffect hook to call loadBlockchainData when the component mounts or when isLoading changes
  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]); 

  // Render the main UI
  return (
    <div>
      {/* Black bar at the top with specified width and height */}
      <div style={{ background: 'black', height: '150px', width: '100%' }}></div>

      <Container>
        <NavigationBar />

        <h1 className='my-4 text-center'>Introducing CADEX Token!</h1>

        {/* Conditional rendering based on loading state */}
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {/* Display current ICO price, Buy component, and Progress component */}
            <p className='text-center'><strong>Current Price:</strong> {price} ETH</p>
            <Buy provider={provider} price={price} ico={ico} setIsLoading={setIsLoading} />
            <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
          </>
        )}

        <hr />

        {/* Display user account information if available */}
        {account && (
          <Info account={account} accountBalance={accountBalance} />
        )}
      </Container>
    </div>
  );
}

// Export the App component as the default export of this module
export default App;
