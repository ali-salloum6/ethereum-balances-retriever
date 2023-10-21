import { ethers } from 'ethers';

export function isValidAddress(address: string): boolean {
  try {
    ethers.getAddress(address);
    return true;
  } catch (error) {
    return false;
  }
}

// // Example usage:
// const addressToCheck = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
// if (isValidEthereumAddress(addressToCheck)) {
//   console.log('Valid Ethereum address');
// } else {
//   console.log('Invalid Ethereum address');
// }
