// Import the Navbar component from the react-bootstrap library
import Navbar from 'react-bootstrap/Navbar';

// Import the logo image from the specified location
import logo from '../logo.png';

// Define a functional component called NavigationBar
const NavigationBar = () => {
  return (
    // Use the Navbar component from react-bootstrap
    <Navbar>
      {/* Display the logo image with specified attributes */}
      <img 
        alt="logo" 
        src={logo} 
        width="80" 
        height="80"
        className="d-inline-block alihn-top mx-3" // Apply Bootstrap classes for styling
      />

      {/* Display the brand name with a link (CADEX ICO Crowdsale) */}
      <Navbar.Brand href="#">CADex ICO Crowdsale</Navbar.Brand>
    </Navbar>
  );
}

// Export the NavigationBar component as the default export of this module
export default NavigationBar;
