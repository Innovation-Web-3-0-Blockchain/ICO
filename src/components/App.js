import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers';

import NavigationBar from './NavigationBar';
import Info from './Info';
import Progress from './Progress';
import Loading from './Loading';
import Buy from './Buy';

import TOKEN_ABI from '../abis/Token.json';
import ICO_ABI from '../abis/Ico.json';

import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [ico, setIco] = useState(null); 
   
  const [account, setAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);

  const [price, setPrice] = useState(0); 
  const [maxTokens, setMaxTokens] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const { chainId } = await provider.getNetwork()

    const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)
    const ico = new ethers.Contract(config[chainId].ico.address, ICO_ABI, provider)
    setIco(ico)

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);

    const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18)
    setAccountBalance(accountBalance)

    const price = ethers.utils.formatUnits(await ico.price(), 18)
    setPrice(price)

    const maxTokens = ethers.utils.formatUnits(await ico.maxTokens(), 18)
    setMaxTokens(maxTokens)

    const tokensSold = ethers.utils.formatUnits(await ico.tokensSold(), 18)
    setTokensSold(tokensSold)

    setIsLoading(false)
  };

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]); 

  return (
    <Container>
      <NavigationBar />

      <h1 className='my-4 text-center'>Introducing CADEX Token!</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className='text-center'><strong>Current Price:</strong> {price} ETH</p>
          <Buy provider={provider} price={price} ico={ico} setIsLoading={setIsLoading} />
          <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
        </>
      )}

      <hr />

      {account && (
        <Info account={account} accountBalance={accountBalance} />
      )}
    </Container>
  );
}

export default App;
