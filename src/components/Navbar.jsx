import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice'

function AppNavbar() {
  const { isAuthenticated, currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          📚 Biblioteca Digitale
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/books">Catalogo</Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/my-loans">I Miei Prestiti</Nav.Link>
            )}
            {currentUser?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin">Dashboard Admin</Nav.Link>
            )}
          </Nav>
          
          <Nav className="align-items-center">
            {isAuthenticated ? (
              <NavDropdown title={`👤 ${currentUser?.name}`} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/profile">
                  Profilo
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button as={Link} to="/login" variant="outline-light">
                Accedi
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar