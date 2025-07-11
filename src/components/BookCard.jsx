import { Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import BorrowModal from './BorrowModal'

function BookCard({ book, onBorrow }) {
  const { isAuthenticated } = useSelector(state => state.user)
  const [showBorrowModal, setShowBorrowModal] = useState(false)

  return (
    <Card className="h-100 book-card">
      <Card.Img 
        variant="top" 
        src={book.thumbnail} 
        style={{ height: '200px', objectFit: 'cover' }}
        alt={book.title}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h5">{book.title}</Card.Title>
        <Card.Text className="text-muted mb-2">
          di {book.authors.join(', ')}
        </Card.Text>
        
        <div className="mb-2">
          <Badge bg={book.availableCopies > 0 ? 'success' : 'danger'}>
            {book.availableCopies > 0 ? 'Disponibile' : 'Non disponibile'}
          </Badge>
          <small className="text-muted ms-2">
            {book.availableCopies}/{book.totalCopies} copie
          </small>
        </div>

        <Card.Text className="flex-grow-1 small">
          {book.description ? 
            (book.description.length > 100 ? 
              `${book.description.substring(0, 100)}...` : 
              book.description
            ) : 
            'Nessuna descrizione disponibile'
          }
        </Card.Text>

        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Button 
              as={Link} 
              to={`/books/${book.id}`} 
              variant="outline-primary" 
              size="sm"
            >
              Vedi Dettagli
            </Button>
            
            <Button 
              variant="success" 
              size="sm"
              disabled={book.availableCopies === 0 || !isAuthenticated}
              onClick={() => setShowBorrowModal(true)}
            >
              {book.availableCopies === 0 ? 
                'Non Disponibile' : 
                (isAuthenticated ? 'Prendi in Prestito' : 'Accedi per prendere')
              }
            </Button>
          </div>
          
          {!isAuthenticated && (
            <small className="text-muted d-block text-center mt-2">
              <Link to="/login">Accedi</Link> per prendere in prestito
            </small>
          )}
        </div>
      </Card.Body>
      
      <BorrowModal
        book={book}
        show={showBorrowModal}
        onHide={() => setShowBorrowModal(false)}
        onSuccess={() => onBorrow && onBorrow(book)}
      />
    </Card>
  )
}

export default BookCard