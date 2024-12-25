// scripts/transactions.js
const { ethers } = require("hardhat");

async function transferShares(
  contractAddress,
  fromPrivateKey,
  toAddress,
  shares
) {
  // Initialize the provider and wallet
  const provider = new ethers.JsonRpcProvider(
    "https://eth-sepolia.alchemyapi.io/v2/YOUR_ALCHEMY_PROJECT_ID"
  );
  const wallet = new ethers.Wallet(fromPrivateKey, provider);

  // Create the contract instance using the contract's ABI and address
  const propertyContract = new ethers.Contract(
    contractAddress,
    [
      "function transferShares(address to, uint256 shares) public",
      "function getBalance(address account) public view returns (uint256)",
    ],
    wallet
  );

  // Check the sender's balance
  const senderBalance = await propertyContract.getBalance(wallet.address);
  console.log("Sender's balance:", senderBalance.toString());

  if (senderBalance < shares) {
    throw new Error("Not enough shares to transfer");
  }

  // Execute the transferShares function
  const tx = await propertyContract.transferShares(toAddress, shares);
  console.log("Transaction sent:", tx.hash);

  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  console.log("Transaction mined in block:", receipt.blockNumber);

  return receipt;
}

module.exports = { transferShares };
