# E-Voting Management System

A decentralized e-voting web application built with Next.js and blockchain technology. This system enables administrators to create and manage elections while authorized voters can cast their votes securely on the blockchain.

## 🌟 Features

### Admin Features

- **Dashboard**: View election statistics, recent elections, and system status
- **Election Management**: Create, view, and manage elections
- **Candidate Management**: Add candidates with name, NIC, and party affiliation
- **Voter Management**: Authorize voters by NIC number
- **Results Viewing**: View detailed election results with real-time updates
- **Election Details**: Comprehensive view of election data including candidates, voters, and results

### Voter Features

- **Secure Voting**: Cast votes using NIC-based authentication
- **Gasless Transactions**: Vote without paying gas fees (paymaster integration)
- **Election Access**: View elections you're authorized to participate in
- **Session Management**: Temporary wallet sessions for secure voting

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Blockchain**: Ethers.js, Polygon Amoy Testnet
- **Smart Contracts**: Solidity contracts deployed on Polygon Amoy
- **State Management**: React Hooks
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MetaMask or compatible Web3 wallet
- Polygon Amoy testnet configured in wallet
- Test MATIC tokens (get from [Polygon Faucet](https://faucet.polygon.technology/))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd e-voting-web
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following environment variables:

```bash
# Copy from .env.example
cp .env.example .env.local
```

See [Environment Variables](#environment-variables) section for details.

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

| Variable             | Description                                        | Required |
| -------------------- | -------------------------------------------------- | -------- |
| `WALLET_PRIVATE_KEY` | Admin wallet private key for contract interactions | Yes      |
| `RPC_URL`            | Polygon Amoy RPC endpoint                          | Yes      |
| `ELECTION_ADDRESS`   | Election smart contract address                    | Yes      |
| `SESSION_ADDRESS`    | NICWalletRegistry contract address                 | Yes      |
| `PAYMASTER_ADDRESS`  | Paymaster contract address (for gasless voting)    | Yes      |

See `.env.example` for the template.

## 📦 Smart Contracts

### Deployed Contracts (Polygon Amoy Testnet)

All contracts are deployed on Polygon Amoy Testnet:

- **Election Contract**: `0xa85F3942AB544ece211Dc73819f36940013Fdc02`

  - Deployed at: [https://amoy.polygonscan.com/address/0xa85F3942AB544ece211Dc73819f36940013Fdc02](https://amoy.polygonscan.com/address/0xa85F3942AB544ece211Dc73819f36940013Fdc02)
  - Network: Polygon Amoy Testnet
  - Purpose: Manages elections, candidates, voters, and voting

- **NICWalletRegistry Contract (Session Contract)**: `0x24D2Caf2fd29D503e72AdD19a5c56C2452d2e5C1`

  - Deployed at: [https://amoy.polygonscan.com/address/0x24D2Caf2fd29D503e72AdD19a5c56C2452d2e5C1](https://amoy.polygonscan.com/address/0x24D2Caf2fd29D503e72AdD19a5c56C2452d2e5C1)
  - Network: Polygon Amoy Testnet
  - Purpose: Maps NIC numbers to wallet addresses and manages voting sessions

- **Paymaster Contract**: `0xE2D89a2f526e828579Da11AdeE60dDb645303440`
  - Deployed at: [https://amoy.polygonscan.com/address/0xE2D89a2f526e828579Da11AdeE60dDb645303440](https://amoy.polygonscan.com/address/0xE2D89a2f526e828579Da11AdeE60dDb645303440)
  - Network: Polygon Amoy Testnet
  - Purpose: Enables gasless voting transactions

### Smart Contract Code

The smart contract source code is available at:

- **Repository**: [zksync-101](https://github.com/Rdilshan/zksync-101)
- Contains Election contract, NICWalletRegistry, and Paymaster contracts

### Contract Functions

**Election Contract**:

- `createElection()` - Create a new election
- `vote()` - Cast a vote
- `getElectionData()` - Get election details
- `getAllElectionList()` - Get all elections
- `checkResult()` - Get election results

**NICWalletRegistry Contract**:

- `registerWallet()` - Register NIC with wallet address
- `getWalletByNIC()` - Get wallet address by NIC
- `createSession()` - Create temporary voting session

## 📁 Project Structure

```
e-voting-web/
├── app/
│   ├── admin/                    # Admin pages
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── elections/           # Election management
│   │   │   └── [id]/           # Election details
│   │   ├── results/             # Election results
│   │   ├── create-election/    # Create new election
│   │   └── login/               # Admin login
│   ├── vote/                    # Voter pages
│   ├── results/                 # Public results
│   ├── smartContract/           # Contract ABIs
│   │   ├── Election.json
│   │   ├── NICWalletRegistry.json
│   │   └── Paymaster.json
│   └── lib/                     # Utilities
│       ├── helper.ts           # Helper functions
│       └── interface.ts        # TypeScript interfaces
├── components/                  # React components
│   ├── layout/                 # Layout components
│   └── ui/                     # UI components
└── public/                     # Static assets
```

## 🎯 Usage

### Admin Workflow

1. **Login**: Access admin dashboard at `/admin/dashboard`
2. **Create Election**:
   - Go to "Create Election"
   - Enter election details (title, description, dates)
   - Add candidates (name, NIC, party)
   - Add authorized voters (NIC numbers)
   - Submit to create election on blockchain
3. **Manage Elections**: View and manage all elections
4. **View Results**: Check election results and statistics

### Voter Workflow

1. **Access Voting**: Go to `/vote`
2. **Login**: Enter your NIC number
3. **View Elections**: See elections you're authorized to vote in
4. **Cast Vote**: Select candidate and submit vote (gasless transaction)
5. **View Results**: Check election results

## 🔄 Election Creation Process

When creating an election, the system:

1. **Checks NIC Registration**: Verifies if voter and candidate NICs are registered
2. **Auto-Registers NICs**: Creates wallets for unregistered NICs automatically
3. **Registers on Blockchain**: Registers all NICs in NICWalletRegistry contract
4. **Creates Election**: Deploys election to blockchain with all data
5. **Returns Election ID**: Provides election ID for future reference

## 🌐 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

**Live Demo**: [https://e-voting-web-three.vercel.app](https://e-voting-web-three.vercel.app)

### Environment Variables for Production

Ensure all required environment variables are set in your deployment platform:

- `WALLET_PRIVATE_KEY`
- `RPC_URL`
- `ELECTION_ADDRESS`
- `SESSION_ADDRESS`
- `PAYMASTER_ADDRESS`

## 🔒 Security Notes

- **Never commit private keys** to version control
- Use environment variables for sensitive data
- In production, use secure key management (AWS Secrets Manager, HashiCorp Vault)
- Implement proper access controls
- Monitor contract interactions

## 📚 Key Features Explained

### Gasless Voting

The system uses a paymaster contract to enable gasless transactions. Voters don't need MATIC tokens to vote - the system covers gas fees.

### NIC-Based Authentication

Voters are identified by their National ID Card (NIC) number, which is mapped to wallet addresses in the NICWalletRegistry contract.

### Session Management

Temporary wallets are created for voting sessions, providing an additional layer of security.

### Real-time Results

Election results are fetched directly from the blockchain, ensuring transparency and immutability.

## 🐛 Troubleshooting

### Common Issues

1. **"Missing required environment variables"**

   - Ensure all environment variables are set in `.env.local`

2. **Transaction failures**

   - Check RPC URL is correct
   - Verify wallet has sufficient MATIC for gas
   - Ensure contract addresses are correct

3. **NIC not found**
   - NIC must be registered before voting
   - Admin can register NICs during election creation

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Polygon Amoy Documentation](https://docs.polygon.technology/docs/develop/network-details/network/)
- [Smart Contract Repository](https://github.com/Rdilshan/zksync-101)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Live Application**: [https://e-voting-web-three.vercel.app](https://e-voting-web-three.vercel.app)
- **Smart Contract**: [PolygonScan](https://amoy.polygonscan.com/address/0xa85F3942AB544ece211Dc73819f36940013Fdc02)
- **Contract Source**: [GitHub Repository](https://github.com/Rdilshan/zksync-101)
- **Polygon Amoy Explorer**: [PolygonScan Amoy](https://amoy.polygonscan.com/)

## 👥 Authors

Developed as part of SE8101 Research Project.

---

**Note**: This is a demonstration project. For production use, implement additional security measures and conduct thorough audits.
