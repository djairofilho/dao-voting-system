import React, { useState, useEffect } from 'react';
import { 
  getDAOVotingContract, 
  formatTokens, 
  formatAddress, 
  getTimeRemaining 
} from '../utils/contracts';

const ProposalList = ({ account }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingProposal, setVotingProposal] = useState(null);
  const [executingProposal, setExecutingProposal] = useState(null);

  useEffect(() => {
    loadProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProposals = async () => {
    try {
      setError('');
      const daoContract = getDAOVotingContract();
      
      const totalProposals = await daoContract.getTotalProposals();
      const proposalCount = totalProposals.toNumber();
      
      if (proposalCount === 0) {
        setProposals([]);
        setLoading(false);
        return;
      }

      const proposalsList = [];
      
      for (let i = 1; i <= proposalCount; i++) {
        try {
          const proposal = await daoContract.getProposal(i);
          const isActive = await daoContract.isProposalActive(i);
          const hasVoted = await daoContract.hasVoted(i, account);
          
          proposalsList.push({
            id: i,
            title: proposal.title,
            description: proposal.description,
            endTime: proposal.endTime.toNumber(),
            forVotes: proposal.forVotes,
            againstVotes: proposal.againstVotes,
            executed: proposal.executed,
            proposer: proposal.proposer,
            isActive,
            hasVoted
          });
        } catch (err) {
          console.error(`Erro ao carregar proposta ${i}:`, err);
        }
      }
      
      proposalsList.sort((a, b) => b.id - a.id);
      setProposals(proposalsList);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
      setError('Erro ao carregar propostas da blockchain');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId, support) => {
    try {
      setVotingProposal(proposalId);
      setError('');
      
      const daoContract = getDAOVotingContract();
      const tx = await daoContract.castVote(proposalId, support);
      
      console.log('Voto enviado, aguardando confirmação...');
      await tx.wait();
      console.log('Voto confirmado na blockchain');
      
      await loadProposals();
    } catch (error) {
      console.error('Erro ao votar:', error);
      if (error.code === 4001) {
        setError('Votação cancelada pelo usuário');
      } else {
        setError('Erro ao registrar voto na blockchain');
      }
    } finally {
      setVotingProposal(null);
    }
  };

  const handleExecute = async (proposalId) => {
    try {
      setExecutingProposal(proposalId);
      setError('');
      
      const daoContract = getDAOVotingContract();
      const tx = await daoContract.executeProposal(proposalId);
      
      console.log('Execução enviada, aguardando confirmação...');
      await tx.wait();
      console.log('Proposta executada na blockchain');
      
      await loadProposals();
    } catch (error) {
      console.error('Erro ao executar proposta:', error);
      if (error.code === 4001) {
        setError('Execução cancelada pelo usuário');
      } else {
        setError('Erro ao executar proposta na blockchain');
      }
    } finally {
      setExecutingProposal(null);
    }
  };

  if (loading) {
    return (
      <div className="urna-card">
        <div className="urna-card-header">
          📋 Carregando Propostas
        </div>
        <div className="urna-card-body" style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '20px', color: 'var(--neutral-gray)' }}>
            Consultando propostas na blockchain...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="urna-card">
        <div className="urna-card-header">
          📋 Consulta de Propostas Oficiais
        </div>
        <div className="urna-card-body">
          <div className="urna-alert urna-alert-info">
            <h4>🏛️ Sistema de Votação Eletrônica</h4>
            <p>Consulte todas as propostas registradas na blockchain e participe do processo democrático.</p>
          </div>

          {error && (
            <div className="urna-alert urna-alert-error">
              ❌ {error}
              <button 
                onClick={loadProposals}
                className="urna-btn urna-btn-outline"
                style={{ marginTop: '10px', fontSize: '0.9rem', padding: '8px 16px' }}
              >
                🔄 Tentar Novamente
              </button>
            </div>
          )}
        </div>
      </div>

      {proposals.length === 0 ? (
        <div className="urna-card">
          <div className="urna-card-body" style={{ textAlign: 'center', padding: '60px' }}>
            <h3 style={{ color: 'var(--neutral-gray)', marginBottom: '20px' }}>
              📝 Nenhuma Proposta Registrada
            </h3>
            <p style={{ color: 'var(--neutral-gray)', marginBottom: '30px' }}>
              Seja o primeiro a registrar uma proposta oficial no sistema!
            </p>
            <div style={{ 
              background: 'var(--light-gray)', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <h5 style={{ color: 'var(--primary-blue)', marginBottom: '10px' }}>
                Como registrar uma proposta:
              </h5>
              <ol style={{ textAlign: 'left', marginLeft: '20px', color: 'var(--neutral-gray)' }}>
                <li>Clique na aba "Registrar Nova Proposta"</li>
                <li>Preencha título e descrição detalhada</li>
                <li>Escolha o período de votação</li>
                <li>Confirme a transação no MetaMask</li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {proposals.map((proposal) => {
            const totalVotes = proposal.forVotes.add(proposal.againstVotes);
            const forPercentage = totalVotes.isZero() ? 0 : 
              (proposal.forVotes.mul(100).div(totalVotes)).toNumber();
            const againstPercentage = 100 - forPercentage;

            return (
              <div key={proposal.id} className="proposal-item">
                <div className="proposal-header">
                  <div className="proposal-id">
                    📊 PROPOSTA #{proposal.id.toString().padStart(3, '0')}
                  </div>
                  <div className="proposal-title">
                    {proposal.title}
                  </div>
                  <div className="proposal-meta">
                    👤 Proponente: {formatAddress(proposal.proposer)} | 
                    {proposal.isActive 
                      ? ` ⏰ ${getTimeRemaining(proposal.endTime)} restante`
                      : ' 🏁 Votação Encerrada'
                    }
                    {proposal.executed && ' | ✅ Executada'}
                  </div>
                </div>

                <div className="proposal-body">
                  <div className="proposal-description">
                    📄 <strong>Descrição:</strong> {proposal.description}
                  </div>

                  <div className="vote-counter">
                    <div className="vote-count-item vote-count-favor">
                      <div className="vote-count-number" style={{ color: 'var(--primary-green)' }}>
                        {formatTokens(proposal.forVotes)}
                      </div>
                      <div className="vote-count-label">
                        👍 A FAVOR ({forPercentage}%)
                      </div>
                    </div>
                    <div className="vote-count-item vote-count-against">
                      <div className="vote-count-number" style={{ color: 'var(--primary-red)' }}>
                        {formatTokens(proposal.againstVotes)}
                      </div>
                      <div className="vote-count-label">
                        👎 CONTRA ({againstPercentage}%)
                      </div>
                    </div>
                  </div>

                  {/* Seção de Votação */}
                  {proposal.isActive && !proposal.hasVoted && (
                    <div style={{ 
                      border: '2px solid var(--primary-blue)', 
                      borderRadius: '12px', 
                      padding: '20px',
                      background: 'rgba(0, 102, 204, 0.05)',
                      marginTop: '20px'
                    }}>
                      <h4 style={{ 
                        textAlign: 'center', 
                        color: 'var(--primary-blue)', 
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        🗳️ REGISTRAR SEU VOTO
                      </h4>
                      
                      <div className="voting-section">
                        <div 
                          className="vote-option"
                          onClick={() => handleVote(proposal.id, true)}
                          style={{ 
                            cursor: votingProposal === proposal.id ? 'wait' : 'pointer',
                            opacity: votingProposal === proposal.id ? 0.7 : 1
                          }}
                        >
                          <div className="vote-number" style={{ color: 'var(--primary-green)' }}>
                            SIM
                          </div>
                          <div className="vote-label">
                            👍 CONFIRMO
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--neutral-gray)' }}>
                            Voto favorável à proposta
                          </div>
                        </div>

                        <div 
                          className="vote-option"
                          onClick={() => handleVote(proposal.id, false)}
                          style={{ 
                            cursor: votingProposal === proposal.id ? 'wait' : 'pointer',
                            opacity: votingProposal === proposal.id ? 0.7 : 1
                          }}
                        >
                          <div className="vote-number" style={{ color: 'var(--primary-red)' }}>
                            NÃO
                          </div>
                          <div className="vote-label">
                            👎 REJEITO
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--neutral-gray)' }}>
                            Voto contrário à proposta
                          </div>
                        </div>
                      </div>

                      {votingProposal === proposal.id && (
                        <div style={{ textAlign: 'center', marginTop: '15px' }}>
                          <div className="loading-spinner" style={{ margin: '0 auto 10px' }}></div>
                          <p style={{ color: 'var(--primary-blue)', fontWeight: 'bold' }}>
                            📡 Registrando voto na blockchain...
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status do Voto */}
                  {proposal.hasVoted && (
                    <div className="urna-alert urna-alert-success" style={{ marginTop: '20px' }}>
                      ✅ <strong>Voto Registrado:</strong> Você já participou desta votação. 
                      Seu voto foi registrado com segurança na blockchain.
                    </div>
                  )}

                  {/* Botão de Execução */}
                  {!proposal.isActive && !proposal.executed && (
                    <div style={{ marginTop: '20px' }}>
                      <button
                        onClick={() => handleExecute(proposal.id)}
                        disabled={executingProposal === proposal.id}
                        className="urna-btn urna-btn-secondary"
                        style={{ width: '100%', fontSize: '1.1rem', padding: '15px' }}
                      >
                        {executingProposal === proposal.id ? (
                          <>
                            <div className="loading-spinner" style={{ display: 'inline-block', width: '20px', height: '20px', marginRight: '10px' }}></div>
                            Executando na Blockchain...
                          </>
                        ) : (
                          '🚀 Executar Proposta Encerrada'
                        )}
                      </button>
                    </div>
                  )}

                  {/* Status de Execução */}
                  {proposal.executed && (
                    <div className="urna-alert urna-alert-info" style={{ marginTop: '20px' }}>
                      ✅ <strong>Proposta Executada:</strong> Esta proposta foi oficialmente processada e 
                      seu resultado está registrado permanentemente na blockchain.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProposalList;
