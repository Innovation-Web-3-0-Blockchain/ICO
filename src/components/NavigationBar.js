import Navbar from 'react-bootstrap/Navbar';
import logo from '../logo.png';

const NavigationBar = () => {
  return(
      <Navbar>
        <img 
          alt="logo" 
          src={logo} 
          width="80" 
          height="80"
          className="d-inline-block alihn-top mx-3"
        />
        <Navbar.Brand href="#">CADEX ICO Crowdsale</Navbar.Brand>
      </Navbar>
  );
}

export default NavigationBar;

