// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductVerification {
    struct Product {
        string prodId;
        string location;
        uint256 timestamp;
        string nfcHash;
        address owner;
    }

    mapping(string => Product) public products;

    event ProductAdded(string prodId, address owner);
    event OwnershipTransferred(string prodId, address oldOwner, address newOwner);

    function addProduct(
        string memory _prodId,
        string memory _location,
        string memory _nfcHash
    ) public {
        require(products[_prodId].timestamp == 0, "Product already exists");

        products[_prodId] = Product({
            prodId: _prodId,
            location: _location,
            timestamp: block.timestamp,
            nfcHash: _nfcHash,
            owner: msg.sender
        });

        emit ProductAdded(_prodId, msg.sender);
    }

    function transferOwnership(
        string memory _prodId,
        string memory _newLocation,
        string memory _newNfcHash,
        string memory _prevNfcHash,
        address _newOwner
    ) public {
        Product storage product = products[_prodId];

        require(product.timestamp != 0, "Product not found");
        require(msg.sender == product.owner, "Only owner can transfer");
        require(keccak256(bytes(product.nfcHash)) == keccak256(bytes(_prevNfcHash)), "NFC hash mismatch");

        address oldOwner = product.owner;

        product.location = _newLocation;
        product.timestamp = block.timestamp;
        product.nfcHash = _newNfcHash;
        product.owner = _newOwner;

        emit OwnershipTransferred(_prodId, oldOwner, _newOwner);
    }

    function getProduct(string memory _prodId) public view returns (
        string memory,
        string memory,
        uint256,
        string memory,
        address
    ) {
        Product memory p = products[_prodId];
        return (p.prodId, p.location, p.timestamp, p.nfcHash, p.owner);
    }
}
