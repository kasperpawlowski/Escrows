import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {Web3ReactProvider} from '@web3-react/core';
import {Web3Provider} from "@ethersproject/providers";
import './index.css';
import App from './App';

function getLibrary(provider, connector) {
  return new Web3Provider(provider);
}

ReactDOM.render(
  <BrowserRouter>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </BrowserRouter>, 
  document.getElementById('root')
);