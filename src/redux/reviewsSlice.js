const initialState = {
  bookReviews: {},
  userReviews: [],
  loading: false,
  error: null
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_REVIEWS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_BOOK_REVIEWS_SUCCESS':
      return {
        ...state,
        bookReviews: {
          ...state.bookReviews,
          [action.payload.bookId]: action.payload.reviews
        },
        loading: false,
        error: null
      };
    case 'FETCH_USER_REVIEWS_SUCCESS':
      return {
        ...state,
        userReviews: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_REVIEWS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'ADD_REVIEW':
      return {
        ...state,
        userReviews: [...state.userReviews, action.payload]
      };
    default:
      return state;
  }
};

export const fetchReviewsStart = () => ({
  type: 'FETCH_REVIEWS_START'
});

export const fetchBookReviewsSuccess = (bookId, reviews) => ({
  type: 'FETCH_BOOK_REVIEWS_SUCCESS',
  payload: { bookId, reviews }
});

export const fetchUserReviewsSuccess = (reviews) => ({
  type: 'FETCH_USER_REVIEWS_SUCCESS',
  payload: reviews
});

export const fetchReviewsFailure = (error) => ({
  type: 'FETCH_REVIEWS_FAILURE',
  payload: error
});

export const addReview = (review) => ({
  type: 'ADD_REVIEW',
  payload: review
});

export const fetchBookReviews = (bookId) => async (dispatch) => {
  dispatch(fetchReviewsStart());
  try {
    const { getBookReviews } = await import('../services/localAPI');
    const reviews = await getBookReviews(bookId);
    dispatch(fetchBookReviewsSuccess(bookId, reviews));
  } catch (error) {
    dispatch(fetchReviewsFailure(error.message));
  }
};

export const fetchUserReviews = (userId) => async (dispatch) => {
  dispatch(fetchReviewsStart());
  try {
    const { getUserReviews } = await import('../services/localAPI');
    const reviews = await getUserReviews(userId);
    dispatch(fetchUserReviewsSuccess(reviews));
  } catch (error) {
    dispatch(fetchReviewsFailure(error.message));
  }
};

export const createNewReview = (reviewData) => async (dispatch) => {
  try {
    const { createReview } = await import('../services/localAPI');
    const newReview = await createReview(reviewData);
    dispatch(addReview(newReview));
    return newReview;
  } catch (error) {
    throw error;
  }
};

export const updateExistingReview = (reviewId, reviewData) => async (dispatch) => {
  try {
    const { updateReview } = await import('../services/localAPI');
    const updatedReview = await updateReview(reviewId, reviewData);
    // Ricarica le recensioni del libro per aggiornare la lista
    dispatch(fetchBookReviews(reviewData.bookId));
    return updatedReview;
  } catch (error) {
    throw error;
  }
};

export const deleteExistingReview = (reviewId, bookId) => async (dispatch) => {
  try {
    const { deleteReview } = await import('../services/localAPI');
    await deleteReview(reviewId);
    // Ricarica le recensioni del libro per aggiornare la lista
    dispatch(fetchBookReviews(bookId));
  } catch (error) {
    throw error;
  }
};

export default reviewsReducer;