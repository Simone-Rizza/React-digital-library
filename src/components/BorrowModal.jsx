import { Modal, Button, Alert, Form } from 'react-bootstrap'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createLoan } from '../services/localAPI'
import { fetchBooks } from '../redux/booksSlice'
import { fetchUserLoans } from '../redux/loansSlice'
import './LoanCard.css'

function BorrowModal({ book, show, onHide, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleBorrow = async () => {
    setLoading(true)
    setError('')

    try {
      const loanData = {
        userId: currentUser.id,
        bookId: book.id
      }

      await createLoan(loanData)
      
      // Aggiorna il libro diminuendo le copie disponibili
      const updatedBook = {
        ...book,
        availableCopies: book.availableCopies - 1
      }
      
      const { updateBook } = await import('../services/localAPI')
      await updateBook(book.id, updatedBook)

      // Ricarica i dati
      dispatch(fetchBooks())
      dispatch(fetchUserLoans(currentUser.id))
      
      onSuccess && onSuccess()
      onHide()
    } catch (err) {
      setError(err.message || 'Errore durante il prestito')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Conferma Prestito</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger">
            {error}
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
        
        <Alert variant="info">
          <h6>Condizioni del prestito:</h6>
          <ul className="mb-0">
            <li>Durata: 30 giorni dalla data odierna</li>
            <li>Possibilità di rinnovo (soggetto ad approvazione)</li>
            <li>Penale per ritardo nella restituzione</li>
          </ul>
        </Alert>
        
        <Form.Check 
          type="checkbox" 
          id="terms-checkbox"
          label="Accetto i termini e condizioni del prestito"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          required
        />
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Annulla
        </Button>
        <Button 
          variant="success" 
          className="btn-success-badge"
          onClick={handleBorrow}
          disabled={loading || !termsAccepted}
        >
          {loading ? 'Processando...' : 'Conferma Prestito'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BorrowModal