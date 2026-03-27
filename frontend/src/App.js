import React, { useState } from 'react';
import WalletConnection from './components/WalletConnection';
import ProposalList from './components/ProposalList';
import CreateProposal from './components/CreateProposal';
import SepoliaFaucet from './components/SepoliaFaucet';
import { BCI_TOKEN_ADDRESS, DAO_VOTING_ADDRESS } from './utils/contracts';
import './styles/urna.css'; // Importar estilos da urna

function App() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [activeTab, setActiveTab] = useState('proposals');

  const handleWalletConnect = (account) => {
    setConnectedAccount(account);
  };

  const isContractsConfigured = () => {
    console.log('Verificando configuração dos contratos:', {
      BCI_TOKEN_ADDRESS,
      DAO_VOTING_ADDRESS,
      env_bci: process.env.REACT_APP_BCI_TOKEN_ADDRESS,
      env_dao: process.env.REACT_APP_DAO_VOTING_ADDRESS
    });
    return BCI_TOKEN_ADDRESS && DAO_VOTING_ADDRESS;
  };

  if (!isContractsConfigured()) {
    return (
      <div className="urna-container">
        <div className="urna-header">
          <h1>🗳️ Sistema de Votação DAO</h1>
          <p className="subtitle">Blockchain Insper - Urna Eletrônica Descentralizada</p>
          <p className="institution">Tecnologia Blockchain para Votação Segura</p>
        </div>
        
        <div className="urna-card">
          <div className="urna-card-header">
            ⚠️ Sistema em Configuração
          </div>
          <div className="urna-card-body">
            <div className="urna-alert urna-alert-warning">
              <h3>Sistema Requer Configuração</h3>
              <p>Os contratos inteligentes ainda não foram configurados. Siga estes passos:</p>
              
              <ol style={{ marginLeft: '20px', marginTop: '15px' }}>
                <li>Execute o deploy dos contratos na rede Sepolia</li>
                <li>Atualize os endereços no arquivo .env</li>
                <li>Reinicie a aplicação</li>
              </ol>
              
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
                <strong>Endereços esperados:</strong>
                <br />BCI Token: {BCI_TOKEN_ADDRESS || 'Não configurado'}
                <br />DAO Voting: {DAO_VOTING_ADDRESS || 'Não configurado'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="urna-container">
      <div className="urna-header">
        <h1>🗳️ Sistema de Votação DAO</h1>
        <p className="subtitle">Blockchain Insper - Urna Eletrônica Descentralizada</p>
        <p className="institution">Votação Segura e Transparente via Blockchain</p>
      </div>

      <WalletConnection onWalletConnect={handleWalletConnect} />

      <SepoliaFaucet account={connectedAccount} />

      {connectedAccount && (
        <>
          <div className="urna-tabs">
            <button
              onClick={() => setActiveTab('proposals')}
              className={`urna-tab ${activeTab === 'proposals' ? 'active' : ''}`}
            >
              📋 Consultar Propostas
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`urna-tab ${activeTab === 'create' ? 'active' : ''}`}
            >
              ➕ Registrar Nova Proposta
            </button>
          </div>

          <div className="fade-in">
            {activeTab === 'proposals' && (
              <ProposalList account={connectedAccount} />
            )}
            {activeTab === 'create' && (
              <CreateProposal 
                account={connectedAccount} 
                onProposalCreated={() => setActiveTab('proposals')}
              />
            )}
          </div>
        </>
      )}

      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px', 
        color: 'rgba(255, 255, 255, 0.8)', 
        fontSize: '14px' 
      }}>
        <p>
          🔐 Sistema Oficial de Votação DAO | Blockchain Insper 2025 | 
          <a 
            href="https://sepolia.etherscan.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'underline' }}
          >
            Verificar na Blockchain
          </a>
        </p>
        <p style={{ marginTop: '10px', fontSize: '12px' }}>
          Rede: Sepolia Testnet | Versão: 1.0.0 | Tecnologia: React + Solidity + ethers.js
        </p>
      </div>
    </div>
  );
}

export default App;
