import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'
import BorrowModal from '../components/BorrowModal'
import { fetchBookReviews, deleteExistingReview } from '../redux/reviewsSlice'

function BookDetail() {
  const { id } = useParams()
  const { catalog } = useSelector(state => state.books)
  const { bookReviews } = useSelector(state => state.reviews)
  const { isAuthenticated, currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [editingReview, setEditingReview] = useState(null)

  const book = catalog.find(book => book.id === id)
  const reviews = bookReviews[id] || []
  const userReview = reviews.find(review => review.userId === currentUser?.id)

  useEffect(() => {
    if (id) {
      dispatch(fetchBookReviews(id))
    }
  }, [dispatch, id])

  if (!book) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Libro non trovato
        </Alert>
        <Button as={Link} to="/books" variant="primary">
          Torna al Catalogo
        </Button>
      </Container>
    )
  }

  const handleEditReview = (review) => {
    setEditingReview(review)
    setShowReviewForm(true)
  }

  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteExistingReview(reviewId, id))
  }

  const handleCloseReviewForm = () => {
    setShowReviewForm(false)
    setEditingReview(null)
  }

  const averageRating = reviews.length > 0 ? 
    (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img 
              variant="top" 
              src={book.thumbnail}
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </Card>
        </Col>
        
        <Col md={8}>
          <h1>{book.title}</h1>
          <p className="lead">di {book.authors.join(', ')}</p>
          
          <div className="mb-3">
            <Badge bg={book.availableCopies > 0 ? 'success' : 'danger'}>
              {book.availableCopies > 0 ? 'Disponibile' : 'Non disponibile'}
            </Badge>
            <span className="ms-2">
              {book.availableCopies}/{book.totalCopies} copie disponibili
            </span>
          </div>

          <p>{book.description}</p>

          {reviews.length > 0 && (
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="text-warning">
                  {'⭐'.repeat(Math.round(averageRating))}
                </span>
                <span><strong>{averageRating}</strong>/5</span>
                <span className="text-muted">({reviews.length} recensioni)</span>
              </div>
            </div>
          )}

          <div className="mb-3">
            <Button 
              variant="success" 
              size="lg"
              disabled={book.availableCopies === 0 || !isAuthenticated}
              className="me-2"
              onClick={() => setShowBorrowModal(true)}
            >
              {book.availableCopies > 0 ? 'Prendi in Prestito' : 'Non Disponibile'}
            </Button>
            
            {!isAuthenticated && (
              <small className="text-muted">
                <Link to="/login">Accedi</Link> per prendere in prestito
              </small>
            )}
          </div>

          <Button as={Link} to="/books" variant="outline-primary">
            ← Torna al Catalogo
          </Button>
        </Col>
      </Row>

      {/* Sezione Recensioni */}
      <Row className="mt-5">
        <Col>
          <h3>Recensioni</h3>
          
          {isAuthenticated && (
            <div className="mb-4">
              {userReview ? (
                <Alert variant="info">
                  Hai già recensito questo libro. 
                  <Button 
                    variant="link" 
                    className="p-0 ms-1"
                    onClick={() => handleEditReview(userReview)}
                  >
                    Modifica la tua recensione
                  </Button>
                </Alert>
              ) : (
                <Button 
                  variant="outline-primary"
                  onClick={() => setShowReviewForm(true)}
                >
                  Scrivi una Recensione
                </Button>
              )}
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-muted">Nessuna recensione disponibile. Sii il primo a recensire questo libro!</p>
          ) : (
            reviews.map(review => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                currentUserId={currentUser?.id}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))
          )}
        </Col>
      </Row>

      {/* Modal per Prestito */}
      <BorrowModal
        book={book}
        show={showBorrowModal}
        onHide={() => setShowBorrowModal(false)}
      />

      {/* Modal per Recensioni */}
      <ReviewForm
        book={book}
        show={showReviewForm}
        onHide={handleCloseReviewForm}
        existingReview={editingReview}
      />
    </Container>
  )
}

export default BookDetail