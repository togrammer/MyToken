// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    uint256 public TOTAL_SUPPLY = 1e6 * (10 ** decimals());

    constructor(address[] memory addresses) ERC20("MyToken", "MTK") Ownable(msg.sender) {
        uint256 startAmount = 1e5 * (10 ** decimals());
        uint256 addressLength = addresses.length;

        require(addressLength != 0, "Initial addresses expected");

        for (uint256 i = 0; i < addressLength; ++i) {
            _mint(addresses[i], startAmount);
        }
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= TOTAL_SUPPLY, "Total supply exceeded");
        _mint(to, amount);
    }
}