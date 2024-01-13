// Import the Spinner component from the react-bootstrap library
import Spinner from 'react-bootstrap/Spinner';

// Define a functional component called Loading
const Loading = () => {
  return (
    // Container div with text-center alignment and margin on the top
    <div className='text-center my-5'>
      {/* Display a spinning animation */}
      <Spinner animation="grow" />

      {/* Display a loading message */}
      <p className='my-2'>Loading Data...</p>
    </div>
  );
}

// Export the Loading component as the default export of this module
export default Loading;
