'use client';

import InputField from '@/components/ui/InputField';
import { chainsToTSender, erc20Abi, tsenderAbi } from '@/constants';
import { calculateTotal } from '@/utils';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useChainId, useConfig, useWriteContract } from 'wagmi';

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [recipients, setRecipients] = useState('');
  const [amounts, setAmounts] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const [showConnectWarning, setShowConnectWarning] = useState(false);
  const [transactionState, setTransactionState] = useState<string | null>(null);

  // Load saved values from localStorage on component mount
  useEffect(() => {
    const savedTokenAddress = localStorage.getItem('airdrop-token-address');
    const savedRecipients = localStorage.getItem('airdrop-recipients');
    const savedAmounts = localStorage.getItem('airdrop-amounts');

    if (savedTokenAddress) setTokenAddress(savedTokenAddress);
    if (savedRecipients) setRecipients(savedRecipients);
    if (savedAmounts) setAmounts(savedAmounts);
  }, []);

  // Save values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('airdrop-token-address', tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    localStorage.setItem('airdrop-recipients', recipients);
  }, [recipients]);

  useEffect(() => {
    localStorage.setItem('airdrop-amounts', amounts);
  }, [amounts]);

  // Function to fetch token details
  async function fetchTokenDetails(address: string) {
    if (!address.trim()) return;

    try {
      const cleanAddress = address.trim() as `0x${string}`;

      const [name, symbol, decimals] = await Promise.all([
        readContract(config, {
          abi: erc20Abi,
          address: cleanAddress,
          functionName: 'name',
        }),
        readContract(config, {
          abi: erc20Abi,
          address: cleanAddress,
          functionName: 'symbol',
        }),
        readContract(config, {
          abi: erc20Abi,
          address: cleanAddress,
          functionName: 'decimals',
        }),
      ]);

      setTokenName(name as string);
      setTokenSymbol(symbol as string);
      setTokenDecimals(decimals as number);
    } catch (error) {
      console.error('Error fetching token details:', error);
      setTokenName('');
      setTokenSymbol('');
      setTokenDecimals(18);
    }
  }

  // Fetch token details when token address changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tokenAddress.trim()) {
        // Only fetch if valid Ethereum address
        void fetchTokenDetails(tokenAddress);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [tokenAddress]);

  async function getApprovedAmount(
    tSenderAddress: string | null
  ): Promise<bigint> {
    if (!tSenderAddress) {
      toast.error('No address found. Please use a supported chain!');
      return BigInt(0);
    }

    // Trim whitespace from token address
    const cleanTokenAddress = tokenAddress.trim();

    if (!cleanTokenAddress) {
      toast.error('Please enter a valid token address!');
      return BigInt(0);
    }

    try {
      const response = await readContract(config, {
        abi: erc20Abi,
        address: cleanTokenAddress as `0x${string}`,
        functionName: 'allowance',
        args: [account.address, tSenderAddress.trim() as `0x${string}`],
      });

      return response as bigint;
    } catch (error) {
      console.error('Error reading contract:', error);
      toast.error(
        'Error reading token allowance. Please check the token address.'
      );
      return BigInt(0);
    }
  }

  async function handleSubmit() {
    try {
      setTransactionState(null);

      // Validate inputs
      if (!tokenAddress.trim()) {
        toast.error('Please enter a token address!');
        return;
      }

      if (!recipients.trim()) {
        toast.error('Please enter recipient addresses!');
        return;
      }

      if (!amounts.trim()) {
        toast.error('Please enter amounts!');
        return;
      }

      if (!account.address) {
        setShowConnectWarning(true);
        return;
      }

      const tSenderAddress = chainsToTSender[chainId]?.['tsender'];

      if (!tSenderAddress) {
        toast.error('TSender not supported on this chain!');
        return;
      }

      setTransactionState('Checking token allowance...');
      const approvedAmount = await getApprovedAmount(tSenderAddress);

      // Step 1: Approve if needed
      if (approvedAmount < BigInt(total)) {
        setTransactionState('Approving token spending...');
        const approvalHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress.trim() as `0x${string}`,
          functionName: 'approve',
          args: [tSenderAddress.trim() as `0x${string}`, BigInt(total)],
        });

        setTransactionState('Waiting for approval confirmation...');
        await waitForTransactionReceipt(config, {
          hash: approvalHash,
        });
      }

      // Step 2: Execute the airdrop
      setTransactionState('Executing airdrop transaction...');
      const airdropHash = await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress.trim() as `0x${string}`,
        functionName: 'airdropERC20',
        args: [
          tokenAddress.trim() as `0x${string}`,
          recipients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ''),
          amounts
            .split(/[,\n]+/)
            .map((amt) => BigInt(amt.trim()))
            .filter((amt) => amt > BigInt(0)),
          BigInt(total),
        ],
      });

      setTransactionState('Waiting for airdrop confirmation...');
      await waitForTransactionReceipt(config, {
        hash: airdropHash,
      });

      setTransactionState(null);
      toast.success('Airdrop completed successfully!');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setTransactionState(null);
      toast.error('Transaction failed. Please try again.');
    }
  }

  const Spinner = () => (
    <svg
      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      ></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
  );

  useEffect(() => {
    if (account.address && showConnectWarning) {
      setShowConnectWarning(false);
    }
  }, [account.address, showConnectWarning]);

  return (
    <div className='max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-gray-200'>
      <div className='space-y-7'>
        <InputField
          label='Token Address'
          placeholder='0x...'
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />

        <InputField
          label={
            <span>
              Recipients{' '}
              <span className='text-gray-400 text-sm font-normal'>
                (comma or new line separated)
              </span>
            </span>
          }
          placeholder='0x123..., 0x456...,'
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          large
        />

        <InputField
          label='Amounts'
          placeholder='100, 200, 300, ...'
          value={amounts}
          onChange={(e) => setAmounts(e.target.value)}
          large
        />

        {/* Transaction Details Section */}
        {tokenName && total > 0 && (
          <div className='bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-md'>
            <h3 className='text-lg font-bold text-gray-900 mb-3'>
              Transaction Details
            </h3>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Token Name:</span>
                <span className='font-medium text-gray-800'>
                  {tokenName} ({tokenSymbol})
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Total Amount (Wei):</span>
                <span className='font-mono text-sm text-gray-800'>
                  {total.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Total Amount (Tokens):</span>
                <span className='font-medium text-gray-800'>
                  {(total / Math.pow(10, tokenDecimals)).toLocaleString()}{' '}
                  {tokenSymbol}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Recipients:</span>
                <span className='font-medium text-gray-800'>
                  {
                    recipients.split(/[,\n]+/).filter((addr) => addr.trim())
                      .length
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setShowConnectWarning(false); // Remove warning if user tries again
            void handleSubmit();
          }}
          disabled={isPending || transactionState !== null}
          className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl mt-8 flex items-center justify-center text-lg tracking-wide
            ${
              showConnectWarning
                ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900 focus:ring-yellow-600 focus:ring-offset-yellow-100'
                : 'bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-700 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer'
            }
          `}
        >
          {transactionState ? (
            <>
              <Spinner />
              {transactionState}
            </>
          ) : isPending ? (
            <>
              <Spinner />
              Processing...
            </>
          ) : showConnectWarning ? (
            'Please connect to wallet first'
          ) : (
            'Send Token'
          )}
        </button>
      </div>
    </div>
  );
}
