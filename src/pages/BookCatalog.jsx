import { Container, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import BookList from '../components/BookList'
import SearchFilters from '../components/SearchFilters'

function BookCatalog() {
  const { catalog, loading, error } = useSelector(state => state.books)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ availability: '', genre: '', year: '' })

  const filteredBooks = catalog.filter(book => {
    const matchesSearch = searchTerm === '' || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesAvailability = filters.availability === '' || 
      (filters.availability === 'available' && book.availableCopies > 0) ||
      (filters.availability === 'unavailable' && book.availableCopies === 0)
    
    const matchesGenre = filters.genre === '' || 
      book.categories?.some(category => category.toLowerCase().includes(filters.genre.toLowerCase()))
    
    return matchesSearch && matchesAvailability && matchesGenre
  })

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
  }

  const handleReset = () => {
    setSearchTerm('')
    setFilters({ availability: '', genre: '', year: '' })
  }

  const handleBorrow = (book) => {
    console.log('Prestito libro:', book.title)
    // TODO: Implementare logica prestito
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="mb-4">📚 Catalogo Libri</h1>
          
          <SearchFilters 
            onSearch={handleSearch}
            onFilter={handleFilter}
            onReset={handleReset}
            catalog={catalog}
          />

          <BookList 
            books={filteredBooks}
            loading={loading}
            error={error}
            onBorrow={handleBorrow}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default BookCatalog