const initialState = {
  userLoans: [],
  allLoans: [],
  loading: false,
  error: null
};

const loansReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_LOANS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_USER_LOANS_SUCCESS':
      return {
        ...state,
        userLoans: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_ALL_LOANS_SUCCESS':
      return {
        ...state,
        allLoans: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_LOANS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'ADD_LOAN':
      return {
        ...state,
        userLoans: [...state.userLoans, action.payload]
      };
    case 'UPDATE_LOAN':
      return {
        ...state,
        userLoans: state.userLoans.map(loan => 
          loan.id === action.payload.id ? action.payload : loan
        )
      };
    default:
      return state;
  }
};

export const fetchLoansStart = () => ({
  type: 'FETCH_LOANS_START'
});

export const fetchUserLoansSuccess = (loans) => ({
  type: 'FETCH_USER_LOANS_SUCCESS',
  payload: loans
});

export const fetchAllLoansSuccess = (loans) => ({
  type: 'FETCH_ALL_LOANS_SUCCESS',
  payload: loans
});

export const fetchLoansFailure = (error) => ({
  type: 'FETCH_LOANS_FAILURE',
  payload: error
});

export const addLoan = (loan) => ({
  type: 'ADD_LOAN',
  payload: loan
});

export const updateLoan = (loan) => ({
  type: 'UPDATE_LOAN',
  payload: loan
});

export const fetchUserLoans = (userId) => async (dispatch) => {
  dispatch(fetchLoansStart());
  try {
    const { getUserLoans } = await import('../services/localAPI');
    const loans = await getUserLoans(userId);
    dispatch(fetchUserLoansSuccess(loans));
  } catch (error) {
    dispatch(fetchLoansFailure(error.message));
  }
};

export const fetchAllLoans = () => async (dispatch) => {
  dispatch(fetchLoansStart());
  try {
    const { getAllLoans } = await import('../services/localAPI');
    const loans = await getAllLoans();
    dispatch(fetchAllLoansSuccess(loans));
  } catch (error) {
    dispatch(fetchLoansFailure(error.message));
  }
};

export const createNewLoan = (loanData) => async (dispatch) => {
  try {
    const { createLoan } = await import('../services/localAPI');
    const newLoan = await createLoan(loanData);
    dispatch(addLoan(newLoan));
    return newLoan;
  } catch (error) {
    throw error;
  }
};

export const updateLoanStatus = (loanId, updateData) => async (dispatch) => {
  try {
    const { updateLoan } = await import('../services/localAPI');
    const updatedLoan = await updateLoan(loanId, updateData);
    dispatch(updateLoan(updatedLoan));
    return updatedLoan;
  } catch (error) {
    throw error;
  }
};

export default loansReducer;