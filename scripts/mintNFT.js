const ethers = require("ethers");
const MockNFTAbi = require("../data/abi/MockNFT.json");

const provider = new ethers.providers.InfuraProvider(
  "kovan",
  process.env.INFURA_KEY
);

const signer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC).connect(
  provider
);

async function main() {
  let MockNFT = new ethers.Contract("0x60899f518FBC45fc30C71eff36FE8ee7cCE98e1D", MockNFTAbi, signer);

  await MockNFT.mint(signer.address, 0);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
