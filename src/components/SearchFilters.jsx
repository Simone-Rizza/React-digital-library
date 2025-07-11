import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap'
import { useState } from 'react'

function SearchFilters({ onSearch, onFilter, onReset, catalog = [] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    availability: '',
    genre: '',
    year: ''
  })

  // Estrai generi unici dal catalogo
  const uniqueGenres = [...new Set(
    catalog.flatMap(book => book.categories || [])
  )].sort()

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch && onSearch(value)
  }

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilter && onFilter(newFilters)
  }

  const handleReset = () => {
    setSearchTerm('')
    setFilters({ availability: '', genre: '', year: '' })
    onReset && onReset()
  }

  return (
    <div className="mb-4">
      <Row className="g-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Cerca per titolo o autore..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        
        <Col md={3}>
          <Form.Select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
          >
            <option value="">Tutti i libri</option>
            <option value="available">Solo disponibili</option>
            <option value="unavailable">Solo in prestito</option>
          </Form.Select>
        </Col>
        
        <Col md={2}>
          <Form.Select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
          >
            <option value="">Tutti i generi</option>
            {uniqueGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </Form.Select>
        </Col>
        
        <Col md={1}>
          <Button variant="outline-secondary" onClick={handleReset} className="w-100">
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default SearchFilters