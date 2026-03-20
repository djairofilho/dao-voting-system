import React, { useState } from 'react';

const SepoliaFaucet = ({ account }) => {
  const [copied, setCopied] = useState(false);

  const faucets = [
    {
      name: 'Alchemy Faucet',
      url: 'https://sepoliafaucet.com/',
      description: 'Faucet oficial da Alchemy - 0.5 ETH por requisição',
      requires: 'Conta Alchemy (recomendado)',
      logo: '⚡'
    },
    {
      name: 'Infura Faucet',
      url: 'https://www.infura.io/faucet/sepolia',
      description: 'Faucet da Infura - 1 ETH por requisição',
      requires: 'Conta Infura',
      logo: '🔷'
    },
    {
      name: 'Grabteeth',
      url: 'https://grabteeth.xyz/',
      description: 'Faucet público - até 0.1 ETH (sem limite de requisições)',
      requires: 'Nenhuma',
      logo: '🦷'
    },
    {
      name: 'Sepolia Faucet',
      url: 'https://www.sepoliafaucet.io/',
      description: 'Faucet simples - 0.5 ETH por vez',
      requires: 'Nenhuma',
      logo: '💧'
    }
  ];

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openFaucet = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(100, 150, 255, 0.1) 0%, rgba(150, 100, 255, 0.1) 100%)',
      border: '2px solid rgba(100, 200, 255, 0.3)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <h3 style={{
        margin: '0 0 15px 0',
        color: '#fff',
        fontSize: '1.1em'
      }}>
        💰 Obter Sepolia ETH de Teste
      </h3>

      {account && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(100, 200, 255, 0.5)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '15px'
        }}>
          <div style={{ fontSize: '0.85em', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '5px' }}>
            Seu endereço:
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px'
          }}>
            <code style={{
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.8em',
              wordBreak: 'break-all',
              flex: 1,
              fontFamily: 'monospace'
            }}>
              {account}
            </code>
            <button
              onClick={copyAddress}
              style={{
                padding: '8px 12px',
                background: copied ? '#28a745' : '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9em',
                whiteSpace: 'nowrap'
              }}
            >
              {copied ? '✅ Copiado!' : '📋 Copiar'}
            </button>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '12px',
        marginBottom: '15px'
      }}>
        {faucets.map((faucet, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(100, 200, 255, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(100, 200, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(100, 200, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(100, 200, 255, 0.3)';
            }}
            onClick={() => openFaucet(faucet.url)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '1.5em' }}>{faucet.logo}</span>
              <strong style={{ color: '#fff' }}>{faucet.name}</strong>
              <span style={{
                marginLeft: 'auto',
                background: '#007bff',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.7em',
                whiteSpace: 'nowrap'
              }}>
                Abrir
              </span>
            </div>
            <div style={{
              fontSize: '0.85em',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '6px'
            }}>
              {faucet.description}
            </div>
            <div style={{
              fontSize: '0.75em',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              Requer: <strong>{faucet.requires}</strong>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(76, 175, 80, 0.2)',
        border: '1px solid rgba(76, 175, 80, 0.5)',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '0.85em',
        color: '#a8d5a8'
      }}>
        <strong>📝 Passo a Passo:</strong>
        <ol style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
          <li>Escolha um faucet acima</li>
          <li>Cole seu endereço Ethereum (ou copie usando o botão acima)</li>
          <li>Espere o testnet ETH chegar (geralmente 30-60 segundos)</li>
          <li>Você pode usar para fazer transações no Sepolia!</li>
        </ol>
      </div>

      <div style={{
        background: 'rgba(220, 180, 50, 0.2)',
        border: '1px solid rgba(220, 180, 50, 0.5)',
        borderRadius: '8px',
        padding: '12px',
        marginTop: '12px',
        fontSize: '0.8em',
        color: '#ffd966'
      }}>
        <strong>⚠️ Importante:</strong> Sepolia ETH é <strong>apenas para testes</strong>. Não tem valor real!
        Você pode pedir mais tokens conforme necessário. Cada faucet geralmente permite 1 requisição a cada 24 horas.
      </div>
    </div>
  );
};

export default SepoliaFaucet;
