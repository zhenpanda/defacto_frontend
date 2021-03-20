//SPDX-License-Identifier: Unlicense
pragma solidity 0.7.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";

contract CollateralizedRent is ERC721Holder {
    struct rentInfo {
        address defacto;
        address dejure;
        uint256 payDue;
        uint256 payPeriod;
        uint256 time;
        uint256 collectedFees;
        uint256 lastRent;
        uint256 start;
        uint256 collateralRequirement;
    }
    struct nftInfo {
        IERC721 token;
        uint256 id;
    }
    mapping(IERC721 => mapping(uint256 => rentInfo)) public rents;
    mapping(address => nftInfo[]) public dejures;
    mapping(address => nftInfo[]) public defactos;

    constructor() public {}

    function listForRent(
        IERC721 token,
        uint256 _id,
        uint256 payDue,
        uint256 payPeriod,
        uint256 time,
        uint256 collateralRequirement
    ) external {
        token.transferFrom(msg.sender, address(this), _id);
        require(token.ownerOf(_id) == address(this), "Error Transferring NFT");
        rents[token][_id].dejure = msg.sender;
        rents[token][_id].payDue = payDue;
        rents[token][_id].payPeriod = payPeriod;
        rents[token][_id].time = time;
        rents[token][_id].collateralRequirement = collateralRequirement;

        dejures[msg.sender].push(nftInfo({token: token, id: _id}));
    }

    function delistForRent(
        IERC721 token,
        uint256 _id
    ) external {
        rentInfo storage info = rents[token][_id];
        require(msg.sender == info.dejure);
        require(info.defacto == address(0));
        
        uint256 fees = info.collectedFees;
        delete rents[token][_id];
        msg.sender.transfer(fees);

        deleteDeJure(msg.sender, token, _id);
        token.safeTransferFrom(address(this), msg.sender, _id);
        require(token.ownerOf(_id) == msg.sender, "Error Transferring NFT");
    }

    function rent(IERC721 token, uint256 _id) external payable {
        rentInfo storage info = rents[token][_id];
        require(info.defacto == address(0) && info.dejure != address(0));
        require(msg.value == info.payDue + info.collateralRequirement);

        info.collectedFees += info.payDue;
        info.defacto = msg.sender;
        info.lastRent = block.timestamp;
        info.start = block.timestamp;

        token.safeTransferFrom(address(this), msg.sender, _id);
        require(token.ownerOf(_id) == msg.sender);
        defactos[msg.sender].push(nftInfo({token: token, id: _id}));
    }

    function payRent(IERC721 token, uint256 _id) external payable {
        rentInfo storage info = rents[token][_id];
        require(msg.value >= info.payDue);
        require(info.start + info.time > block.timestamp);

        info.collectedFees += msg.value;
        info.lastRent = info.lastRent + info.payPeriod;
    }

    function returnRent(IERC721 token, uint256 _id) external {
        rentInfo storage info = rents[token][_id];
        require(info.defacto == msg.sender);
        info.defacto = address(0);
        msg.sender.transfer(info.collateralRequirement);

        token.safeTransferFrom(msg.sender, address(this), _id);
        require(token.ownerOf(_id) == address(this));
        deleteDeFacto(msg.sender, token, _id);
    }

    function liquidateCollateral(IERC721 token, uint256 _id) external {
        rentInfo storage info = rents[token][_id];
        require(msg.sender == info.dejure);
        require(info.defacto != address(0));
        require(
            block.timestamp >= info.start + info.time ||
                block.timestamp >= info.lastRent + info.payPeriod
        );

        uint256 collateral = info.collateralRequirement;
        uint256 fees = info.collectedFees;
        deleteDeJure(msg.sender, token, _id);
        deleteDeFacto(msg.sender, token, _id);
        delete rents[token][_id];
        msg.sender.transfer(collateral + fees);
    }

    function collectRents() external {
        uint256 amount = 0;
        for (uint256 i = 0; i < dejures[msg.sender].length; i++) {
            rentInfo storage info = rents[dejures[msg.sender][i].token][dejures[msg.sender][i].id];
            amount += info.collectedFees;
            info.collectedFees = 0;
        }
        msg.sender.transfer(amount);
    }

    function deleteDeFacto(address defacto, IERC721 token, uint256 _id) internal {
        for (uint256 i = 0; i < defactos[defacto].length; i++) {
            if (
                defactos[defacto][i].token == token &&
                defactos[defacto][i].id == _id
            ) {
                delete defactos[defacto][i];
            }
        }
    }

    function deleteDeJure(address dejure, IERC721 token, uint256 _id) internal {
        for (uint256 i = 0; i < dejures[dejure].length; i++) {
            if (
                dejures[dejure][i].token == token &&
                dejures[dejure][i].id == _id
            ) {
                delete dejures[dejure][i];
            }
        }
    }
}
