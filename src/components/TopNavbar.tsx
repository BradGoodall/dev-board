import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaHashtag } from 'react-icons/fa'
// Firebase
import { auth } from '../config/firebase';
import { signOut } from "firebase/auth";
import { Button } from 'react-bootstrap';
//React-Firebase-Hooks
import { useAuthState } from 'react-firebase-hooks/auth'
//Routing
import { useNavigate } from "react-router-dom";

function TopNavbar() {
    const [user] = useAuthState(auth)
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
                        <Nav.Link href="/board">Board</Nav.Link>
                        <Nav.Link href="/board/test">TestBoard</Nav.Link>
                    </Nav>
                    <Nav className="me-auto">
                        {user && (
                            <>
                                <Nav.Link>{auth.currentUser?.email}</Nav.Link>
                                <Button onClick={signUserOut}>Sign Out</Button>
                            </>
                        )}
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default TopNavbar;