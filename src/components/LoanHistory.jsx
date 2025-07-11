import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserLoans } from '../redux/loansSlice';
import './LoanHistory.css';
import './theme-components.css';

const LoanHistory = ({ userId = null, isAdminView = false, skipDataFetch = false }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { userLoans, loading } = useSelector(state => state.loans);
  const { catalog } = useSelector(state => state.books);
  const [filter, setFilter] = useState('all');

  const targetUserId = userId || currentUser?.id;

  useEffect(() => {
    if (targetUserId && !skipDataFetch) {
      dispatch(fetchUserLoans(targetUserId));
    }
  }, [dispatch, targetUserId, skipDataFetch]);

  const getBookDetails = (bookId) => {
    return catalog.find(book => book.id === bookId) || {
      title: 'Libro non trovato',
      authors: ['Autore sconosciuto'],
      thumbnail: 'https://via.placeholder.com/150x200'
    };
  };

  const getStatusInfo = (loan) => {
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const isOverdue = loan.status === 'active' && dueDate < today;
    
    if (loan.status === 'completed') {
      return { status: 'completed', label: 'Restituito', className: 'completed' };
    } else if (isOverdue) {
      return { status: 'overdue', label: 'In ritardo', className: 'overdue' };
    } else if (loan.status === 'active') {
      return { status: 'active', label: 'Attivo', className: 'active' };
    }
    return { status: 'unknown', label: 'Sconosciuto', className: 'unknown' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredLoans = userLoans.filter(loan => {
    if (filter === 'all') return true;
    if (filter === 'active') return loan.status === 'active';
    if (filter === 'completed') return loan.status === 'completed';
    if (filter === 'overdue') {
      const today = new Date();
      const dueDate = new Date(loan.dueDate);
      return loan.status === 'active' && dueDate < today;
    }
    return true;
  });

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return new Date(b.loanDate) - new Date(a.loanDate);
  });

  if (loading) {
    return <div className="loading">Caricamento cronologia prestiti...</div>;
  }

  return (
    <div className="loan-history">
      <div className="loan-history-header">
        <h2>
          {isAdminView ? '📚 Cronologia Prestiti Utente' : '📚 La Mia Cronologia Prestiti'}
        </h2>
        <div className="loan-filters">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            Tutti ({userLoans.length})
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''} 
            onClick={() => setFilter('active')}
          >
            Attivi ({userLoans.filter(l => l.status === 'active').length})
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completati ({userLoans.filter(l => l.status === 'completed').length})
          </button>
          <button 
            className={filter === 'overdue' ? 'active' : ''} 
            onClick={() => setFilter('overdue')}
          >
            In Ritardo ({userLoans.filter(l => {
              const today = new Date();
              const dueDate = new Date(l.dueDate);
              return l.status === 'active' && dueDate < today;
            }).length})
          </button>
        </div>
      </div>

      {sortedLoans.length === 0 ? (
        <div className="no-loans">
          <p>
            {filter === 'all' 
              ? 'Nessun prestito trovato.' 
              : `Nessun prestito ${filter === 'active' ? 'attivo' : filter === 'completed' ? 'completato' : 'in ritardo'} trovato.`
            }
          </p>
        </div>
      ) : (
        <div className="loans-list">
          {sortedLoans.map(loan => {
            const book = getBookDetails(loan.bookId);
            const statusInfo = getStatusInfo(loan);
            const daysRemaining = getDaysRemaining(loan.dueDate);

            return (
              <div key={loan.id} className={`loan-item ${statusInfo.className}`}>
                <div className="loan-book-info">
                  <img 
                    src={book.thumbnail || 'https://via.placeholder.com/150x200'} 
                    alt={book.title}
                    className="loan-book-cover"
                  />
                  <div className="loan-book-details">
                    <h4>{book.title}</h4>
                    <p className="book-authors">{book.authors?.join(', ')}</p>
                    <div className="loan-dates">
                      <span>📅 Prestito: {formatDate(loan.loanDate)}</span>
                      <span>📅 Scadenza: {formatDate(loan.dueDate)}</span>
                      {loan.returnDate && (
                        <span>✅ Restituito: {formatDate(loan.returnDate)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="loan-status-info">
                  <div className={`status-badge ${statusInfo.className}`}>
                    {statusInfo.label}
                  </div>
                  
                  {loan.status === 'active' && daysRemaining !== null && (
                    <div className="days-remaining">
                      {daysRemaining > 0 ? (
                        <span className="days-left">📆 {daysRemaining} giorni rimanenti</span>
                      ) : daysRemaining === 0 ? (
                        <span className="due-today">⚠️ Scade oggi</span>
                      ) : (
                        <span className="overdue-days">🚨 {Math.abs(daysRemaining)} giorni di ritardo</span>
                      )}
                    </div>
                  )}

                  {loan.renewalRequested && (
                    <div className="renewal-status">
                      🔄 Rinnovo richiesto
                    </div>
                  )}

                  {loan.status === 'completed' && loan.returnDate && (
                    <div className="completion-info">
                      {(() => {
                        const loanDays = Math.ceil((new Date(loan.returnDate) - new Date(loan.loanDate)) / (1000 * 60 * 60 * 24));
                        const wasLate = new Date(loan.returnDate) > new Date(loan.dueDate);
                        return (
                          <span className={wasLate ? 'late-return' : 'on-time-return'}>
                            {wasLate ? '⏰ Restituito in ritardo' : '✅ Restituito in tempo'} 
                            ({loanDays} giorni)
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="loan-actions">
                  {isAdminView && loan.renewalRequested && (
                    <button className="action-btn approve-btn">
                      ✅ Approva Rinnovo
                    </button>
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

export default LoanHistory;