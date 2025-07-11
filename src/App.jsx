import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { fetchBooks } from './redux/booksSlice'
import AppNavbar from './components/Navbar'
import Home from './pages/Home'
import BookCatalog from './pages/BookCatalog'
import BookDetail from './pages/BookDetail'
import MyLoans from './pages/MyLoans'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Profile from './pages/Profile'
import './App.css'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchBooks())
  }, [dispatch])

  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookCatalog />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/my-loans" element={<MyLoans />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
