// Define a functional component called Info, which takes an 'account' and 'accountBalance' prop
const Info = ({ account, accountBalance }) => {
    return (
        // Container div with a margin-top of 3 units
        <div className="my+3">
            {/* Display the account information */}
            <p>
                {/* Use strong tag for emphasis */}
                <strong>Account:</strong> {account}
            </p>
            {/* Display the token ownership information */}
            <p>
                {/* Use strong tag for emphasis */}
                <strong>Token Owned:</strong> {accountBalance}
            </p>
        </div>
    );
}

// Export the Info component as the default export of this module
export default Info;
