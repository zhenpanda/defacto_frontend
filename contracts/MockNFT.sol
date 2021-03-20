//SPDX-License-Identifier: Unlicense
pragma solidity 0.7.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockNFT is ERC721 {
    constructor() public ERC721("MockNFT", "MNFT") {}

    function mint(address to, uint256 tokenId) external {
        _safeMint(to, tokenId, "");
    }
}