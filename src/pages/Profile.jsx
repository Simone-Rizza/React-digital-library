import { Container, Row, Col, Card, Button, Alert, Badge, Tabs, Tab } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProfileForm from '../components/ProfileForm'
import LoanHistory from '../components/LoanHistory'
import ReviewForm from '../components/ReviewForm'
import { fetchUserLoans } from '../redux/loansSlice'
import { fetchUserReviews } from '../redux/reviewsSlice'
import { deleteReview } from '../services/localAPI'
import '../components/LoanCard.css'

function Profile() {
  const { isAuthenticated, currentUser } = useSelector(state => state.user)
  const { userLoans } = useSelector(state => state.loans)
  const { userReviews } = useSelector(state => state.reviews)
  const { catalog } = useSelector(state => state.books)
  const dispatch = useDispatch()
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    if (isAuthenticated && currentUser?.id) {
      dispatch(fetchUserLoans(currentUser.id))
      dispatch(fetchUserReviews(currentUser.id))
    }
  }, [dispatch, isAuthenticated, currentUser?.id])

  if (!isAuthenticated) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>Accesso Richiesto</Alert.Heading>
          <p>Devi effettuare l'accesso per vedere il tuo profilo.</p>
          <Button as={Link} to="/login" variant="primary">
            Vai al Login
          </Button>
        </Alert>
      </Container>
    )
  }

  const activeLoans = userLoans.filter(loan => loan.status === 'active')
  
  const getBookDetails = (bookId) => {
    return catalog.find(book => book.id === bookId) || {
      title: 'Libro non trovato',
      authors: ['Autore sconosciuto']
    }
  }
  const completedLoans = userLoans.filter(loan => loan.status === 'completed')
  const overdueLoans = activeLoans.filter(loan => new Date(loan.dueDate) < new Date())

  const handleEditReview = (review) => {
    const book = getBookDetails(review.bookId)
    setSelectedBook(book)
    setEditingReview(review)
    setShowReviewForm(true)
  }

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa recensione?')) {
      try {
        await deleteReview(reviewId)
        dispatch(fetchUserReviews(currentUser.id))
      } catch (error) {
        console.error('Errore nell\'eliminare la recensione:', error)
        alert('Errore nell\'eliminare la recensione')
      }
    }
  }

  const handleReviewFormClose = () => {
    setShowReviewForm(false)
    setEditingReview(null)
    setSelectedBook(null)
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          {/* Header Profilo */}
          <Card className="mb-4">
            <Card.Header>
              <h3>👤 Il Mio Profilo</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="text-center">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                      <h1 className="m-0">👤</h1>
                    </div>
                    <h4 className="mt-3">{currentUser?.name}</h4>
                    <Badge bg={currentUser?.role === 'admin' ? 'warning' : 'info'}>
                      {currentUser?.role === 'admin' ? 'Amministratore' : 'Utente'}
                    </Badge>
                  </div>
                </Col>
                
                <Col md={8}>
                  <h5>Informazioni Personali</h5>
                  <p><strong>Nome:</strong> {currentUser?.name}</p>
                  <p><strong>Email:</strong> {currentUser?.email}</p>
                  <p><strong>ID Utente:</strong> {currentUser?.id}</p>
                  
                  <div className="mt-4">
                    <Button 
                      variant="primary" 
                      className="me-2 mb-2"
                      onClick={() => setShowProfileForm(true)}
                    >
                      ✏️ Modifica Profilo
                    </Button>
                    <Button as={Link} to="/my-loans" variant="success" className="btn-success-badge me-2 mb-2">
                      📝 I Miei Prestiti
                    </Button>
                    {currentUser?.role === 'admin' && (
                      <Button as={Link} to="/admin" variant="warning" className="mb-2">
                        🔧 Dashboard Admin
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Statistiche */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="bg-primary text-white">
                <Card.Body className="text-center">
                  <h3>{activeLoans.length}</h3>
                  <p className="mb-0">Prestiti Attivi</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-success text-white">
                <Card.Body className="text-center">
                  <h3>{completedLoans.length}</h3>
                  <p className="mb-0">Prestiti Completati</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-info text-white">
                <Card.Body className="text-center">
                  <h3>{userReviews.length}</h3>
                  <p className="mb-0">Recensioni Scritte</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className={`${overdueLoans.length > 0 ? 'bg-danger' : 'bg-secondary'} text-white`}>
                <Card.Body className="text-center">
                  <h3>{overdueLoans.length}</h3>
                  <p className="mb-0">Prestiti Scaduti</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Prestiti in Scadenza */}
          {activeLoans.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5>📅 Prestiti Attivi</h5>
              </Card.Header>
              <Card.Body>
                {activeLoans.slice(0, 3).map(loan => {
                  const daysUntilDue = Math.ceil((new Date(loan.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                  const isOverdue = daysUntilDue < 0
                  const book = getBookDetails(loan.bookId)
                  
                  return (
                    <div key={loan.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                      <div>
                        <strong>{book.title}</strong>
                        <br />
                        <small className="text-muted">
                          di {book.authors?.join(', ')}
                        </small>
                        <br />
                        <small className="text-muted">
                          Scadenza: {new Date(loan.dueDate).toLocaleDateString('it-IT')}
                        </small>
                      </div>
                      <Badge bg={isOverdue ? 'danger' : (daysUntilDue <= 3 ? 'warning' : 'success')}>
                        {isOverdue ? 
                          `Scaduto da ${Math.abs(daysUntilDue)} giorni` : 
                          `Scade tra ${daysUntilDue} giorni`
                        }
                      </Badge>
                    </div>
                  )
                })}
                
                {activeLoans.length > 3 && (
                  <div className="text-center mt-3">
                    <Button as={Link} to="/my-loans" variant="outline-primary" size="sm">
                      Vedi tutti i prestiti ({activeLoans.length})
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Tabs per Cronologia e Recensioni */}
          <Card>
            <Card.Header>
              <h5>📊 I Tuoi Dati</h5>
            </Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey="history" className="mb-3">
                <Tab eventKey="history" title="📚 Cronologia Prestiti">
                  <LoanHistory />
                </Tab>
                
                <Tab eventKey="reviews" title="⭐ Le Tue Recensioni">
                  {userReviews.length > 0 ? (
                    <div>
                      {userReviews.map(review => {
                        const book = getBookDetails(review.bookId)
                        return (
                          <div key={review.id} className="mb-3 p-3 border rounded">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-2">
                                  <h6 className="mb-0 me-2">{review.title}</h6>
                                  <small className="text-muted">
                                    per "{book.title}"
                                  </small>
                                </div>
                                <div className="text-warning mb-2">
                                  {'⭐'.repeat(review.rating)}
                                </div>
                                <p className="mb-0 text-muted">
                                  {review.body}
                                </p>
                                <small className="text-muted">
                                  {new Date(review.date).toLocaleDateString('it-IT')}
                                </small>
                              </div>
                              <div className="d-flex flex-column gap-1 ms-3">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleEditReview(review)}
                                  title="Modifica recensione"
                                >
                                  ✏️
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDeleteReview(review.id)}
                                  title="Elimina recensione"
                                >
                                  🗑️
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">Non hai ancora scritto recensioni.</p>
                      <Button as={Link} to="/books" variant="primary">
                        Sfoglia il Catalogo
                      </Button>
                    </div>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Modifica Profilo */}
      <ProfileForm
        show={showProfileForm}
        onHide={() => setShowProfileForm(false)}
      />

      {/* Modal Modifica Recensione */}
      {selectedBook && (
        <ReviewForm
          book={selectedBook}
          show={showReviewForm}
          onHide={handleReviewFormClose}
          existingReview={editingReview}
        />
      )}
    </Container>
  )
}

export default Profile