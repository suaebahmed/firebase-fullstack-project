import React from 'react'
import { connect } from 'react-redux'
import { getUser } from '../actions/authAction'
import { useEffect } from 'react'

function Deshbord(props) {
    useEffect(()=>{
        props.getUser();
    },[])
    // console.log(props)
    return (
        <div>
            <h1>i am Deshbord component</h1>
        </div>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    posts: state.posts
})

const mapDispatchToProps = {
    getUser
}
export default connect(mapStateToProps,mapDispatchToProps)(Deshbord)
