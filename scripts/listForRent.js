const ethers = require("ethers");
const EscrowRentAbi = require("../data/abi/EscrowRent.json");
const MockNFTAbi = require("../data/abi/MockNFT.json");

const provider = new ethers.providers.InfuraProvider(
  "kovan",
  process.env.INFURA_KEY
);

const signer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC).connect(
  provider
);

async function main() {
  let EscrowRent = new ethers.Contract("0x84A00ffC1d8b97a8bc7db1c46327db9ac6EF3fC3", EscrowRentAbi, signer);
  let MockNFT = new ethers.Contract("0x60899f518FBC45fc30C71eff36FE8ee7cCE98e1D", MockNFTAbi, signer);

  let approve = await MockNFT.approve("0x84A00ffC1d8b97a8bc7db1c46327db9ac6EF3fC3", 0)
  console.log(approve);

  // list NFT for 1 ETH per Day for 7 days
  let listForRent = await EscrowRent.listForRent("0x60899f518FBC45fc30C71eff36FE8ee7cCE98e1D", 0, "1000000000000000000", 60*60*24, 60*60*24*7);
  console.log(listForRent);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
