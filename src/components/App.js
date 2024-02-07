import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Container } from 'react-bootstrap';
import ICO_ABI from '../abis/Ico.json';
import TOKEN_ABI from '../abis/Token.json';
import NavigationBar from './NavigationBar';
import Info from './Info';
import Progress from './Progress';
import Loading from './Loading';
import Buy from './Buy';
import Status from './Status';
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [ico, setIco] = useState(null);
  const [account, setAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [whitelistSalePrice, setWhitelistSalePrice] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [whitelistSaleStartTime, setWhitelistSaleStartTime] = useState(0);
  const [whitelistSaleEndTime, setWhitelistSaleEndTime] = useState(0);

  const loadBlockchainData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const { chainId } = await provider.getNetwork();

      const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider);
      const ico = new ethers.Contract(config[chainId].ico.address, ICO_ABI, provider);
      setIco(ico);

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);

      const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18);
      setAccountBalance(accountBalance);

      const whitelistSalePrice = ethers.utils.formatUnits(await ico.whitelistSalePrice(), 18);
      setWhitelistSalePrice(whitelistSalePrice);

      const maxTokens = ethers.utils.formatUnits(await ico.maxTokens(), 18);
      setMaxTokens(maxTokens);

      const tokensSold = ethers.utils.formatUnits(await ico.tokensSold(), 18);
      setTokensSold(tokensSold);

      const [whitelistSaleStartTime, whitelistSaleEndTime] = await ico.getWhitelistSaleDates();
      setWhitelistSaleStartTime(whitelistSaleStartTime);
      setWhitelistSaleEndTime(whitelistSaleEndTime);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading blockchain data:', error);
      setIsLoading(false);
    }
  };

  const handleAccountsChanged = (newAccounts) => {
    const newAccount = ethers.utils.getAddress(newAccounts[0]);
    setAccount(newAccount);
    setIsLoading(true);
  };

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  useEffect(() => {
    const accountsChangedHandler = (accounts) => handleAccountsChanged(accounts);
    window.ethereum.on('accountsChanged', accountsChangedHandler);

    return () => {
      window.ethereum.removeListener('accountsChanged', accountsChangedHandler);
    };
  }, []);

  return (
    <div style={{ background: '#eef5f9', minHeight: '100vh', padding: '20px' }}>
      <div style={{ background: '#3498db', height: '150px', width: '100%' }}></div>

      <Container
        style={{
          marginTop: '80px',
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <NavigationBar />
          </div>
          <div style={{ marginLeft: 'auto', marginRight: '45px' }}>
            <Status isIcoOpen={Status} />
          </div>
        </div>

        <div className="text-center">
          <h1 className="my-4">Introducing CADEX Token!</h1>
        </div>

        {!isLoading && (
          <>
            <p className="text-center" style={{ fontSize: '18px', marginBottom: '20px' }}>
              <strong>Whitelist Sale Price:</strong> {whitelistSalePrice} ETH
            </p>
            <p className="text-center" style={{ fontSize: '18px', marginBottom: '20px' }}>
              <strong>Whitelist Sale Time Frame:</strong>{' '}
              {new Date(whitelistSaleStartTime * 1000).toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
              })}{' '}
              to{' '}
              {new Date(whitelistSaleEndTime * 1000).toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
              })}
            </p>
            <Buy provider={provider} price={whitelistSalePrice} ico={ico} setIsLoading={setIsLoading} />
            <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
          </>
        )}

        <hr />

        {account && <Info account={account} accountBalance={accountBalance} />}
      </Container>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#555' }}>
        © 2024 Canada Digital Assets Exchange. All rights reserved.
      </div>
    </div>
  );
}

export default App;
