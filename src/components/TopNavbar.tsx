// Firebase Authorisation
import { AuthContext } from './AuthProvider';
// React-Icons
import { FaHashtag } from 'react-icons/fa'
// React
import { useContext } from 'react'
// Firebase
import { auth } from '../config/firebase';
import { signOut } from "firebase/auth";
// React-Bootstrap
import { Dropdown } from 'react-bootstrap';
import { DropdownButton } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
//Routing
import { useNavigate } from "react-router-dom";

function TopNavbar() {
    const user = useContext(AuthContext);
    const navigate = useNavigate();

    const signUserOut = async () => {
        try {
            await signOut(auth);
            navigate("/signedout");
        }
        catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">
                        <FaHashtag id="nav-icon" />
                        <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>devBoard</span>
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/board">My Board</Nav.Link>
                    </Nav>
                    <Nav className="me-auto">
                        {user && (
                            <>
                                <DropdownButton id="dropdown-basic-button" title={"Hi, " + user.name.split(' ')[0] + "!"}>
                                    <img className='navbar-user-image' src={user.imageUrl} alt="Profile Image" /> {user.name}
                                    <Dropdown.Divider />
                                    <Dropdown.Item>Profile</Dropdown.Item>
                                    <Dropdown.Item>Settings</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={signUserOut}>Sign-Out</Dropdown.Item>
                                </DropdownButton>
                            </>
                        )}
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default TopNavbar;