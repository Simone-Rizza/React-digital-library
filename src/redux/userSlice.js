const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  allUsers: []
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false
      };
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'FETCH_ALL_USERS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_ALL_USERS_SUCCESS':
      return {
        ...state,
        allUsers: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_ALL_USERS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export const loginStart = () => ({
  type: 'LOGIN_START'
});

export const loginSuccess = (user) => ({
  type: 'LOGIN_SUCCESS',
  payload: user
});

export const loginFailure = (error) => ({
  type: 'LOGIN_FAILURE',
  payload: error
});

export const logout = () => ({
  type: 'LOGOUT'
});

export const registerStart = () => ({
  type: 'REGISTER_START'
});

export const registerSuccess = (user) => ({
  type: 'REGISTER_SUCCESS',
  payload: user
});

export const registerFailure = (error) => ({
  type: 'REGISTER_FAILURE',
  payload: error
});

export const fetchAllUsersStart = () => ({
  type: 'FETCH_ALL_USERS_START'
});

export const fetchAllUsersSuccess = (users) => ({
  type: 'FETCH_ALL_USERS_SUCCESS',
  payload: users
});

export const fetchAllUsersFailure = (error) => ({
  type: 'FETCH_ALL_USERS_FAILURE',
  payload: error
});

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const { loginUser: loginAPI } = await import('../services/localAPI');
    const user = await loginAPI(email, password);
    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const registerUser = (userData) => async (dispatch) => {
  dispatch(registerStart());
  try {
    const { registerUser: registerAPI } = await import('../services/localAPI');
    const user = await registerAPI(userData);
    dispatch(registerSuccess(user));
  } catch (error) {
    dispatch(registerFailure(error.message));
  }
};

export const fetchAllUsers = () => async (dispatch) => {
  dispatch(fetchAllUsersStart());
  try {
    const { getAllUsers } = await import('../services/localAPI');
    const users = await getAllUsers();
    dispatch(fetchAllUsersSuccess(users));
  } catch (error) {
    dispatch(fetchAllUsersFailure(error.message));
  }
};

export const toggleUserStatus = (userId, enabled) => async (dispatch) => {
  try {
    const { toggleUserStatus: toggleAPI } = await import('../services/localAPI');
    await toggleAPI(userId, enabled);
  } catch (error) {
    throw error;
  }
};

export default userReducer;