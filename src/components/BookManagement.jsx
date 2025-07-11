import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks, deleteBook, updateBook } from '../redux/booksSlice';
import './BookManagement.css';
import './theme-components.css';

const BookManagement = () => {
  const dispatch = useDispatch();
  const { catalog, loading } = useSelector(state => state.books);
  const [editingBook, setEditingBook] = useState(null);
  const [editCopies, setEditCopies] = useState({ totalCopies: 0, availableCopies: 0 });

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo libro dal catalogo?')) {
      try {
        await dispatch(deleteBook(bookId));
        dispatch(fetchBooks());
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
      }
    }
  };

  const handleEditCopies = (book) => {
    setEditingBook(book.id);
    setEditCopies({
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies
    });
  };

  const handleSaveCopies = async (bookId) => {
    try {
      const bookToUpdate = catalog.find(book => book.id === bookId);
      const updatedBook = {
        ...bookToUpdate,
        totalCopies: parseInt(editCopies.totalCopies),
        availableCopies: parseInt(editCopies.availableCopies)
      };
      
      await dispatch(updateBook({ id: bookId, book: updatedBook }));
      setEditingBook(null);
      dispatch(fetchBooks());
    } catch (error) {
      console.error('Errore durante l\'aggiornamento:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setEditCopies({ totalCopies: 0, availableCopies: 0 });
  };

  if (loading) {
    return <div className="loading">Caricamento libri...</div>;
  }

  return (
    <div className="book-management">
      <h2>Gestione Catalogo Libri</h2>
      <div className="books-grid">
        {catalog.map(book => (
          <div key={book.id} className="book-management-card">
            <div className="book-info">
              <img 
                src={book.thumbnail || 'https://via.placeholder.com/150x200'} 
                alt={book.title}
                className="book-thumbnail"
              />
              <div className="book-details">
                <h3>{book.title}</h3>
                <p className="book-authors">{book.authors?.join(', ')}</p>
                <div className="book-copies">
                  {editingBook === book.id ? (
                    <div className="edit-copies">
                      <div className="copy-input">
                        <label>Copie totali:</label>
                        <input
                          type="number"
                          min="0"
                          value={editCopies.totalCopies}
                          onChange={(e) => setEditCopies({
                            ...editCopies,
                            totalCopies: e.target.value
                          })}
                        />
                      </div>
                      <div className="copy-input">
                        <label>Copie disponibili:</label>
                        <input
                          type="number"
                          min="0"
                          max={editCopies.totalCopies}
                          value={editCopies.availableCopies}
                          onChange={(e) => setEditCopies({
                            ...editCopies,
                            availableCopies: e.target.value
                          })}
                        />
                      </div>
                      <div className="edit-buttons">
                        <button 
                          onClick={() => handleSaveCopies(book.id)}
                          className="save-btn"
                        >
                          Salva
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="cancel-btn"
                        >
                          Annulla
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="copy-display">
                      <span className="copy-info">
                        Totali: {book.totalCopies} | Disponibili: {book.availableCopies}
                      </span>
                      <span className="copy-info">
                        In prestito: {book.totalCopies - book.availableCopies}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="book-actions">
              {editingBook === book.id ? null : (
                <>
                  <button 
                    onClick={() => handleEditCopies(book)}
                    className="edit-btn"
                  >
                    Modifica Copie
                  </button>
                  <button 
                    onClick={() => handleDeleteBook(book.id)}
                    className="delete-btn"
                  >
                    Elimina Libro
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookManagement;