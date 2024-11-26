import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { toast } from 'react-toastify';

import { contractABI, contractAddress } from "../utils/constant"

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = async () => {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

    return ({
        provider,
        signer,
        transactionContract
    })
}


export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState("")
    const [transactions, setCurrentTransactions] = useState([])
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" })
    const [trasactions, setTransactions] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"))

    const handleChange = (e, name) => {
        setFormData((prevState) => ({
            ...prevState, [name]: e.target.value
        }))
    }

    const disconnectWallet = async () => {
        setCurrentAccount("");
        setCurrentTransactions([]);
        toast("Wallet disconnected");
        localStorage.removeItem("transactionCount");

    };

    const getAllTransactions = async () => {
        try {
            if (ethereum) {
                const { transactionContract } = await getEthereumContract();

                const availableTransactions = await transactionContract.getAllTransactions();
                console.log(availableTransactions[0])
                const structuredTransactions = await availableTransactions.map((transaction) => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
                    message: transaction.message,
                    keyword: transaction.keyword,
                    amount: (Number(transaction.amount) / 1e18).toFixed(4)
                }));

                console.log({ structuredTransactions })

                setCurrentTransactions(structuredTransactions);

            } else {
                console.log("Ethereum is not present");
            }
        } catch (error) {
            console.log(error)
        }
    }


    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return toast("Please install metamask")
            const accounts = await ethereum.request({ method: "eth_accounts" })
            console.log(accounts)

            if (accounts.length) {
                setCurrentAccount(accounts[0])

                getAllTransactions();

                console.log(accounts)
            } else {
                toast("No accounts found")
            }
        } catch (error) {
            console.log(error)
            toast("No ehtereum object.")
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return toast("Please install metamask");
            // get the data from the form...
            const { addressTo, amount, keyword, message } = formData;

            const parsedAmount = ethers.parseEther(amount)
            console.log({ parsedAmount, addressTo, amount, keyword, message })

            const { transactionContract } = await getEthereumContract();
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", // 21000 GWEI
                    value: parsedAmount._hex, // 0.00001
                }]
            })


            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait();
            setIsLoading(false);
            const transactionCount = await transactionContract.getTransactionCount()
            console.log({ transactionCount })
            setTransactionCount(transactionCount)
            await getAllTransactions()
            toast(`${amount} Sent successfully. Check your latest transaction section to view details`)
            setFormData({ addressTo: "", amount: "", keyword: "", message: "" })
        } catch (error) {
            console.log({ error })
        }
    }




    const checkIfTransactionExist = async () => {
        try {
            const { transactionContract } = await getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount()

            window.localStorage.setItem("transactionCount", transactionCount)
        } catch (error) {
            console.log(error)
            throw new Error("No ehtereum object.")
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return toast(" Please install metamask")
            const accounts = await ethereum.request({ method: "eth_requestAccounts" })

            setCurrentAccount(accounts[0])

            await getAllTransactions();
            toast("Wallet Connected")
            console.log(accounts)
        } catch (error) {
            console.log(error)
            throw new Error("No ehtereum object.")
        }
    }

    useEffect(() => {
        // checkIfWalletIsConnected();
        checkIfTransactionExist();
    }, [])

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, sendTransaction, transactions, isLoading, disconnectWallet }}>
            {children}
        </TransactionContext.Provider>
    )
}