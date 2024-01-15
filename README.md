# ICO

Welcome to the `ICO` repository. This project represents an Initial Coin Offering (ICO) of a token using the Ethereum blockchain.

## Table of Contents
- [Verification and Security](#verification-and-security)
- [Commented Code](#commented-code)
- [Getting Started](#getting-started)
- [Smart Contracts](#smart-contracts)
- [Testing](#testing)
- [Scripts](#scripts)
- [Deploying Contracts](#deploying-contracts)
- [Front End](#front-end)
- [Further Insights](#further-insights)
- [Legal Compliance](#legal-compliance)
- [Project Updates](#project-updates)
- [Contribution](#contribution)
- [License](#license)
- [Donations](#donations)

## Verification and Security

Each modification to this project undergoes a meticulous verification process and subsequent signing. This stringent approach guarantees the authenticity and integrity of our codebase. In case you encounter any modifications that lack appropriate verification, we strongly advise against cloning or utilizing them, as they might harbor malicious code.

## Commented Code

**Please take note:** Our codebase is meticulously documented with comprehensive comments, aimed at providing a clear understanding of the functionality of individual components.

## Getting Started

To initiate the decentralized exchange interface, kindly adhere to the subsequent steps:

1. Clone this repository onto your local workstation.

   ```bash
   git clone https://github.com/Innovation-Web-3-0-Blockchain/ICO.git
   ```

2. Ensure you have `node.js` and `npm` installed in your environment.

3. Proceed to install the requisite dependencies by executing the following command:

   ```bash
   npm install
   ```

A listing of project dependencies can be found within the [Package.json](./package.json) file.

## Smart Contracts

This project includesc two smart contracts:

1. **Initial Coin Offering Contract:** Allow participants to contribute funds and receive tokens in return. It defines the rules and mechanisms of the fundraising event.

2. **Token Contract:** Represent the ICO token and defines his functionalities. 

You can view them in the [Contracts](./contracts) repository.

## Testing

To initiate tests for the entire project, execute the ensuing command:

```bash
npx hardhat test
```

## Scripts

This project is using only one script:

`1_deploy.js`: Used for the deployment of the smart contracts.

You can view the script in the [Scripts](./scripts) repository.

## Deploying Contracts

1. Launch the Hardhat blockchain on your local machine by using the following command:

   ```bash
   npx hardhat node
   ```

2. Deploy the contracts on your local blockchain by running the `1_deploy.js` script:

   ```bash
   npx hardhat run --network localhost scripts/1_deploy.js
   ```

**Note:** If you have cloned this repository, you will be using the same contract addresses that the two contracts have been deployed to. If you would like to deploy the contracts to different addresses, please see the next section; otherwise, follow the next one.

## Configuration

If you want to deploy the contracts to different addresses, you will need to go to the [Configuration](./src/config.json) file and remove the token addresses that are in between the quotation marks. After it is done, you can paste the new addresses where the old ones were.

## Front End

**Note:** Make sure that your Hardhat blockchain is still running in your local console before doing this command. Please see step 1 in the Deploying Contracts section.

Commence the operation of the development server through the command:

```bash
npm run start
```

Upon successful execution, the application will be accessible via your browser 

## Deploying Website 

Should you want to deploy your ICO to a website you can use [Fleek](https://fleek.co/) with your Github directly.

## Further Insights

For a better comprehension of React, Fleek, and Ether.js, we direct your attention to the subsequent resources:

### React

- [React Documentation](https://reactjs.org/)
- [React Bootstrap Documentation](https://react-bootstrap.github.io/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)

### Fleek

- [Fleek's Documentation](https://docs.fleek.co/)

### Ether.js

- [Ether.js Documentation](https://docs.ethers.org/v6/getting-started/)

## Legal Compliance

Please make sure that creating and investing in a crowdfunding sale is legal in your jurisdiction. Here's a quick [List](https://docs.google.com/document/d/1ajK7-eT-FTqGGoccjkixpGEcTas3nezz9p5gc0N6dgE/edit) from Dao Maker's website of countries that **DO** accept ICOs.

## Project Updates

As a dynamic project operating in the ever-evolving ecosystem of blockchain technology and the cryptospace, we will regularly assess updates to ensure our project aligns with the latest developments and adheres to best practices.

## Contribution

Community contributions are enthusiastically welcomed. Should you identify bugs, possess feature requests, or harbor intentions of enhancing the project, we extend an invitation to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Donations

### Our Values

We do not use any form of social media or engage in marketing activities. Our principles are rooted in open source and privacy, and we do not receive compensation for our contributions to GitHub. Furthermore, we do not endorse or have affiliations with any other projects.

### Supporting Us

While we remain committed to providing valuable resources for aspiring blockchain developers, any donations are greatly appreciated. Your support will help us offset the time and effort we invest in these projects to facilitate access to accessible information.

### Donation Options

We welcome contributions in Bitcoin and Monero, and you can send contributions by scanning one of the addresses in the QR codes at the following link: [Donate to Innovation Web 3.0](https://innovationweb3.github.io/)

We extend our gratitude for exploring our project and thank you for your support.