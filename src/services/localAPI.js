const API_BASE = 'http://localhost:3001'

// Users API
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE}/users`)
  const users = await response.json()
  const user = users.find(u => u.email === email && u.password === password)
  
  if (user) {
    if (!user.enabled) {
      throw new Error('Account disabilitato. Contatta l\'amministratore.')
    }
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  throw new Error('Email o password non corretti')
}

export const getUserById = async (userId) => {
  const response = await fetch(`${API_BASE}/users/${userId}`)
  if (!response.ok) throw new Error('Utente non trovato')
  return response.json()
}

export const updateUser = async (userId, userData) => {
  const response = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  if (!response.ok) throw new Error('Errore aggiornamento utente')
  return response.json()
}

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE}/users`)
  const users = await response.json()
  
  const existingUser = users.find(u => u.email === userData.email)
  if (existingUser) {
    throw new Error('Email già registrata')
  }
  
  const newUser = {
    ...userData,
    role: 'user',
    enabled: true,
    id: Date.now().toString()
  }
  
  const createResponse = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  })
  
  if (!createResponse.ok) throw new Error('Errore durante la registrazione')
  
  const createdUser = await createResponse.json()
  const { password: _, ...userWithoutPassword } = createdUser
  return userWithoutPassword
}

// Books API
export const getBooks = async () => {
  const response = await fetch(`${API_BASE}/books`)
  if (!response.ok) throw new Error('Errore caricamento libri')
  return response.json()
}

export const addBook = async (bookData) => {
  const response = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  })
  if (!response.ok) throw new Error('Errore aggiunta libro')
  return response.json()
}

export const updateBook = async (bookId, bookData) => {
  const response = await fetch(`${API_BASE}/books/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  })
  if (!response.ok) throw new Error('Errore aggiornamento libro')
  return response.json()
}

export const deleteBook = async (bookId) => {
  const response = await fetch(`${API_BASE}/books/${bookId}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Errore eliminazione libro')
  return response.json()
}

// Loans API
export const getUserLoans = async (userId) => {
  const response = await fetch(`${API_BASE}/loans?userId=${userId}`)
  if (!response.ok) throw new Error('Errore caricamento prestiti')
  return response.json()
}

export const getAllLoans = async () => {
  const response = await fetch(`${API_BASE}/loans`)
  if (!response.ok) throw new Error('Errore caricamento prestiti')
  return response.json()
}

export const createLoan = async (loanData) => {
  const response = await fetch(`${API_BASE}/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...loanData,
      loanDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 giorni
      returnDate: null,
      status: 'active',
      renewalRequested: false
    })
  })
  if (!response.ok) throw new Error('Errore creazione prestito')
  return response.json()
}

export const updateLoan = async (loanId, loanData) => {
  const response = await fetch(`${API_BASE}/loans/${loanId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loanData)
  })
  if (!response.ok) throw new Error('Errore aggiornamento prestito')
  return response.json()
}

export const returnBook = async (loanId) => {
  const response = await fetch(`${API_BASE}/loans/${loanId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      returnDate: new Date().toISOString().split('T')[0],
      status: 'completed'
    })
  })
  if (!response.ok) throw new Error('Errore restituzione libro')
  return response.json()
}

export const requestRenewal = async (loanId) => {
  const response = await fetch(`${API_BASE}/loans/${loanId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      renewalRequested: true
    })
  })
  if (!response.ok) throw new Error('Errore richiesta rinnovo')
  return response.json()
}

// Reviews API
export const getBookReviews = async (bookId) => {
  const response = await fetch(`${API_BASE}/reviews?bookId=${bookId}`)
  if (!response.ok) throw new Error('Errore caricamento recensioni')
  return response.json()
}

export const getUserReviews = async (userId) => {
  const response = await fetch(`${API_BASE}/reviews?userId=${userId}`)
  if (!response.ok) throw new Error('Errore caricamento recensioni')
  return response.json()
}

export const createReview = async (reviewData) => {
  const response = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...reviewData,
      date: new Date().toISOString().split('T')[0]
    })
  })
  if (!response.ok) throw new Error('Errore creazione recensione')
  return response.json()
}

export const updateReview = async (reviewId, reviewData) => {
  const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  })
  if (!response.ok) throw new Error('Errore aggiornamento recensione')
  return response.json()
}

export const deleteReview = async (reviewId) => {
  const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Errore eliminazione recensione')
  return response.json()
}

// User Management API
export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE}/users`)
  if (!response.ok) throw new Error('Errore caricamento utenti')
  const users = await response.json()
  return users.map(user => {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  })
}

export const toggleUserStatus = async (userId, enabled) => {
  const response = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled })
  })
  if (!response.ok) throw new Error('Errore aggiornamento stato utente')
  return response.json()
}