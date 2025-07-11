import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Home() {
  const { isAuthenticated, currentUser } = useSelector(state => state.user)

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="text-center mb-4">📚 Biblioteca Digitale</h1>
          <p className="text-center lead mb-4">
            Benvenuto nella nostra biblioteca digitale
          </p>
        </Col>
      </Row>
      
      <Row className="g-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>📖 Catalogo Libri</Card.Title>
              <Card.Text>
                Esplora la nostra collezione di libri disponibili
              </Card.Text>
              <Button as={Link} to="/books" variant="primary">
                Sfoglia Catalogo
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>📝 I Miei Prestiti</Card.Title>
              <Card.Text>
                Gestisci i tuoi prestiti attivi e la cronologia
              </Card.Text>
              <Button 
                as={Link} 
                to="/my-loans" 
                variant="success"
                disabled={!isAuthenticated}
              >
                Vedi Prestiti
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>👤 Profilo</Card.Title>
              <Card.Text>
                {isAuthenticated ? `Ciao, ${currentUser?.name}!` : 'Accedi al tuo account'}
              </Card.Text>
              <Button 
                as={Link} 
                to={isAuthenticated ? "/profile" : "/login"} 
                variant="info"
              >
                {isAuthenticated ? 'Profilo' : 'Accedi'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {currentUser?.role === 'admin' && (
        <Row className="mt-4">
          <Col>
            <Card className="border-warning">
              <Card.Body>
                <Card.Title>🔧 Dashboard Admin</Card.Title>
                <Card.Text>
                  Gestisci prestiti, utenti e catalogo biblioteca
                </Card.Text>
                <Button as={Link} to="/admin" variant="warning">
                  Vai alla Dashboard
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default Home