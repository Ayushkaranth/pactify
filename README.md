# Pactify: The Verifiable Reputation Protocol

**Beyond Promises. Verifiable Proof.**

Pactify is a full-stack, decentralized application designed to be the ultimate accountability engine for students, freelancers, and professionals. It transforms personal goals and professional agreements into tangible, on-chain commitments, creating a verifiable history of reliability that we call a "Proof-of-Work Journal."

**Live Demo:** [pactify-five.vercel.app](https://pactify-five.vercel.app)

---

## The Problem: Trust is Hard to Prove

In the modern digital economy, a resume is just a list of claims. It's difficult for a new freelancer to prove their reliability, and it's risky for a client to trust an unproven talent. Pactify solves this by creating a **trustless ecosystem** where reputation is not claimed, but verifiably earned.

## Key Features

This application is a complete ecosystem that takes a user from building personal discipline to earning real money in a decentralized marketplace.

### 1. The Proof-of-Work Journal
The foundation of a user's reputation. This module allows users to:
* **Create personal development goals** (e.g., "Learn Advanced Solidity").
* Optionally **stake crypto** on these goals, creating a permanent, on-chain timestamp of their commitment.
* Build a private, verifiable history of their discipline and work ethic.

### 2. The Pacts Module (Decentralized Freelance Gigs)
The core of the application, powered by a custom Solidity smart contract.
* **Peer-to-Peer Agreements:** Clients and freelancers can propose and accept pacts for specific tasks.
* **Smart Contract Escrow:** When a pact is created, the client's payment is locked in our `Pacts.sol` smart contract, guaranteeing payment upon successful completion.
* **Judge-less Resolution:** The contract features a "three-strike" revision system, allowing for a fair and decentralized arbitration process without a central authority.
* **On-Chain Proof:** Every successful pact is a permanent, peer-reviewed achievement on the Sepolia testnet.

### 3. The Talent Network & Reputation Hub
The marketplace and showcase that brings the ecosystem together.
* **Discover Proven Talent:** Clients can browse a network of freelancers, sorted by their **Reliability Score**—a unique metric calculated from their on-chain history.
* **The Living Resume:** Every user has a public, shareable "Reputation Hub" (`pactify.app/profile/[userId]`). This page is a chronological timeline of their completed Journal entries and Pacts, with direct links to the Etherscan transactions for undeniable proof.
* **Seamless Proposal Flow:** From a freelancer's public profile, a client can directly propose a new pact, creating a frictionless hiring experience.

---

## Technical Architecture & Tech Stack

Pactify is a modern, full-stack monorepo application demonstrating a wide range of professional engineering practices.

### **Frontend**
* **Framework:** **Next.js 14+** (App Router)
* **Language:** **TypeScript**
* **UI:** Built with **shadcn/ui**, styled with **Tailwind CSS**.
* **Animation:** Complex, engaging animations powered by **Framer Motion**.
* **State Management:** React Hooks (`useState`, `useEffect`, `useTransition`).

### **Backend**
* **Runtime:** **Node.js**
* **API Layer:** Secure, robust server-side logic using **Next.js Server Actions**.
* **Authentication:** **Clerk** for professional-grade user management, social logins, and linking Web2 identities to Web3 wallets.

### **Database**
* **Database:** **MongoDB** (managed via MongoDB Atlas).
* **ODM:** **Mongoose** for schema definition and data modeling.

### **Web3 Layer**
* **Smart Contracts:** Custom **Solidity** contracts (`Pacts.sol`) written and deployed to the **Sepolia testnet** using **Remix IDE**.
* **Frontend Interaction:** Robust wallet connection, network switching, and smart contract interaction using **`wagmi`** and **`viem`**.

### **DevOps**
* **Containerization:** The entire application stack (Next.js app + MongoDB) is containerized using **Docker** and orchestrated with **Docker Compose** for consistent, reproducible local development.
* **CI/CD Pipeline:** A complete Continuous Integration and Deployment pipeline built with **GitHub Actions**.
    * **Automated Quality Gates:** On every pull request, the pipeline automatically runs **linting** (`ESLint`), **build checks** (`npm run build`), and **end-to-end tests**.
    * **End-to-End Testing:** A full test suite built with **Playwright** simulates real user flows, ensuring that core features like landing page navigation and user sign-in are not broken.

---

## Getting Started Locally

### **Prerequisites**
* Node.js v18+
* Docker Desktop
* A package manager (npm, yarn, or pnpm)

### **Setup**
1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd pactify-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    * Create a new file in the root of the project named `.env`.
    * Copy the contents of `.env.example` (see below) into your new `.env` file and fill in your secret keys from Clerk, MongoDB Atlas, and your Web3 wallet.

    **.env.example**
    ```
    # Clerk Keys
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

    # MongoDB Connection String (for local dev, use the Docker URI)
    MONGODB_URI=mongodb://mongo:27017/pactify

    # Web3 Configuration
    NEXT_PUBLIC_PACTS_CONTRACT_ADDRESS=
    ```

4.  **Run the application with Docker:**
    * Make sure Docker Desktop is running.
    * Run the following command to build and start all services in the background:
    ```bash
    docker-compose up -d
    ```
    Your application will be available at `http://localhost:3000`.

### **Running Tests**
To run the automated end-to-end tests locally, use the following command:
```bash
npx playwright test