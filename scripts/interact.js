const hre = require("hardhat");
const token = require("../artifacts/contracts/LimeToken.sol/LimeToken.json");
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const deployer = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const receiver = "0x465b2b6CC578268BA33f24A7e151D144b0E44D29";
const provider = new hre.ethers.providers.JsonRpcProvider(
  "http://localhost:8545"
);

const mintToken = async (contract, wallet) => {
  const mint = await contract.mint(wallet, "2000000000000000000");
  const mintReciept = await mint.wait();
  if (mintReciept.status != 1) {
    console.log("Transaction was unsuccessfull!");
    return;
  }
};

const transferToken = async (contract, wallet) => {
  const transfer = await contract.transfer(wallet, "1430000000000000000");
  const transferReciept = await transfer.wait();
  if (transferReciept.status != 1) {
    console.log("Transaction was unsuccessfull!");
    return;
  }
};

const burnToken = async (contract, balanceOfDeployer) => {
  const burn = await contract.burn(balanceOfDeployer);
  const burnReciept = await burn.wait();
  if (burnReciept.status != 1) {
    console.log("Transaction was unsuccessfull!");
    return;
  }
};

const run = async () => {
  const wallet = new hre.ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );
  const tokenContract = new hre.ethers.Contract(
    contractAddress,
    token.abi,
    wallet
  );
  await mintToken(tokenContract, deployer);

  const initialBalanceOfDeployer = await tokenContract.balanceOf(deployer);
  console.log(
    `Deployer balance ${hre.ethers.utils.formatEther(
      initialBalanceOfDeployer
    )} LMT`
  );

  await transferToken(tokenContract, receiver);

  const balanceOfDeployer = await tokenContract.balanceOf(deployer);
  const balanceOfReceiver = await tokenContract.balanceOf(receiver);
  console.log(
    `Deployers balance: ${hre.ethers.utils.formatEther(
      balanceOfDeployer
    )} LMT. Receiver balance: ${hre.ethers.utils.formatEther(
      balanceOfReceiver
    )} LMT`
  );

  await burnToken(tokenContract, balanceOfDeployer);

  const finalBalanceOfDeployer = await tokenContract.balanceOf(deployer);
  console.log(
    `Deployer balance ${hre.ethers.utils.formatEther(
      finalBalanceOfDeployer
    )} LMT`
  );
};

run();
