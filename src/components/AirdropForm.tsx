"use client";
import InputField from "@/components/ui/InputField";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { calculateTotal } from "@/utils";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { useMemo, useState } from "react";
import { useAccount, useChainId, useConfig, useWriteContract } from "wagmi";

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  async function getApprovedAmount(
    tSenderAddress: string | null
  ): Promise<number> {
    if (!tSenderAddress) {
      alert("No address found. Please use a supported chain!");
      return 0;
    }

    // Trim whitespace from token address
    const cleanTokenAddress = tokenAddress.trim();

    if (!cleanTokenAddress) {
      alert("Please enter a valid token address!");
      return 0;
    }

    try {
      const response = await readContract(config, {
        abi: erc20Abi,
        address: cleanTokenAddress as `0x${string}`,
        functionName: "allowance",
        args: [account.address, tSenderAddress.trim() as `0x${string}`],
      });

      return response as number;
    } catch (error) {
      console.error("Error reading contract:", error);
      alert("Error reading token allowance. Please check the token address.");
      return 0;
    }
  }

  async function handleSubmit() {
    // Validate inputs
    if (!tokenAddress.trim()) {
      alert("Please enter a token address!");
      return;
    }

    if (!recipients.trim()) {
      alert("Please enter recipient addresses!");
      return;
    }

    if (!amounts.trim()) {
      alert("Please enter amounts!");
      return;
    }

    if (!account.address) {
      alert("Please connect your wallet!");
      return;
    }

    const tSenderAddress = chainsToTSender[chainId]?.["tsender"];

    if (!tSenderAddress) {
      alert("TSender not supported on this chain!");
      return;
    }

    const approvedAmount = await getApprovedAmount(tSenderAddress);

    if (approvedAmount < total) {
      const approvalHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress.trim() as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddress.trim() as `0x${string}`, BigInt(total)],
      });
      const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approvalHash,
      });
      console.log("Approval confirmed!", approvalReceipt);
    } else {
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress.trim() as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress.trim() as `0x${string}`,
          // Comma or new line separated
          recipients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
          amounts
            .split(/[,\n]+/)
            .map((amt) => BigInt(amt.trim()))
            .filter((amt) => amt > BigInt(0)),
          BigInt(total),
        ],
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Token Airdrop
      </h2>

      <div className="space-y-6">
        <InputField
          label="Token Address"
          placeholder="0x..."
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />

        <InputField
          label="Recipients (comma or new line separated)"
          placeholder="0x123..., 0x456...,"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          large
        />

        <InputField
          label="Amounts"
          placeholder="100, 200, 300, ..."
          value={amounts}
          onChange={(e) => setAmounts(e.target.value)}
          large
        />
        {/*
        TODO:
        - Create a section before the `send token` button for transaction details with the following details:
          - Token Name
          - Amount in wei
          - Amount in tokens
        - Make the form (inputs and buttons) much finer:
          - The button should have a spinner while a transaction is in progress
            or while MetaMask is popped up
          - The inputs should be saved to local storage so when user refreshes
            the page, they do not lose them
        */}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg mt-6"
        >
          Send Token
        </button>
      </div>
    </div>
  );
}
