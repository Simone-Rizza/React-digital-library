import { useState } from 'react'
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../services/localAPI'
import { loginSuccess } from '../redux/userSlice'

function ProfileForm({ show, onHide }) {
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
    if (success) setSuccess('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è richiesto'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è richiesta'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida'
    }
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Password attuale richiesta per confermare le modifiche'
    }
    
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'La nuova password deve essere almeno 6 caratteri'
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Le password non coincidono'
      }
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
    setErrors({})
    
    try {
      // Verifica password attuale chiamando l'API
      const { loginUser: verifyLogin } = await import('../services/localAPI')
      try {
        await verifyLogin(currentUser.email, formData.currentPassword)
      } catch (error) {
        setErrors({ currentPassword: 'Password attuale non corretta' })
        return
      }

      const updateData = {
        ...currentUser,
        name: formData.name,
        email: formData.email
      }

      // Se c'è una nuova password, aggiornala
      if (formData.newPassword) {
        updateData.password = formData.newPassword
      }

      const updatedUser = await updateUser(currentUser.id, updateData)
      
      // Aggiorna lo stato Redux con i nuovi dati utente (senza password)
      const { password: _, ...userWithoutPassword } = updatedUser
      dispatch(loginSuccess(userWithoutPassword))
      
      setSuccess('Profilo aggiornato con successo!')
      
      // Reset campi password
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      setTimeout(() => {
        setSuccess('')
        onHide()
      }, 2000)
      
    } catch (error) {
      setErrors({ general: error.message || 'Errore nell\'aggiornamento del profilo' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
    setSuccess('')
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Profilo</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errors.general && (
            <Alert variant="danger">
              {errors.general}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {success}
            </Alert>
          )}
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nome completo *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  isInvalid={!!errors.name}
                  placeholder="Il tuo nome completo"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  isInvalid={!!errors.email}
                  placeholder="la-tua@email.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <hr />
          
          <h6 className="mb-3">Sicurezza</h6>
          
          <Form.Group className="mb-3">
            <Form.Label>Password attuale *</Form.Label>
            <Form.Control
              type="password"
              value={formData.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              isInvalid={!!errors.currentPassword}
              placeholder="Inserisci la tua password attuale per confermare"
            />
            <Form.Text className="text-muted">
              Richiesta per confermare tutte le modifiche
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.currentPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nuova password (opzionale)</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  isInvalid={!!errors.newPassword}
                  placeholder="Lascia vuoto per non modificare"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Conferma nuova password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                  placeholder="Ripeti la nuova password"
                  disabled={!formData.newPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Annulla
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salva Modifiche'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ProfileForm