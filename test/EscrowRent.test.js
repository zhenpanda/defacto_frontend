const { expect } = require("chai");
let nullAddress = '0x0000000000000000000000000000000000000000'

describe("EscrowRent", function() {
  it("Should allow an owner to list an NFT for rent", async function() {
    const [owner, addr1] = await ethers.getSigners();
    const MockNFT = await ethers.getContractFactory("MockNFT");
    const mockNFT = await MockNFT.deploy();
    
    await mockNFT.deployed();

    await mockNFT.mint(owner.address, 0)
    expect(await mockNFT.balanceOf(owner.address)).to.equal(1);

    const EscrowRent = await ethers.getContractFactory("EscrowRent");
    const escrowRent = await EscrowRent.deploy();
    
    await escrowRent.deployed();

    await mockNFT.approve(escrowRent.address, 0)
    await escrowRent.listForRent(mockNFT.address, 0, '1000000000000000000', 60 * 60 * 24, 10000000000);

    expect(await mockNFT.balanceOf(owner.address)).to.equal(0);
    expect(await mockNFT.balanceOf(escrowRent.address)).to.equal(1);
    let info = await escrowRent.rents(mockNFT.address, 0)
    expect(info.dejure).to.equal(owner.address)
    expect(info.defacto).to.equal(nullAddress)
    expect(info.payDue).to.equal('1000000000000000000')
    expect(info.payPeriod).to.equal(60*60*24)
    expect(info.deadline).to.equal(10000000000)

    let dejure = await escrowRent.dejures(owner.address, 0);
    expect(dejure.token).to.equal(mockNFT.address)
    expect(dejure.id).to.equal(0)
  });
  it("Should allow a user to rent and return a listed NFT", async function() {
    const [owner, addr1] = await ethers.getSigners();
    const MockNFT = await ethers.getContractFactory("MockNFT");
    const mockNFT = await MockNFT.deploy();
    
    await mockNFT.deployed();

    await mockNFT.mint(owner.address, 0)
    expect(await mockNFT.balanceOf(owner.address)).to.equal(1);

    const EscrowRent = await ethers.getContractFactory("EscrowRent");
    const escrowRent = await EscrowRent.deploy();
    
    await escrowRent.deployed();

    await mockNFT.approve(escrowRent.address, 0)
    await escrowRent.listForRent(mockNFT.address, 0, '1000000000000000000', 60 * 60 * 24, 10000000000);

    await escrowRent.connect(addr1).rent(mockNFT.address, 0, { value: '1000000000000000000'});
    let info = await escrowRent.rents(mockNFT.address, 0);
    expect(info.defacto).to.equal(addr1.address);

    let defacto = await escrowRent.defactos(addr1.address, 0);
    expect(defacto.token).to.equal(mockNFT.address)
    expect(defacto.id).to.equal(0)

    await escrowRent.connect(addr1).returnRent(mockNFT.address, 0);
    info = await escrowRent.rents(mockNFT.address, 0)
    expect(info.dejure).to.equal(owner.address)
    expect(info.defacto).to.equal(nullAddress)
    defacto = await escrowRent.defactos(addr1.address, 0);
    expect(defacto.token).to.equal(nullAddress)
    expect(defacto.id).to.equal(0)
  });
});
