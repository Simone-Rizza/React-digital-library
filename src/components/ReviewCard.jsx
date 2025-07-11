import { Card, Badge, Button, Dropdown } from 'react-bootstrap'
import { useState } from 'react'

function ReviewCard({ review, currentUserId, onEdit, onDelete }) {
  const isOwnReview = review.userId === currentUserId
  const [deleting, setDeleting] = useState(false)

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const handleDelete = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questa recensione?')) {
      setDeleting(true)
      try {
        await onDelete(review.id)
      } catch (error) {
        console.error('Errore eliminazione:', error)
      } finally {
        setDeleting(false)
      }
    }
  }

  return (
    <Card className={`mb-3 ${isOwnReview ? 'border-primary' : ''}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Card.Title className="h6 mb-1">{review.title}</Card.Title>
                <div className="mb-2">
                  <span className="text-warning me-2">
                    {renderStars(review.rating)}
                  </span>
                  <span className="text-muted">
                    {review.rating}/5 stelle
                  </span>
                </div>
              </div>
              
              <div className="text-end d-flex align-items-start gap-2">
                <div>
                  <small className="text-muted d-block">
                    {new Date(review.date).toLocaleDateString('it-IT')}
                  </small>
                  {isOwnReview && (
                    <Badge bg="primary" className="mt-1">
                      La tua recensione
                    </Badge>
                  )}
                </div>
                
                {isOwnReview && (
                  <Dropdown>
                    <Dropdown.Toggle 
                      variant="outline-secondary" 
                      size="sm"
                      id={`dropdown-review-${review.id}`}
                    >
                      ⋮
                    </Dropdown.Toggle>
                    
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => onEdit(review)}>
                        ✏️ Modifica
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={handleDelete}
                        disabled={deleting}
                        className="text-danger"
                      >
                        {deleting ? '🔄 Eliminando...' : '🗑️ Elimina'}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Card.Text>{review.body}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default ReviewCard