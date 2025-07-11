import { Container, Row, Col, Card, Button, Alert, Modal, Tabs, Tab } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import GoogleBooksSearch from '../components/GoogleBooksSearch'
import AdminLoanManagement from '../components/AdminLoanManagement'
import BookManagement from '../components/BookManagement'
import UserManagement from '../components/UserManagement'
import { fetchBooks } from '../redux/booksSlice'
import { fetchAllLoans } from '../redux/loansSlice'

function AdminDashboard() {
  const { isAuthenticated, currentUser } = useSelector(state => state.user)
  const { allLoans, loading, error } = useSelector(state => state.loans)
  const { catalog } = useSelector(state => state.books)
  const dispatch = useDispatch()
  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const [activeTab, setActiveTab] = useState('loans')

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'admin') {
      dispatch(fetchAllLoans())
    }
  }, [dispatch, isAuthenticated, currentUser?.role])

  if (!isAuthenticated || currentUser?.role !== 'admin') {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Accesso Negato</Alert.Heading>
          <p>Solo gli amministratori possono accedere a questa pagina.</p>
          <Button as={Link} to="/" variant="primary">
            Torna alla Home
          </Button>
        </Alert>
      </Container>
    )
  }

  if (loading) return <div className="text-center mt-4">Caricamento...</div>
  if (error) return <div className="text-center mt-4 text-danger">Errore: {error}</div>

  const activeLoans = allLoans.filter(loan => loan.status === 'active')
  const overdueLoans = activeLoans.filter(loan => new Date(loan.dueDate) < new Date())
  const renewalRequests = activeLoans.filter(loan => loan.renewalRequested)

  const handleBookAdded = (newBook) => {
    dispatch(fetchBooks()) // Ricarica il catalogo
    setShowAddBookModal(false)
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="mb-4">🔧 Dashboard Amministratore</h1>
          <p className="lead">Benvenuto {currentUser?.name}, ecco il pannello di controllo:</p>
        </Col>
      </Row>

      {/* Statistiche */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <Card.Title>Prestiti Attivi</Card.Title>
              <h2>{activeLoans.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-danger text-white">
            <Card.Body>
              <Card.Title>Prestiti Scaduti</Card.Title>
              <h2>{overdueLoans.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-warning text-white">
            <Card.Body>
              <Card.Title>Richieste Rinnovo</Card.Title>
              <h2>{renewalRequests.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-success text-white">
            <Card.Body>
              <Card.Title>Libri Totali</Card.Title>
              <h2>{catalog.length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Azioni Rapide */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h4>Azioni Rapide</h4>
            </Card.Header>
            <Card.Body>
              <Button 
                variant="primary" 
                className="me-2 mb-2"
                onClick={() => setShowAddBookModal(true)}
              >
                Aggiungi Nuovo Libro
              </Button>
              <Button 
                variant="info" 
                className="me-2 mb-2"
                onClick={() => setActiveTab('users')}
              >
                Gestisci Utenti
              </Button>
              <Button 
                variant="warning" 
                className="me-2 mb-2"
                onClick={() => setActiveTab('loans')}
              >
                Approva Rinnovi
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gestione Avanzata */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h4>Gestione Sistema</h4>
            </Card.Header>
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
                <Tab eventKey="loans" title="Gestione Prestiti">
                  <AdminLoanManagement />
                </Tab>
                
                <Tab eventKey="books" title="Gestione Libri">
                  <BookManagement />
                </Tab>
                
                <Tab eventKey="users" title="Gestione Utenti">
                  <UserManagement />
                </Tab>
                
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal per Aggiungere Libri */}
      <Modal 
        show={showAddBookModal} 
        onHide={() => setShowAddBookModal(false)}
        size="xl"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi Libro al Catalogo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GoogleBooksSearch onBookAdded={handleBookAdded} />
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default AdminDashboard