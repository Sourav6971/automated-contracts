const express = require("express");
const router = express.Router();
const { deployContract } = require("../../scripts/deploy");
const { run } = require("hardhat"); // To ensure Hardhat runtime is available
const { transferShares } = require("../../scripts/transaction");

router.post("/", async (req, res) => {
  try {
    const { propertyName, totalShares } = req.body;

    // Validate input
    if (!propertyName || !totalShares) {
      return res
        .status(400)
        .json({ error: "Property name and total shares are required" });
    }

    // Ensure Hardhat runtime is initialized
    await run("compile");

    // Deploy the contract
    const deploymentDetails = await deployContract(propertyName, totalShares);

    // Return success response
    res.status(200).json({
      message: "Contract deployed successfully",
      address: deploymentDetails.address,
      txHash: deploymentDetails.txHash,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to deploy contract", details: error.message });
  }
});
router.post("/transfer", async (req, res) => {
  try {
    const { contractAddress, fromPrivateKey, toAddress, shares } = req.body;

    // Ensure all fields are provided
    if (!contractAddress || !fromPrivateKey || !toAddress || !shares) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Convert shares to number (make sure it's a valid number)
    const numShares = Number(shares);
    if (isNaN(numShares) || numShares <= 0) {
      return res.status(400).json({ error: "Invalid number of shares" });
    }

    // Perform the transfer
    const receipt = await transferShares(
      contractAddress,
      fromPrivateKey,
      toAddress,
      numShares
    );
    res.json({
      message: "Shares transferred successfully",
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    res
      .status(500)
      .json({ error: "Failed to transfer shares", details: error.message });
  }
});

module.exports = router;

module.exports = router;
