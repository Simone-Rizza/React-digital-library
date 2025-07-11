import { Card, Table, Badge, Button, Modal, Alert, Form } from 'react-bootstrap'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateLoan } from '../services/localAPI'
import { fetchAllLoans } from '../redux/loansSlice'

function AdminLoanManagement() {
  const { allLoans } = useSelector(state => state.loans)
  const { catalog } = useSelector(state => state.books)
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [action, setAction] = useState('') // 'approve', 'reject'
  const [loading, setLoading] = useState(false)

  const activeLoans = allLoans.filter(loan => loan.status === 'active')
  const renewalRequests = activeLoans.filter(loan => loan.renewalRequested)
  const overdueLoans = activeLoans.filter(loan => new Date(loan.dueDate) < new Date())

  const getBookTitle = (bookId) => {
    const book = catalog.find(b => b.id === bookId)
    return book ? book.title : `Libro ID: ${bookId}`
  }

  const handleRenewalAction = (loan, actionType) => {
    setSelectedLoan(loan)
    setAction(actionType)
    setShowModal(true)
  }

  const executeAction = async () => {
    if (!selectedLoan) return

    setLoading(true)
    try {
      let updateData = {}

      if (action === 'approve') {
        // Approva il rinnovo: estendi la scadenza di 30 giorni
        const newDueDate = new Date(selectedLoan.dueDate)
        newDueDate.setDate(newDueDate.getDate() + 30)
        
        updateData = {
          dueDate: newDueDate.toISOString().split('T')[0],
          renewalRequested: false
        }
      } else if (action === 'reject') {
        // Rifiuta il rinnovo
        updateData = {
          renewalRequested: false
        }
      }

      await updateLoan(selectedLoan.id, updateData)
      dispatch(fetchAllLoans())
      setShowModal(false)
      setSelectedLoan(null)
      setAction('')
    } catch (error) {
      console.error('Errore:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT')
  }

  const getDaysOverdue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = today - due
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <>
      {/* Richieste di Rinnovo */}
      {renewalRequests.length > 0 && (
        <Card className="mb-4">
          <Card.Header className="bg-warning text-dark">
            <h5>🔄 Richieste di Rinnovo ({renewalRequests.length})</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Utente</th>
                  <th>Libro</th>
                  <th>Prestito</th>
                  <th>Scadenza</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {renewalRequests.map(loan => (
                  <tr key={loan.id}>
                    <td>User {loan.userId}</td>
                    <td>{getBookTitle(loan.bookId)}</td>
                    <td>{formatDate(loan.loanDate)}</td>
                    <td>
                      <Badge bg="warning">
                        {formatDate(loan.dueDate)}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleRenewalAction(loan, 'approve')}
                      >
                        ✅ Approva
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRenewalAction(loan, 'reject')}
                      >
                        ❌ Rifiuta
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Prestiti Scaduti */}
      {overdueLoans.length > 0 && (
        <Card className="mb-4">
          <Card.Header className="bg-danger text-white">
            <h5>⚠️ Prestiti Scaduti ({overdueLoans.length})</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Utente</th>
                  <th>Libro</th>
                  <th>Scadenza</th>
                  <th>Giorni di Ritardo</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {overdueLoans.map(loan => (
                  <tr key={loan.id}>
                    <td>User {loan.userId}</td>
                    <td>{getBookTitle(loan.bookId)}</td>
                    <td>{formatDate(loan.dueDate)}</td>
                    <td>
                      <Badge bg="danger">
                        {getDaysOverdue(loan.dueDate)} giorni
                      </Badge>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm">
                        📧 Invia Promemoria
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Tutti i Prestiti Attivi */}
      <Card>
        <Card.Header>
          <h5>📚 Tutti i Prestiti Attivi ({activeLoans.length})</h5>
        </Card.Header>
        <Card.Body>
          {activeLoans.length === 0 ? (
            <p className="text-muted">Nessun prestito attivo</p>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Utente</th>
                  <th>Libro</th>
                  <th>Prestito</th>
                  <th>Scadenza</th>
                  <th>Stato</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.slice(0, 10).map(loan => {
                  const isOverdue = new Date(loan.dueDate) < new Date()
                  const daysUntilDue = Math.ceil((new Date(loan.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <tr key={loan.id}>
                      <td>{loan.id}</td>
                      <td>User {loan.userId}</td>
                      <td>{getBookTitle(loan.bookId)}</td>
                      <td>{formatDate(loan.loanDate)}</td>
                      <td>{formatDate(loan.dueDate)}</td>
                      <td>
                        <Badge bg={isOverdue ? 'danger' : (daysUntilDue <= 3 ? 'warning' : 'success')}>
                          {isOverdue ? 'Scaduto' : (daysUntilDue <= 3 ? 'In scadenza' : 'Attivo')}
                        </Badge>
                        {loan.renewalRequested && (
                          <Badge bg="info" className="ms-1">
                            Rinnovo
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
          
          {activeLoans.length > 10 && (
            <div className="text-center">
              <small className="text-muted">
                Mostrati i primi 10 di {activeLoans.length} prestiti attivi
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal Conferma Azione */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {action === 'approve' ? 'Approva Rinnovo' : 'Rifiuta Rinnovo'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <>
              <p><strong>Libro:</strong> {getBookTitle(selectedLoan.bookId)}</p>
              <p><strong>Utente:</strong> User {selectedLoan.userId}</p>
              <p><strong>Scadenza attuale:</strong> {formatDate(selectedLoan.dueDate)}</p>
              
              {action === 'approve' ? (
                <Alert variant="success">
                  <strong>Nuova scadenza:</strong> {
                    new Date(new Date(selectedLoan.dueDate).getTime() + 30 * 24 * 60 * 60 * 1000)
                      .toLocaleDateString('it-IT')
                  }
                  <br />
                  Il prestito sarà esteso di 30 giorni.
                </Alert>
              ) : (
                <Alert variant="warning">
                  La richiesta di rinnovo sarà rifiutata. L'utente dovrà restituire il libro entro la scadenza originale.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
            Annulla
          </Button>
          <Button 
            variant={action === 'approve' ? 'success' : 'danger'} 
            onClick={executeAction}
            disabled={loading}
          >
            {loading ? 'Processando...' : (action === 'approve' ? 'Approva' : 'Rifiuta')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminLoanManagement