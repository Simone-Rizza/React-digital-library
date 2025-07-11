import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../redux/userSlice'

function Login() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    name: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector(state => state.user)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email è richiesta'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password è richiesta'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password deve essere almeno 6 caratteri'
    }
    
    if (isRegistering) {
      if (!formData.name) {
        newErrors.name = 'Nome è richiesto'
      } else if (formData.name.length < 2) {
        newErrors.name = 'Nome deve essere almeno 2 caratteri'
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Conferma password è richiesta'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Le password non corrispondono'
      }
    }
    
    return newErrors
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    try {
      if (isRegistering) {
        await dispatch(registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }))
      } else {
        await dispatch(loginUser(formData.email, formData.password))
      }
    } catch (err) {
      console.error('Auth error:', err)
    }
  }

  const toggleMode = () => {
    setIsRegistering(!isRegistering)
    setFormData({ 
      email: '', 
      password: '',
      name: '',
      confirmPassword: ''
    })
    setErrors({})
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Header>
              <h3 className="text-center">
                {isRegistering ? '📝 Registrati' : '👤 Accedi'}
              </h3>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                {isRegistering && (
                  <Form.Group className="mb-3">
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      placeholder="inserisci il tuo nome e cognome"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="inserisci la tua email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="inserisci la tua password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {isRegistering && (
                  <Form.Group className="mb-3">
                    <Form.Label>Conferma Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                      placeholder="conferma la tua password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 
                    (isRegistering ? 'Registrazione in corso...' : 'Accesso in corso...') : 
                    (isRegistering ? 'Registrati' : 'Accedi')
                  }
                </Button>

                <div className="text-center">
                  <Button variant="link" onClick={toggleMode}>
                    {isRegistering ? 
                      'Hai già un account? Accedi' : 
                      'Non hai un account? Registrati'
                    }
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          {!isRegistering && (
            <Card className="mt-3">
              <Card.Body>
                <h5>Credenziali di Test</h5>
                <p className="mb-1"><strong>Utente:</strong> user@example.com / password123</p>
                <p className="mb-0"><strong>Admin:</strong> admin@library.com / admin123</p>
              </Card.Body>
            </Card>
          )}
          
          <div className="text-center mt-3">
            <Link to="/">← Torna alla Home</Link>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Login