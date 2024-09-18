const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let MyToken, myToken, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy([addr1.address, addr2.address]);
  });

  it("Token deployed right", async function () {
    expect(await myToken.name()).to.equal("MyToken");
    expect(await myToken.symbol()).to.equal("MTK");
  });

  it("Constructor mints tokens", async function () {
    const decimals = await myToken.decimals();
    const initialMint = ethers.parseUnits("100000", decimals);

    expect(await myToken.balanceOf(addr1.address)).to.equal(initialMint);
    expect(await myToken.balanceOf(addr2.address)).to.equal(initialMint);
  });

  it("Mint more than total supply is forbidden", async function () {
    const decimals = await myToken.decimals();
    const maxSupply = ethers.parseUnits("1000000", decimals);

    await expect(
      myToken.mint(owner.address, ethers.parseUnits("900000", decimals))
    ).to.be.revertedWith("Total supply exceeded");
  });

  it("Only owner can mint new tokens", async function () {
    const decimals = await myToken.decimals();
    const mintAmount = ethers.parseUnits("1000", decimals);

    await expect(
      myToken.connect(addr1).mint(addr1.address, mintAmount)
    ).to.be.reverted;    

    await myToken.connect(owner).mint(addr1.address, mintAmount);

    const newAmount = ethers.parseUnits("101000", decimals);
    expect(await myToken.balanceOf(addr1.address)).to.equal(newAmount);
  });
});
