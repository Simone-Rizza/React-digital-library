import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUsers, toggleUserStatus } from '../redux/userSlice';
import LoanHistory from './LoanHistory';
import './UserManagement.css';
import './theme-components.css';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { allUsers, loading } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleToggleStatus = async (userId, currentStatus) => {
    if (window.confirm(`Sei sicuro di voler ${currentStatus ? 'disabilitare' : 'abilitare'} questo utente?`)) {
      try {
        await dispatch(toggleUserStatus(userId, !currentStatus));
        dispatch(fetchAllUsers());
      } catch (error) {
        console.error('Errore durante l\'aggiornamento stato utente:', error);
      }
    }
  };

  const filteredUsers = allUsers?.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const activeUsers = filteredUsers.filter(user => user.enabled !== false);
  const disabledUsers = filteredUsers.filter(user => user.enabled === false);

  if (loading) {
    return <div className="loading">Caricamento utenti...</div>;
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>Gestione Utenti</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Cerca utenti per nome o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="user-stats">
        <div className="stat-card active">
          <h3>{activeUsers.length}</h3>
          <p>Utenti Attivi</p>
        </div>
        <div className="stat-card disabled">
          <h3>{disabledUsers.length}</h3>
          <p>Utenti Disabilitati</p>
        </div>
        <div className="stat-card total">
          <h3>{filteredUsers.length}</h3>
          <p>Totale Utenti</p>
        </div>
      </div>

      <div className="users-sections">
        <div className="users-section">
          <h3 className="section-title active">👥 Utenti Attivi ({activeUsers.length})</h3>
          <div className="users-grid">
            {activeUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="user-details">
                    <h4>{user.name}</h4>
                    <p className="user-email">{user.email}</p>
                    <div className="user-meta">
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 Utente'}
                      </span>
                      <span className="status-badge enabled">
                        ✅ Attivo
                      </span>
                    </div>
                  </div>
                </div>
                <div className="user-actions">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleToggleStatus(user.id, true)}
                      className="action-btn disable-btn"
                      title="Disabilita utente"
                    >
                      🚫 Disabilita
                    </button>
                  )}
                  <button 
                    className="action-btn view-btn" 
                    title="Visualizza cronologia prestiti"
                    onClick={() => setSelectedUser(user)}
                  >
                    📚 Cronologia
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {disabledUsers.length > 0 && (
          <div className="users-section">
            <h3 className="section-title disabled">🚫 Utenti Disabilitati ({disabledUsers.length})</h3>
            <div className="users-grid">
              {disabledUsers.map(user => (
                <div key={user.id} className="user-card disabled">
                  <div className="user-info">
                    <div className="user-avatar disabled">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="user-details">
                      <h4>{user.name}</h4>
                      <p className="user-email">{user.email}</p>
                      <div className="user-meta">
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'admin' ? '👑 Admin' : '👤 Utente'}
                        </span>
                        <span className="status-badge disabled">
                          ❌ Disabilitato
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button
                      onClick={() => handleToggleStatus(user.id, false)}
                      className="action-btn enable-btn"
                      title="Abilita utente"
                    >
                      ✅ Abilita
                    </button>
                    <button 
                      className="action-btn view-btn" 
                      title="Visualizza cronologia prestiti"
                      onClick={() => setSelectedUser(user)}
                    >
                      📚 Cronologia
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="no-users">
          <p>Nessun utente trovato</p>
        </div>
      )}

      {/* Modal Cronologia Prestiti Utente */}
      {selectedUser && (
        <div className="user-history-modal">
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📚 Cronologia Prestiti - {selectedUser.name}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedUser(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <LoanHistory userId={selectedUser.id} isAdminView={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;