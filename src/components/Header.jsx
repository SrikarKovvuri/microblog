import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Import the CSS file

function Header() {
    return (
        <div>
            <nav>
                <div className="logo">MyApp</div> {/* Logo */}
                <ul>
                    <li>
                        <Link to="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/login">Log in</Link>
                    </li>
                    <li>
                        <Link to="/signup">Sign Up</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;
