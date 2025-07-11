import { Card, Button, Badge, Row, Col } from 'react-bootstrap'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ReturnModal from './ReturnModal'
import { requestRenewal } from '../services/localAPI'
import { fetchUserLoans } from '../redux/loansSlice'
import './LoanCard.css'

function LoanCard({ loan, onRenew, onReturn }) {
  const { catalog } = useSelector(state => state.books)
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [renewalLoading, setRenewalLoading] = useState(false)
  
  const book = catalog.find(b => b.id === loan.bookId)
  const isOverdue = new Date(loan.dueDate) < new Date()
  const daysUntilDue = Math.ceil((new Date(loan.dueDate) - new Date()) / (1000 * 60 * 60 * 24))

  const handleRenewal = async () => {
    setRenewalLoading(true)
    try {
      await requestRenewal(loan.id)
      dispatch(fetchUserLoans(currentUser.id))
      onRenew && onRenew(loan)
    } catch (error) {
      console.error('Errore rinnovo:', error)
    } finally {
      setRenewalLoading(false)
    }
  }

  return (
    <Card className={`mb-3 ${isOverdue ? 'border-danger' : ''}`}>
      <Card.Body>
        <Row>
          <Col md={3}>
            {book && (
              <img 
                src={book.thumbnail} 
                alt={book.title}
                className="img-fluid rounded"
                style={{ maxHeight: '120px', objectFit: 'cover' }}
              />
            )}
          </Col>
          
          <Col md={6}>
            <Card.Title className="h5">
              {book ? book.title : `Libro ID: ${loan.bookId}`}
            </Card.Title>
            {book && (
              <Card.Text className="text-muted mb-2">
                di {book.authors.join(', ')}
              </Card.Text>
            )}
            
            <div className="mb-2">
              <small className="text-muted">
                <strong>Prestito:</strong> {new Date(loan.loanDate).toLocaleDateString('it-IT')}
              </small>
              <br />
              <small className="text-muted">
                <strong>Scadenza:</strong> {new Date(loan.dueDate).toLocaleDateString('it-IT')}
              </small>
            </div>
            
            <div className="mb-2">
              <Badge bg={isOverdue ? 'danger' : (daysUntilDue <= 3 ? 'warning' : 'success')}>
                {isOverdue ? 
                  `Scaduto da ${Math.abs(daysUntilDue)} giorni` : 
                  `Scade tra ${daysUntilDue} giorni`
                }
              </Badge>
              
              {loan.renewalRequested && (
                <Badge bg="info" className="ms-2">
                  Rinnovo Richiesto
                </Badge>
              )}
            </div>
          </Col>
          
          <Col md={3} className="text-end">
            <div className="d-grid gap-2">
              <Button 
                variant="warning" 
                size="sm"
                disabled={loan.renewalRequested || renewalLoading}
                onClick={handleRenewal}
              >
                {renewalLoading ? 'Richiedendo...' : 
                 loan.renewalRequested ? 'Rinnovo Richiesto' : 'Richiedi Rinnovo'}
              </Button>
              
              <Button 
                variant="success" 
                size="sm"
                className="btn-success-badge"
                onClick={() => setShowReturnModal(true)}
              >
                Restituisci
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
      
      <ReturnModal
        loan={loan}
        book={book}
        show={showReturnModal}
        onHide={() => setShowReturnModal(false)}
        onSuccess={() => onReturn && onReturn(loan)}
      />
    </Card>
  )
}

export default LoanCard