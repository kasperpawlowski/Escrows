import React from 'react'
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function Home() {
    return (
        <div className="w-50 m-auto mt-4">
            <h1>Welcome to Escrow dApp!</h1>
            <h3 className="mb-4">Trade securely with others</h3>
            <p className="mb-1">Thanks to our dApp you can securely pay for goods over the Internet</p>
            <p className="mb-1">If you are a seller you can safely collect payments from your customers</p>
            <p>It's free! It's easy!</p>
            <Button as={Link} to="/trade" variant="success" className="mt-4">
                Trade
            </Button>
        </div>
    )
}
