const { expect } = require("chai");

describe("MockNFT", function() {
  it("Should mint an NFT", async function() {
    const [owner, addr1] = await ethers.getSigners();
    const MockNFT = await ethers.getContractFactory("MockNFT");
    const mockNFT = await MockNFT.deploy();
    
    await mockNFT.deployed();

    await mockNFT.mint(owner.address, 0)
    expect(await mockNFT.balanceOf(owner.address)).to.equal(1);
  });
});
