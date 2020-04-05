import React, { useState } from 'react'
import { connect } from 'react-redux'
import { signIn } from '../../actions/authAction'

function Signin(props){

    const [user, setUser] = useState({email: '',password: ''})

    const submitHandle = (e)=>{
        e.preventDefault();
        props.signIn(user);
    }

    return (
        <div>
            <h1>sign page</h1>
            <input type="text" name="email" value={user.email} placeholder="Enter your email *"
            onChange={(e)=>{setUser({...user,email: e.target.value})}} />

            <input type="text" name="password" value={user.password} placeholder="Enter your password *"
            onChange={(e)=>{setUser({...user,password: e.target.value})}} />

            <button onClick={submitHandle}>sign in</button>
        </div>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    posts: state.posts
})

const mapDispatchToProps = {
    signIn
}
export default connect(mapStateToProps,mapDispatchToProps)(Signin)
