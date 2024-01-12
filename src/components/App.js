import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers';

import NavigationBar from './NavigationBar';
import Info from './Info'; 

function App() {
  const [account, setAccount] = useState(null);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    console.log(accounts);
    setAccount(account);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []); 

  return (
    <Container>
      <NavigationBar />
      <hr />
      {account && (
        <Info account={account} />
      )}
    </Container>
  );
}

export default App;
