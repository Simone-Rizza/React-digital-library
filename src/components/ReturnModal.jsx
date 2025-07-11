import { Modal, Button, Alert, Form, Row, Col } from 'react-bootstrap'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { returnBook } from '../services/localAPI'
import { fetchBooks } from '../redux/booksSlice'
import { fetchUserLoans } from '../redux/loansSlice'
import './LoanCard.css'

function ReturnModal({ loan, book, show, onHide, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleReturn = async () => {
    setLoading(true)
    setError('')

    try {
      // Aggiorna il prestito come restituito
      await returnBook(loan.id)
      
      // Aumenta le copie disponibili del libro
      if (book) {
        const updatedBook = {
          ...book,
          availableCopies: book.availableCopies + 1
        }
        
        const { updateBook } = await import('../services/localAPI')
        await updateBook(book.id, updatedBook)
      }

      // Ricarica i dati
      dispatch(fetchBooks())
      dispatch(fetchUserLoans(currentUser.id))
      
      onSuccess && onSuccess()
      onHide()
    } catch (err) {
      setError(err.message || 'Errore durante la restituzione')
    } finally {
      setLoading(false)
    }
  }

  const isOverdue = loan && new Date(loan.dueDate) < new Date()
  const daysOverdue = isOverdue ? 
    Math.ceil((new Date() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24)) : 0

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Restituzione Libro</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}
        
        {isOverdue && (
          <Alert variant="warning">
            <strong>Attenzione!</strong> Questo libro è in ritardo di {daysOverdue} giorni.
            Potrebbe essere applicata una penale.
          </Alert>
        )}
        
        <div className="text-center mb-3">
          <img 
            src={book?.thumbnail} 
            alt={book?.title}
            style={{ maxWidth: '120px', height: 'auto' }}
            className="rounded"
          />
        </div>
        
        <h5 className="text-center">{book?.title}</h5>
        <p className="text-center text-muted">di {book?.authors?.join(', ')}</p>
        
        <div className="mb-3">
          <div className="mb-2">
            <strong>Data prestito:</strong> {loan && new Date(loan.loanDate).toLocaleDateString('it-IT')}
          </div>
          <div>
            <strong>Data scadenza:</strong> {loan && new Date(loan.dueDate).toLocaleDateString('it-IT')}
          </div>
        </div>
        
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Annulla
        </Button>
        <Button 
          variant="success" 
          className="btn-success-badge"
          onClick={handleReturn}
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Conferma Restituzione'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReturnModal