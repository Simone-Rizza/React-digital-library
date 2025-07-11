const initialState = {
  catalog: [],
  loading: false,
  error: null,
  filters: {
    genre: '',
    author: '',
    year: ''
  }
};

const booksReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_BOOKS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_BOOKS_SUCCESS':
      return {
        ...state,
        catalog: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_BOOKS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload
      };
    case 'ADD_BOOK':
      return {
        ...state,
        catalog: [...state.catalog, action.payload]
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        catalog: state.catalog.filter(book => book.id !== action.payload)
      };
    case 'UPDATE_BOOK':
      return {
        ...state,
        catalog: state.catalog.map(book => 
          book.id === action.payload.id ? action.payload.book : book
        )
      };
    default:
      return state;
  }
};

export const fetchBooksStart = () => ({
  type: 'FETCH_BOOKS_START'
});

export const fetchBooksSuccess = (books) => ({
  type: 'FETCH_BOOKS_SUCCESS',
  payload: books
});

export const fetchBooksFailure = (error) => ({
  type: 'FETCH_BOOKS_FAILURE',
  payload: error
});

export const setFilters = (filters) => ({
  type: 'SET_FILTERS',
  payload: filters
});

export const addBook = (book) => ({
  type: 'ADD_BOOK',
  payload: book
});

export const deleteBookAction = (bookId) => ({
  type: 'DELETE_BOOK',
  payload: bookId
});

export const updateBookAction = (id, book) => ({
  type: 'UPDATE_BOOK',
  payload: { id, book }
});

export const fetchBooks = () => async (dispatch) => {
  dispatch(fetchBooksStart());
  try {
    const { getBooks } = await import('../services/localAPI');
    const books = await getBooks();
    dispatch(fetchBooksSuccess(books));
  } catch (error) {
    dispatch(fetchBooksFailure(error.message));
  }
};

export const addBookToLibrary = (bookData) => async (dispatch) => {
  try {
    const { addBook } = await import('../services/localAPI');
    const newBook = await addBook(bookData);
    dispatch(addBook(newBook));
    return newBook;
  } catch (error) {
    throw error;
  }
};

export const deleteBook = (bookId) => async (dispatch) => {
  try {
    const { deleteBook } = await import('../services/localAPI');
    await deleteBook(bookId);
    dispatch(deleteBookAction(bookId));
  } catch (error) {
    throw error;
  }
};

export const updateBook = (id, bookData) => async (dispatch) => {
  try {
    const { updateBook } = await import('../services/localAPI');
    const updatedBook = await updateBook(id, bookData);
    dispatch(updateBookAction(id, updatedBook));
    return updatedBook;
  } catch (error) {
    throw error;
  }
};

export default booksReducer;