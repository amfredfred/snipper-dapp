import { ethers } from "ethers";

export default (address: string) => ethers.isAddress(address) 