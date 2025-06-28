import React, { useState } from 'react';
import { getDAOVotingContract } from '../utils/contracts';

const CreateProposal = ({ account, onProposalCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    votingPeriod: 7 // dias
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Título e descrição são obrigatórios');
      return;
    }

    if (formData.votingPeriod < 1 || formData.votingPeriod > 30) {
      setError('Período de votação deve ser entre 1 e 30 dias');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const daoContract = getDAOVotingContract();
      
      // Converter dias para segundos
      const votingPeriodSeconds = formData.votingPeriod * 24 * 60 * 60;
      
      console.log('Criando proposta...', {
        title: formData.title,
        description: formData.description,
        votingPeriod: votingPeriodSeconds
      });

      const tx = await daoContract.createProposal(
        formData.title,
        formData.description,
        votingPeriodSeconds
      );

      setSuccess('📡 Transação enviada! Aguarde a confirmação na blockchain...');
      
      const receipt = await tx.wait();
      console.log('Proposta criada:', receipt);

      setSuccess('✅ Proposta registrada com sucesso na blockchain!');
      setFormData({
        title: '',
        description: '',
        votingPeriod: 7
      });

      // Aguardar um momento antes de voltar para a lista
      setTimeout(() => {
        onProposalCreated?.();
      }, 3000);

    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      if (error.code === 4001) {
        setError('Transação cancelada pelo usuário');
      } else if (error.code === -32603) {
        setError('Erro de rede. Verifique sua conexão e tente novamente');
      } else {
        setError(error.message || 'Erro ao criar proposta');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="urna-card">
      <div className="urna-card-header">
        ➕ Registrar Nova Proposta
      </div>
      <div className="urna-card-body">
        <div className="urna-alert urna-alert-info">
          <h4>📋 Formulário de Proposta Oficial</h4>
          <p>Preencha os campos abaixo para submeter uma nova proposta à votação da comunidade DAO.</p>
        </div>

        {error && (
          <div className="urna-alert urna-alert-error">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="urna-alert urna-alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="urna-form-group">
            <label className="urna-label">
              📝 Título da Proposta *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="urna-input"
              placeholder="Ex: Implementação de nova funcionalidade"
              maxLength={100}
              required
            />
            <small style={{ color: 'var(--neutral-gray)', fontSize: '0.9rem' }}>
              Máximo 100 caracteres. Seja claro e objetivo.
            </small>
          </div>

          <div className="urna-form-group">
            <label className="urna-label">
              📄 Descrição Detalhada *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="urna-textarea"
              placeholder="Descreva detalhadamente a proposta, seus objetivos, benefícios e impactos esperados..."
              maxLength={1000}
              required
            />
            <small style={{ color: 'var(--neutral-gray)', fontSize: '0.9rem' }}>
              Máximo 1000 caracteres. Inclua justificativa e detalhes técnicos.
            </small>
          </div>

          <div className="urna-form-group">
            <label className="urna-label">
              ⏰ Período de Votação (dias) *
            </label>
            <select
              name="votingPeriod"
              value={formData.votingPeriod}
              onChange={handleInputChange}
              className="urna-select"
              required
            >
              <option value={1}>1 dia (24 horas)</option>
              <option value={3}>3 dias (72 horas)</option>
              <option value={7}>7 dias (1 semana) - Recomendado</option>
              <option value={14}>14 dias (2 semanas)</option>
              <option value={30}>30 dias (1 mês)</option>
            </select>
            <small style={{ color: 'var(--neutral-gray)', fontSize: '0.9rem' }}>
              Tempo disponível para a comunidade votar. Recomendado: 7 dias.
            </small>
          </div>

          <div className="urna-alert urna-alert-warning">
            <strong>⚠️ Atenção - Responsabilidades do Proponente:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Verifique todos os dados antes de submeter</li>
              <li>A proposta não poderá ser editada após criação</li>
              <li>Taxa de gas será cobrada para registrar na blockchain</li>
              <li>Apenas propostas sérias e relevantes devem ser criadas</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="urna-btn urna-btn-primary"
              style={{ flex: 1, fontSize: '1.1rem', padding: '15px' }}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner" style={{ display: 'inline-block', width: '20px', height: '20px', marginRight: '10px' }}></div>
                  Registrando na Blockchain...
                </>
              ) : (
                '📊 Registrar Proposta Oficial'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setFormData({ title: '', description: '', votingPeriod: 7 });
                setError('');
                setSuccess('');
              }}
              className="urna-btn urna-btn-secondary"
              style={{ minWidth: '140px' }}
            >
              🗑️ Limpar Formulário
            </button>
          </div>
        </form>

        <div style={{ 
          marginTop: '25px', 
          padding: '15px', 
          background: 'var(--light-gray)', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h5 style={{ color: 'var(--primary-blue)', marginBottom: '10px' }}>
            📊 Como Funciona o Processo de Votação
          </h5>
          <ol style={{ marginLeft: '20px', fontSize: '0.9rem', color: 'var(--neutral-gray)' }}>
            <li><strong>Registro:</strong> Proposta é registrada na blockchain Sepolia</li>
            <li><strong>Votação:</strong> Período de votação inicia automaticamente</li>
            <li><strong>Participação:</strong> Comunidade vota "Sim" ou "Não"</li>
            <li><strong>Encerramento:</strong> Após período, proposta pode ser executada</li>
            <li><strong>Transparência:</strong> Resultado fica registrado permanentemente</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CreateProposal;
