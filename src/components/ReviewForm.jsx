import { useState } from 'react'
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { createReview, updateReview } from '../services/localAPI'
import { fetchBookReviews } from '../redux/reviewsSlice'

function ReviewForm({ book, show, onHide, existingReview = null }) {
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    body: existingReview?.body || ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const isEditing = !!existingReview

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (formData.rating === 0) {
      newErrors.rating = 'Seleziona una valutazione'
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Il titolo è richiesto'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Il titolo non può superare 100 caratteri'
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'La recensione è richiesta'
    } else if (formData.body.length > 500) {
      newErrors.body = 'La recensione non può superare 500 caratteri'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    
    try {
      const reviewData = {
        ...formData,
        userId: currentUser.id,
        bookId: book.id
      }

      if (isEditing) {
        await updateReview(existingReview.id, reviewData)
      } else {
        await createReview(reviewData)
      }

      // Ricarica le recensioni del libro
      dispatch(fetchBookReviews(book.id))
      
      onHide()
      
      // Reset form se è una nuova recensione
      if (!isEditing) {
        setFormData({ rating: 0, title: '', body: '' })
      }
    } catch (error) {
      setErrors({ general: error.message || 'Errore nel salvare la recensione' })
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    return (
      <div className="d-flex gap-2 align-items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <Button
            key={star}
            variant={formData.rating >= star ? 'warning' : 'outline-warning'}
            size="sm"
            onClick={() => handleChange('rating', star)}
            type="button"
          >
            ⭐
          </Button>
        ))}
        <span className="ms-2 text-muted">
          {formData.rating > 0 ? `${formData.rating}/5 stelle` : 'Nessuna valutazione'}
        </span>
      </div>
    )
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? 'Modifica Recensione' : 'Scrivi una Recensione'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errors.general && (
            <Alert variant="danger">
              {errors.general}
            </Alert>
          )}
          
          <Row className="mb-3">
            <Col md={4}>
              <img 
                src={book?.thumbnail} 
                alt={book?.title}
                className="img-fluid rounded"
                style={{ maxHeight: '150px', objectFit: 'cover' }}
              />
            </Col>
            <Col md={8}>
              <h5>{book?.title}</h5>
              <p className="text-muted">di {book?.authors?.join(', ')}</p>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Valutazione *</Form.Label>
            {renderStars()}
            {errors.rating && (
              <Form.Text className="text-danger d-block">
                {errors.rating}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Titolo recensione *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Un titolo accattivante per la tua recensione..."
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              isInvalid={!!errors.title}
              maxLength={100}
            />
            <Form.Text className="text-muted">
              {formData.title.length}/100 caratteri
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Recensione *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Condividi la tua opinione su questo libro..."
              value={formData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              isInvalid={!!errors.body}
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {formData.body.length}/500 caratteri
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.body}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Annulla
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 
              (isEditing ? 'Aggiornando...' : 'Pubblicando...') : 
              (isEditing ? 'Aggiorna Recensione' : 'Pubblica Recensione')
            }
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ReviewForm