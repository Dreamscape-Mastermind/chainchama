

# 🏗🔴 ChainChama

# ChamaChain

ChamaChain is a web3 service that provides access to short-term loans for small communities based on various cultural approaches to saving, such as merry-go-rounds and SACCOs. We offer these financial services at lower rates and via more accessible tools, leveraging blockchain technology to enhance transparency and security.

## Key Features

### Group Creation and Management
- **Create a Chama:** Any user can create a new savings group (Chama) by providing essential details like the group's name, description, contribution amount, timeline, and allowed tokens.
- **Manage Chama Settings:** The creator of the group automatically becomes an approved member and is responsible for managing the group's settings.

### Contributions
- **Make Contributions:** Members can contribute Ether or ERC20 tokens to the group within specified timelines.
- **Savings and Grants:** Contributions are split between savings and an amount allocated to a selected grantee, promoting a balanced savings and grant distribution within the group.

### Grantee Selection
- **Voting Mechanism:** The contract implements a voting mechanism where members with the highest voting power (based on contributions and duration of membership) are selected as grantees.
- **Fund Withdrawal:** The selected grantee is approved to withdraw their allocated funds for the current period.

### Withdrawal Mechanism
- **Grantee Withdrawal:** Approved grantees can withdraw their funds (Ether or tokens) allocated to them during the contribution period.
- **Contributor Withdrawal:** Contributors can withdraw their savings after the group is archived or when the group status allows.

### Group Archiving
- **Archive Groups:** The group creator can archive a group, marking it as inactive. Archived groups retain their records but do not accept new contributions.

### Security and Fairness
- **Fair Distribution:** The contract ensures fair distribution of funds using a transparent voting process and time-based membership duration for grantee eligibility.
- **Security Measures:** ReentrancyGuard and other security measures are integrated to protect against common smart contract vulnerabilities.

### Token Management
- **Manage Tokens:** The group creator can manage the list of allowed ERC20 tokens, adding or removing tokens as needed to facilitate contributions in various cryptocurrencies.

## Deployed Smart Contracts

ChamaChain's core service is implemented through the **ChamaGroupV5** smart contract, deployed on the Ethereum blockchain (Layer 2 solutions) to manage savings groups, commonly known as Chamas in some African communities or Stokvels in other regions.

- **Contract Name:** ChamaGroupV5
- **Network:** Ethereum - Optimism Sepolia, Base Sepolia
- **Contract Address OP Sepolia:** [ChainChamaV1 OP Sepolia](https://sepolia-optimism.etherscan.io/address/0x86a21436887050432159153e00d8ba8674ad6576)
- **Contract Address Base Sepolia:** [ChainChamaV1 Base Sepolia](https://sepolia.basescan.org/address/0x86A21436887050432159153E00d8bA8674aD6576#events)

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/ChamaChain.git
   cd ChamaChain



<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

## Tech Stack

Scaffold-OP is a fork of Scaffold-ETH2 with minimal differences, providing additional dApp examples, native support for Superchain testnets, and more low-level instructions. We highly recommend the Scaffold-ETH2 docs as the primary guideline.

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/ethereum-optimism/scaffold-op/blob/main/packages/nextjs/public/scaffold-op-landing.png)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-OP, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/ethereum-optimism/scaffold-op.git
cd scaffold-op

yarn install
```

#### Duplicate the ```.env.example``` and rename it to ```.env.local```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. In order to quickly bootstrap a local PostgreSQL database we can make use of Docker using variables. This one-liner should be sufficient:

```
yarn start:database
```

5. Last but not least we need to actually create our schema in our database. Run the following command:

```
yarn migrate:dev
```

6. On the same terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`



## Deploy Contracts to Superchain Testnet(s)

To deploy contracts to a remote testnet (e.g. Optimism Sepolia), follow the steps below:

1. Get Superchain Sepolia ETH from the [Superchain Faucet](https://app.optimism.io/faucet)

2. Inside the `packages/hardhat` directory, copy `.env.example` to `.env`.

   ```bash
   cd packages/hardhat && cp .env.example .env
   ```

3. Edit your `.env` to specify the environment variables. Only specifying the `DEPLOYER_PRIVATE_KEY` is necessary here. The contract will be deployed from the address associated with this private key, so make sure it has enough Sepolia ETH.

   ```bash
   DEPLOYER_PRIVATE_KEY = "your_private_key_with_sepolia_ETH";
   ```

4. Inside `scaffold-op`, run

   ```bash
   yarn deploy --network-options
   ```

   Use spacebar to make your selection(s). This command deploys all smart contracts in `packages/hardhat/contracts` to the selected network(s). Alternatively, you can try

   ```bash
   yarn deploy --network networkName
   ```

   Network names are found in `hardhat.config.js`. Please ensure you have enough Sepolia ETH on all these Superchains. If the deployments are successful, you will see the deployment tx hash on the terminal.

## Adding Foundry

Hardhat's NodeJS stack and cleaner deployment management makes it a better default for Scaffold-OP.

To add Foundry to Scaffold-OP, follow this simple [tutorial](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-and-foundry) by Hardhat. We recommend users who want more robust and faster testing to add Foundry.

## Documentation

We highly recommend visiting the original [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out their [website](https://scaffoldeth.io).
