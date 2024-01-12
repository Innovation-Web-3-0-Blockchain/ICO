// Define a functional component called Info, which takes an 'account' prop
const Info = ({ account }) => {
    return (
        <div className="my+3">
            {/* Display the account information */}
            <p>
                {/* Use strong tag for emphasis */}
                <strong>Account:</strong> {account}
            </p>
        </div>
    );
}

// Export the Info component as the default export of this module
export default Info;
