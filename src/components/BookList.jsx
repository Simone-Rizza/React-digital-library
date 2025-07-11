import { Row, Col, Alert, Spinner } from 'react-bootstrap'
import BookCard from './BookCard'

function BookList({ books, loading, error, onBorrow }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
        <p className="mt-2">Caricamento libri...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Errore nel caricamento</Alert.Heading>
        <p>{error}</p>
      </Alert>
    )
  }

  if (!books || books.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>Nessun libro trovato</Alert.Heading>
        <p>Non ci sono libri che corrispondono ai tuoi criteri di ricerca.</p>
      </Alert>
    )
  }

  return (
    <Row className="g-4">
      {books.map(book => (
        <Col key={book.id} sm={6} md={4} lg={3}>
          <BookCard book={book} onBorrow={onBorrow} />
        </Col>
      ))}
    </Row>
  )
}

export default BookList