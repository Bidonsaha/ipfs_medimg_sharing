// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

contract SimpleStorage { 
  string ipfsHash;
  uint i=0;

  mapping(uint => string) public hashes;
  string[] ipfsArray;

  function set(string memory x) public {
    ipfsHash = x;
    i=i+1;
    hashes[i]=ipfsHash;
    ipfsArray.push(ipfsHash);
  }

  function get() public view returns (string memory) {
    return ipfsHash;
  }

  function print() public view returns (uint) {
        return i;
    }

  function getHash(uint x) public view returns (string memory){
    return hashes[x];
  }

  function getHashArr(uint x) public view returns (string memory){
    return ipfsArray[x];
  }
}
