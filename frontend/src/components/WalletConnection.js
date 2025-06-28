import React, { useState, useEffect } from 'react';
import { connectWallet, formatAddress, formatTokens, getBCITokenContract } from '../utils/contracts';

const WalletConnection = ({ onWalletConnect }) => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkConnection();
    setupEventListeners();
  }, []);

  useEffect(() => {
    if (account) {
      loadBalances();
    }
  }, [account]);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onWalletConnect?.(accounts[0]);
        }
      } catch (error) {
        console.error('Erro ao verificar conexão:', error);
      }
    }
  };

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onWalletConnect?.(accounts[0]);
        } else {
          setAccount('');
          setBalance('0');
          setTokenBalance('0');
          onWalletConnect?.(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  };

  const loadBalances = async () => {
    try {
      if (!account) return;

      const provider = new (await import('ethers')).ethers.providers.Web3Provider(window.ethereum);
      
      // Saldo ETH
      const ethBalance = await provider.getBalance(account);
      setBalance(formatTokens(ethBalance));

      // Saldo BCI
      try {
        const tokenContract = getBCITokenContract();
        const bciBalance = await tokenContract.balanceOf(account);
        setTokenBalance(formatTokens(bciBalance));
      } catch (tokenError) {
        console.log('Contrato BCI não disponível:', tokenError.message);
        setTokenBalance('N/A');
      }
    } catch (error) {
      console.error('Erro ao carregar saldos:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError('');

    try {
      const { address } = await connectWallet();
      setAccount(address);
      onWalletConnect?.(address);
    } catch (error) {
      setError(error.message || 'Erro ao conectar carteira');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAccount('');
    setBalance('0');
    setTokenBalance('0');
    onWalletConnect?.(null);
  };

  if (!window.ethereum) {
    return (
      <div className="urna-card">
        <div className="urna-card-header">
          🦊 MetaMask Necessário
        </div>
        <div className="urna-card-body">
          <div className="urna-alert urna-alert-error">
            <h3>Extensão MetaMask Não Encontrada</h3>
            <p>Para utilizar este sistema de votação, é necessário instalar a extensão MetaMask no seu navegador.</p>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <a 
                href="https://metamask.io/download.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="urna-btn urna-btn-primary"
                style={{ textDecoration: 'none' }}
              >
                📥 Instalar MetaMask
              </a>
            </div>
            
            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--neutral-gray)' }}>
              <p><strong>Após a instalação:</strong></p>
              <ol style={{ marginLeft: '20px' }}>
                <li>Reinicie o navegador</li>
                <li>Configure sua conta</li>
                <li>Adicione a rede Sepolia</li>
                <li>Retorne a esta página</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="urna-card">
        <div className="urna-card-header">
          🔐 Autenticação Necessária
        </div>
        <div className="urna-card-body">
          <div className="urna-alert urna-alert-info">
            <h3>🏛️ Sistema de Votação Oficial</h3>
            <p>Para participar do processo democrático, conecte sua carteira digital MetaMask.</p>
            <p><strong>Requisitos:</strong></p>
            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Extensão MetaMask instalada</li>
              <li>Conta configurada na rede Sepolia</li>
              <li>ETH de teste para taxas de transação</li>
            </ul>
          </div>

          {error && (
            <div className="urna-alert urna-alert-error">
              ❌ {error}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="urna-btn urna-btn-primary"
              style={{ fontSize: '1.2rem', padding: '20px 40px' }}
            >
              {isConnecting ? (
                <>
                  <div className="loading-spinner" style={{ display: 'inline-block', width: '20px', height: '20px', marginRight: '10px' }}></div>
                  Conectando...
                </>
              ) : (
                '🔗 Conectar Carteira MetaMask'
              )}
            </button>
          </div>

          <div className="urna-alert urna-alert-warning" style={{ marginTop: '20px' }}>
            <small>
              <strong>⚠️ Importante:</strong> Este sistema utiliza a rede de teste Sepolia. 
              Não há custos reais envolvidos. Os tokens BCI são apenas para demonstração.
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-status">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'var(--primary-blue)', margin: 0 }}>
          ✅ Eleitor Autenticado
        </h3>
        <button
          onClick={handleDisconnect}
          className="urna-btn urna-btn-secondary"
          style={{ fontSize: '0.9rem', padding: '8px 16px' }}
        >
          🚪 Desconectar
        </button>
      </div>

      <div className="wallet-address">
        <strong>🆔 Identificação do Eleitor:</strong> {formatAddress(account)}
      </div>

      <div className="balance-display">
        <div className="balance-item">
          <div className="balance-value">{Number(balance).toFixed(4)}</div>
          <div className="balance-label">ETH Sepolia</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)' }}>Para taxas de transação</div>
        </div>
        <div className="balance-item">
          <div className="balance-value">{Number(tokenBalance).toFixed(0)}</div>
          <div className="balance-label">Tokens BCI</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--neutral-gray)' }}>Poder de voto</div>
        </div>
      </div>

      <div style={{ 
        textAlign: 'center', 
        fontSize: '0.9rem', 
        color: 'var(--neutral-gray)',
        marginTop: '15px',
        padding: '10px',
        background: 'var(--light-gray)',
        borderRadius: '6px',
        border: '1px solid var(--border-color)'
      }}>
        <p>📊 Status: Apto para votar | 🔄 Saldos atualizados automaticamente</p>
      </div>
    </div>
  );
};

export default WalletConnection;
