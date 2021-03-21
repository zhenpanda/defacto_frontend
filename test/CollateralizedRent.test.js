const { expect } = require("chai");
let nullAddress = "0x0000000000000000000000000000000000000000";

async function increaseTime(time) {
  await network.provider.send("evm_increaseTime", [time]);
}

describe("CollateralizedRent", function () {
  let owner, addr1, mockNFT, collateralizedRent;
  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy();
    await mockNFT.deployed();

    await mockNFT.mint(owner.address, 0);
    expect(await mockNFT.balanceOf(owner.address)).to.equal(1);

    const CollateralizedRent = await ethers.getContractFactory(
      "CollateralizedRent"
    );
    collateralizedRent = await CollateralizedRent.deploy();
    await collateralizedRent.deployed();
    await mockNFT.approve(collateralizedRent.address, 0);
  });

  it("Should allow an owner to list an NFT for rent", async function () {
    await collateralizedRent.listForRent(
      mockNFT.address,
      0,
      "1000000000000000000",
      60 * 60 * 24,
      60 * 60 * 24,
      "1500000000000000000"
    );

    expect(await mockNFT.balanceOf(owner.address)).to.equal(0);
    expect(await mockNFT.balanceOf(collateralizedRent.address)).to.equal(1);
    let info = await collateralizedRent.rents(mockNFT.address, 0);
    expect(info.dejure).to.equal(owner.address);
    expect(info.defacto).to.equal(nullAddress);
    expect(info.payDue).to.equal("1000000000000000000");
    expect(info.payPeriod).to.equal(60 * 60 * 24);
    expect(info.time).to.equal(60 * 60 * 24);
    expect(info.collateralRequirement).to.equal("1500000000000000000");

    let dejure = await collateralizedRent.dejures(owner.address, 0);
    expect(dejure.token).to.equal(mockNFT.address);
    expect(dejure.id).to.equal(0);
  });
  it("Should allow a user to rent and return a listed NFT", async function () {
    await collateralizedRent.listForRent(
      mockNFT.address,
      0,
      "1000000000000000000",
      60 * 60 * 24,
      60 * 60 * 24,
      "1500000000000000000"
    );

    await collateralizedRent
      .connect(addr1)
      .rent(mockNFT.address, 0, { value: "2500000000000000000" });
    let info = await collateralizedRent.rents(mockNFT.address, 0);
    expect(info.defacto).to.equal(addr1.address);

    let newBalance = await ethers.provider.getBalance(
      collateralizedRent.address
    );
    expect(newBalance.toString()).to.equal("2500000000000000000");

    let defacto = await collateralizedRent.defactos(addr1.address, 0);
    expect(defacto.token).to.equal(mockNFT.address);
    expect(defacto.id).to.equal(0);

    await mockNFT.connect(addr1).approve(collateralizedRent.address, 0);
    await collateralizedRent.connect(addr1).returnRent(mockNFT.address, 0);
    info = await collateralizedRent.rents(mockNFT.address, 0);
    expect(info.dejure).to.equal(owner.address);
    expect(info.defacto).to.equal(nullAddress);
    defacto = await collateralizedRent.defactos(addr1.address, 0);
    expect(defacto.token).to.equal(nullAddress);
    expect(defacto.id).to.equal(0);

    newBalance = await ethers.provider.getBalance(collateralizedRent.address);
    expect(newBalance.toString()).to.equal("1000000000000000000");
  });
  it("allows an owner to liquidate collateral if deadline passes", async function () {
    await collateralizedRent.listForRent(
      mockNFT.address,
      0,
      "1000000000000000000",
      60 * 60 * 24,
      60 * 60 * 24,
      "1500000000000000000"
    );

    await collateralizedRent
      .connect(addr1)
      .rent(mockNFT.address, 0, { value: "2500000000000000000" });
    let info = await collateralizedRent.rents(mockNFT.address, 0);
    expect(info.defacto).to.equal(addr1.address);

    let defacto = await collateralizedRent.defactos(addr1.address, 0);
    expect(defacto.token).to.equal(mockNFT.address);
    expect(defacto.id).to.equal(0);

    await increaseTime(60 * 60 * 23);

    await collateralizedRent
      .connect(addr1)
      .payRent(mockNFT.address, 0, { value: "1000000000000000000" });

    await expect(collateralizedRent.liquidateCollateral(mockNFT.address, 0)).to
      .be.reverted;

    await increaseTime(60 * 60 * 2);

    await collateralizedRent.liquidateCollateral(mockNFT.address, 0);
    info = await collateralizedRent.rents(mockNFT.address, 0);
    expect(info.dejure).to.equal(nullAddress);
    expect(info.defacto).to.equal(nullAddress);
    defacto = await collateralizedRent.defactos(addr1.address, 0);
    expect(defacto.token).to.equal(nullAddress);
    expect(defacto.id).to.equal(0);

    newBalance = await ethers.provider.getBalance(collateralizedRent.address);
    expect(newBalance.toString()).to.equal("0");
  });
  it("allows an owner to slash collateral if rent is not paid", async function() {
    await collateralizedRent.listForRent(
        mockNFT.address,
        0,
        "1000000000000000000",
        60 * 60 * 24,
        60 * 60 * 72,
        "1500000000000000000"
      );

    await collateralizedRent.connect(addr1).rent(mockNFT.address, 0, { value: '2500000000000000000'});
    let info = await collateralizedRent.rents(mockNFT.address, 0);
    expect(info.defacto).to.equal(addr1.address);

    let defacto = await collateralizedRent.defactos(addr1.address, 0);
    expect(defacto.token).to.equal(mockNFT.address)
    expect(defacto.id).to.equal(0)

    await increaseTime(60*60*23)

    await expect(collateralizedRent.slashCollateral(mockNFT.address, 0)).to.be.reverted;

    await collateralizedRent.connect(addr1).payRent(mockNFT.address, 0, { value: '1000000000000000000' });

    await increaseTime(60*60*23)

    await expect(collateralizedRent.slashCollateral(mockNFT.address, 0)).to.be.reverted;

    await increaseTime(60*60*2)
    await collateralizedRent.slashCollateral(mockNFT.address, 0);
    info = await collateralizedRent.rents(mockNFT.address, 0)
    expect(info.dejure).to.equal(owner.address)

    newBalance = await ethers.provider.getBalance(collateralizedRent.address);
    expect(newBalance).to.equal('3350000000000000000');
  });
});
