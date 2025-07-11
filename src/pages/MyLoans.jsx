import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LoanCard from '../components/LoanCard'
import LoanHistory from '../components/LoanHistory'
import { fetchUserLoans } from '../redux/loansSlice'

function MyLoans() {
  const { isAuthenticated, currentUser } = useSelector(state => state.user)
  const { userLoans, loading, error } = useSelector(state => state.loans)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated && currentUser?.id) {
      dispatch(fetchUserLoans(currentUser.id))
    }
  }, [dispatch, isAuthenticated, currentUser?.id])

  if (!isAuthenticated) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>Accesso Richiesto</Alert.Heading>
          <p>Devi effettuare l'accesso per vedere i tuoi prestiti.</p>
          <Button as={Link} to="/login" variant="primary">
            Vai al Login
          </Button>
        </Alert>
      </Container>
    )
  }

  if (loading) return <div className="text-center mt-4">Caricamento...</div>
  if (error) return <div className="text-center mt-4 text-danger">Errore: {error}</div>

  const activeLoans = userLoans.filter(loan => loan.status === 'active')

  const handleRenew = (loan) => {
    console.log('Richiesta rinnovo per:', loan.id)
    // TODO: Implementare logica rinnovo
  }

  const handleReturn = (loan) => {
    console.log('Restituzione libro:', loan.id)
    // TODO: Implementare logica restituzione
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="mb-4">📝 I Miei Prestiti</h1>
          <p className="lead">Ciao {currentUser?.name}, ecco i tuoi prestiti:</p>
        </Col>
      </Row>

      {/* Prestiti Attivi */}
      <Row>
        <Col>
          <h3>Prestiti Attivi</h3>
          {activeLoans.length === 0 ? (
            <Alert variant="info">
              Non hai prestiti attivi. <Link to="/books">Esplora il catalogo</Link> per prendere in prestito un libro!
            </Alert>
          ) : (
            activeLoans.map(loan => (
              <LoanCard 
                key={loan.id}
                loan={loan}
                onRenew={handleRenew}
                onReturn={handleReturn}
              />
            ))
          )}
        </Col>
      </Row>

      {/* Cronologia Prestiti */}
      <Row className="mt-5">
        <Col>
          <LoanHistory userId={currentUser?.id} skipDataFetch={true} />
        </Col>
      </Row>
    </Container>
  )
}

export default MyLoans