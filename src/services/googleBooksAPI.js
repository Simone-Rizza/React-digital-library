const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1'

export const searchBooks = async (query, maxResults = 20) => {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API_BASE}/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&langRestrict=it`
    )
    
    if (!response.ok) {
      throw new Error('Errore nella ricerca libri')
    }
    
    const data = await response.json()
    
    return {
      totalItems: data.totalItems || 0,
      books: data.items ? data.items.map(formatBook) : []
    }
  } catch (error) {
    console.error('Errore Google Books API:', error)
    throw error
  }
}

export const getBookById = async (bookId) => {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API_BASE}/volumes/${bookId}`)
    
    if (!response.ok) {
      throw new Error('Libro non trovato')
    }
    
    const data = await response.json()
    return formatBook(data)
  } catch (error) {
    console.error('Errore nel recupero libro:', error)
    throw error
  }
}

export const searchBooksByCategory = async (category, maxResults = 12) => {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API_BASE}/volumes?q=subject:${encodeURIComponent(category)}&maxResults=${maxResults}&langRestrict=it`
    )
    
    if (!response.ok) {
      throw new Error('Errore nella ricerca per categoria')
    }
    
    const data = await response.json()
    
    return {
      totalItems: data.totalItems || 0,
      books: data.items ? data.items.map(formatBook) : []
    }
  } catch (error) {
    console.error('Errore ricerca categoria:', error)
    throw error
  }
}

const formatBook = (googleBook) => {
  const volumeInfo = googleBook.volumeInfo || {}
  
  return {
    id: googleBook.id,
    title: volumeInfo.title || 'Titolo non disponibile',
    authors: volumeInfo.authors || ['Autore sconosciuto'],
    description: volumeInfo.description || 'Descrizione non disponibile',
    thumbnail: volumeInfo.imageLinks?.thumbnail || 
               volumeInfo.imageLinks?.smallThumbnail || 
               'https://via.placeholder.com/150x200?text=Nessuna+Immagine',
    publishedDate: volumeInfo.publishedDate,
    publisher: volumeInfo.publisher,
    pageCount: volumeInfo.pageCount,
    categories: volumeInfo.categories || [],
    language: volumeInfo.language,
    isbn: getISBN(volumeInfo.industryIdentifiers),
    rating: volumeInfo.averageRating,
    ratingsCount: volumeInfo.ratingsCount,
    infoLink: volumeInfo.infoLink,
    previewLink: volumeInfo.previewLink
  }
}

const getISBN = (identifiers) => {
  if (!identifiers) return null
  
  const isbn13 = identifiers.find(id => id.type === 'ISBN_13')
  const isbn10 = identifiers.find(id => id.type === 'ISBN_10')
  
  return isbn13?.identifier || isbn10?.identifier || null
}

export const getPopularBooks = async () => {
  const categories = [
    'fiction',
    'classics',
    'mystery',
    'romance',
    'science'
  ]
  
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  return searchBooksByCategory(randomCategory, 10)
}