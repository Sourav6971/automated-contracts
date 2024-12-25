const express = require("express");
const router = express.Router();
const { deployContract } = require("../../scripts/deploy");
const { run } = require("hardhat"); // To ensure Hardhat runtime is available

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

module.exports = router;
