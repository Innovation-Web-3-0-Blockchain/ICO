import ProgressBar from 'react-bootstrap/ProgressBar';

// Define a functional component called Progress, which takes 'maxTokens' and 'tokensSold' props
const Progress = ({ maxTokens, tokensSold }) => {
    return (
        // Container div with a margin-top of 3 units
        <div className='my-3'>
            {/* Progress bar component with dynamic 'now' and 'label' properties */}
            <ProgressBar now={((tokensSold / maxTokens) * 100)} label={`${(tokensSold / maxTokens) * 100}%`} />
            
            {/* Paragraph displaying the number of tokens sold out of the maximum */}
            <p className='text-center my-3'>{tokensSold} / {maxTokens} Tokens sold</p>
        </div>
    );
}

// Export the Progress component as the default export of this module
export default Progress;
