import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { searchBooks } from '../services/googleBooksAPI'
import { addBook } from '../services/localAPI'

function GoogleBooksSearch({ onBookAdded }) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [addingBook, setAddingBook] = useState(null)
  const { currentUser } = useSelector(state => state.user)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const result = await searchBooks(query, 12)
      setSearchResults(result.books)
    } catch (err) {
      setError('Errore nella ricerca. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (googleBook, totalCopies) => {
    setAddingBook(googleBook.id)
    
    try {
      const bookData = {
        id: googleBook.id,
        title: googleBook.title,
        authors: googleBook.authors,
        description: googleBook.description,
        thumbnail: googleBook.thumbnail,
        totalCopies: parseInt(totalCopies),
        availableCopies: parseInt(totalCopies),
        addedBy: currentUser.id,
        dateAdded: new Date().toISOString().split('T')[0],
        categories: googleBook.categories,
        publishedDate: googleBook.publishedDate,
        publisher: googleBook.publisher,
        pageCount: googleBook.pageCount,
        isbn: googleBook.isbn
      }
      
      await addBook(bookData)
      onBookAdded && onBookAdded(bookData)
      
      // Rimuovi il libro dai risultati
      setSearchResults(prev => prev.filter(book => book.id !== googleBook.id))
    } catch (err) {
      setError('Errore nell\'aggiunta del libro')
    } finally {
      setAddingBook(null)
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h4>🔍 Cerca Libri su Google Books</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row className="g-3">
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      placeholder="Cerca libri per titolo, autore, ISBN..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      disabled={loading}
                    />
                  </Col>
                  <Col md={4}>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={loading || !query.trim()}
                      className="w-100"
                    >
                      {loading ? 'Cercando...' : 'Cerca'}
                    </Button>
                  </Col>
                </Row>
              </Form>

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading && (
        <Row className="mt-4">
          <Col className="text-center">
            <Spinner animation="border" />
            <p className="mt-2">Ricerca in corso...</p>
          </Col>
        </Row>
      )}

      {searchResults.length > 0 && (
        <Row className="mt-4">
          <Col>
            <h5>Risultati della ricerca ({searchResults.length})</h5>
            <Row className="g-3">
              {searchResults.map(book => (
                <Col md={6} lg={4} key={book.id}>
                  <Card className="h-100">
                    <Card.Img 
                      variant="top" 
                      src={book.thumbnail}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h6">{book.title}</Card.Title>
                      <Card.Text className="small text-muted">
                        {book.authors.join(', ')}
                      </Card.Text>
                      
                      {book.categories.length > 0 && (
                        <div className="mb-2">
                          {book.categories.slice(0, 2).map(category => (
                            <Badge key={category} bg="secondary" className="me-1">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Card.Text className="small flex-grow-1">
                        {book.description.length > 100 ? 
                          `${book.description.substring(0, 100)}...` : 
                          book.description
                        }
                      </Card.Text>

                      <div className="mt-auto">
                        <Form.Group className="mb-2">
                          <Form.Label className="small">Numero copie:</Form.Label>
                          <Form.Select 
                            size="sm" 
                            id={`copies-${book.id}`}
                            defaultValue="1"
                          >
                            <option value="1">1 copia</option>
                            <option value="2">2 copie</option>
                            <option value="3">3 copie</option>
                            <option value="5">5 copie</option>
                            <option value="10">10 copie</option>
                          </Form.Select>
                        </Form.Group>
                        
                        <Button 
                          variant="success" 
                          size="sm"
                          className="w-100"
                          disabled={addingBook === book.id}
                          onClick={() => {
                            const copies = document.getElementById(`copies-${book.id}`).value
                            handleAddBook(book, copies)
                          }}
                        >
                          {addingBook === book.id ? 'Aggiungendo...' : 'Aggiungi al Catalogo'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default GoogleBooksSearch