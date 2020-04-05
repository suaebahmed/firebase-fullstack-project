import React from 'react'
import { Link } from 'react-router-dom'

function Layout() {
    return (
        <div>
            <ul>
                
                <li><Link to="/">Home</Link></li>
                <li><Link to="/signin">sign in</Link></li>
                <li><Link to="/signup">sign up</Link></li>
            </ul>
        </div>
    )
}

export default Layout;
