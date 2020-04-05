import { combineReducers } from 'redux'
import authReducer from '../AuthReducer'
import postReducer from '../PostReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    posts: postReducer
});
export default rootReducer;