// Import the useState hook from React to manage state in functional components
import { useState } from 'react';

// Import various Bootstrap components for building the UI
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

// Import the ethers library to interact with Ethereum smart contracts
import { ethers } from 'ethers';

// Buy component responsible for handling token purchase functionality
const Buy = ({ provider, price, ico, setIsLoading }) => {
  // State to manage the entered amount and loading status
  const [amount, setAmount] = useState('0');
  const [isWaiting, setIsWaiting] = useState(false);

  // Handler for the buy button click
  const buyHandler = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsWaiting(true); // Set loading state to true

    try {
      const signer = await provider.getSigner(); // Get the signer from the Ethereum provider

      // Calculate the required ETH for the token purchase
      const value = ethers.utils.parseUnits((amount * price).toString(), 'ether');
      const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether');

      // Call the buyTokens function on the ICO contract
      const transaction = await ico.connect(signer).buyTokens(formattedAmount, { value: value });
      await transaction.wait(); // Wait for the transaction to be validated
    } catch {
      window.alert('User rejected or transaction reverted'); // Handle errors, such as user rejection or transaction failure
    }

    setIsLoading(true); // Set the main loading state to true
  };

  return (
    // Form for entering the amount and buying tokens
    <Form onSubmit={buyHandler} style={{ maxWidth: '800px', margin: '50px auto' }}>
      <Form.Group as={Row}>
        {/* Input for entering the amount of tokens to buy */}
        <Col>
          <Form.Control type="number" placeholder="Enter amount" onChange={(e) => setAmount(e.target.value)} />
        </Col>
        {/* Button for buying tokens, displays a spinner if waiting for the transaction */}
        <Col className='text-center'>
          {isWaiting ? (
            <Spinner animation="border" />
          ) : (
            <Button variant="primary" type="submit" style={{ width: '100%' }}>
              Buy Tokens
            </Button>
          )}
        </Col>
      </Form.Group>
    </Form>
  );
};

export default Buy;
