import React, {useState, useEffect} from 'react'
import {useWeb3React} from "@web3-react/core";
import {injected} from '../utils/connector';
import {ethers} from 'ethers';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import contractABI from '../abi/Escrow.json';

const CONTRACT_ADDRESS = '0x46aD0c0C56B91b8182A2d0a1607758960f5925A1';

export default function Registation() {
    const clearForm = {amount: '', address: '', recipient: '0'};
    const [form, setForm] = useState(clearForm);
    const [state, setState] = useState(0);
    const [escrow, setEscrow] = useState('');
    const [buyer, setBuyer] = useState('');
    const [seller, setSeller] = useState('');
    const [contractBalance, setContractBalance] = useState('');
    const {activate, deactivate, active, account, library} = useWeb3React(); 

    const timer = setInterval(() => {
        if(active) {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, library.getSigner());
            contract.state().then(state => {
                setState(state);
            });

            contract.escrow().then(address => {
                setEscrow(address);
            });

            contract.buyer().then(address => {
                setBuyer(address);
            });

            contract.seller().then(address => {
                setSeller(address);
            });
    
            contract.provider.getBalance(CONTRACT_ADDRESS).then(balance => {
                setContractBalance(ethers.utils.formatEther(balance));
            });            
        }
    }, 1000);

    useEffect(() => {
        return () => clearInterval(timer);
    }, [active, account]);

    const connectWallet = () => {
        if(active) deactivate();
        else activate(injected, onConnectionError);
    }

    const onConnectionError = error => {
        if(!error.message.match('UserRejectedRequestError')) {
          alert("Cannot connect. Only Moonbase Alpha is supported");
        } else alert(error.message);
    }

    const setField = (field, value) => {
        setForm(form => ({...form, [field]: value}));
    }

    const makePayment = event => {
        event.preventDefault();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, library.getSigner());
        contract.makePayment(form.address, {value: ethers.utils.parseEther(form.amount)}).catch(error => {
            alert(`Something went wrong:\n${error.message}`);
        });
        setForm(clearForm);
    }

    const confirmDelivery = () => {       
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, library.getSigner());
        contract.confirmDelivery().catch(error => {
            alert(`Something went wrong:\n${error.message}`);
        });
    }

    const refundPayment = () => {       
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, library.getSigner());
        contract.refundPayment().catch(error => {
            alert(`Something went wrong:\n${error.message}`);
        });
    }

    const intermediate = event => {
        event.preventDefault();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, library.getSigner());
        contract.intermediate(form.recipient).catch(error => {
            alert(`Something went wrong:\n${error.message}`);
        });
        setForm(clearForm);
    }

    return (
        <div className="w-25 m-auto">
            {state === 0 ?
            <>
                <h1 className="mt-4 mb-3">Begin to trade</h1>
                <Form onSubmit={makePayment}>
                    <Form.Group className="mb-3" controlId="amount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control 
                            type="number" 
                            required
                            placeholder="Amount in DEV tokens"
                            value={form.amount}
                            onChange={e => setField('amount', e.target.value)}
                        />
                    </Form.Group>    

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Seller Address</Form.Label>
                        <Form.Control 
                            type="text"
                            required
                            placeholder={`0x${'0'.repeat(40)}`}
                            value={form.address}
                            onChange={e => setField('address', e.target.value)}
                        />
                    </Form.Group>        
                    {active ?
                    <Button variant="success" type="submit">
                        Pay!
                    </Button> :
                    <Button variant="success" onClick={connectWallet}>
                        Connect Wallet
                    </Button> 
                    }
                </Form>
            </> : buyer === account ?
            <>
                <h1 className="mt-4 mb-3">Confirm delivery</h1>
                <p>and pay {contractBalance} DEV tokens to the seller</p>
                <Button variant="success" onClick={confirmDelivery}>
                    Confirm!
                </Button> 
            </> : seller === account ?
            <>
            <h1 className="mt-4 mb-3">Something went wrong?</h1>
            <p>Refund buyer with {contractBalance} DEV tokens</p>
            <Button variant="success" onClick={refundPayment}>
                Confirm!
            </Button>
            </> : escrow === account ?
            <>
            <h1 className="mt-4 mb-3">Resolve issue</h1>
            <p>Refund buyer or send funds to the seller</p>
            <Form onSubmit={intermediate}>
                <Form.Group className="mb-3" controlId="recipient">
                    <Form.Label>Recipient:</Form.Label>
                    <Form.Select 
                        aria-label="recipient"
                        onChange={e => setField('recipient', e.target.value)}>
                        <option value="0">BUYER</option>
                        <option value="1">SELLER</option>
                    </Form.Select>
                </Form.Group>        
                <Button variant="success" type="submit">
                    Confirm!
                </Button>
            </Form>
            </> : 
            <h1>Change to buyer, seller or escrow account</h1>}
        </div>
    )
}
