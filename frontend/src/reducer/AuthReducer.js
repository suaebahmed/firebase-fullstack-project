import { 
    GET_USER,
    AUTH_ERROR,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    SIGNIN_SUCCESS,
    SIGNIN_FAIL
    } from './../actions/actionType/index'
    

const initialState = {
    token: localStorage.getItem('token'),
    user: null,
    isLoading: false,
    isAuthenticated: false,
    auth_msg: null
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
    case GET_USER:
        return { 
            ...state,
            ...payload,
            isAuthenticated: true
        }
    case SIGNIN_SUCCESS:
    case SIGNUP_SUCCESS:
        localStorage.setItem('token',payload.token)
        return { 
            ...state,
            ...payload,
            isAuthenticated: true
        }
    case SIGNUP_FAIL:
    case AUTH_ERROR:
    case SIGNIN_FAIL:
        localStorage.removeItem('token')
        return {
            user: null,
            isLoading: false,
            isAuthenticated: false,
            auth_msg: null
        }
    default:
        return state
    }
}
