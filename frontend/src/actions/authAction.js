import {
GET_USER,
AUTH_ERROR,
SIGNUP_SUCCESS,
SIGNUP_FAIL,
SIGNIN_SUCCESS,
SIGNIN_FAIL
} from './actionType/index'
import axios from 'axios'

export const getUser =( )=>{
    return (dispatch,getState)=>{
        let token = getState().auth.token
        let config = {
            headers :{
                "Content-Type": "application/json"
            }
        }
        if(token){
            // config.headers['x-auth-token'] = token //= let isToken = req.header('x-auth-token')
            config.headers['authorization'] = `Bearar ${token}`
        }
        axios.get('http://localhost:5000/fir-funtiontutorial/us-central1/api/user',config)
        .then(res=>{
            console.log(res.data)
           dispatch({type: GET_USER,payload: res.data})
        })
        .catch(err=>{
            console.log(err.response)
            dispatch({type: AUTH_ERROR,payload: err.response})
       })
    }
}

export const signIn = (user) =>(dispatch ,getState)=>{
    console.log(user)
    axios.post('http://localhost:5000/fir-funtiontutorial/us-central1/api/signin',user)
         .then(res=>{
            dispatch({type: SIGNIN_SUCCESS,payload: res.data})
         })
         .catch(err=>{
             console.log(err.response)
             dispatch({type: SIGNIN_FAIL,payload: err.response})
        })
}

export const signUp = (user) =>(dispatch ,getState)=>{
    console.log(user)
    axios.post('http://localhost:5000/fir-funtiontutorial/us-central1/api/signup',user)
         .then(res=>{
            dispatch({type: SIGNUP_SUCCESS,payload: res.data})
         })
         .catch(err=>{
            dispatch({type: SIGNUP_FAIL,payload: err.response})
         })
}

// const config=()=>{
//     let headers = {
//         "Content-Type": "application/json"
//     }

//     return headers;
// }