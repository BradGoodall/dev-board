import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// react-Icons
import { FaHashtag } from 'react-icons/fa'
// React
import { useState } from 'react'
// Firebase
import { auth, db } from '../config/firebase';
import { getDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from "firebase/auth";
// React-Firebase-Hooks
import { useAuthState } from 'react-firebase-hooks/auth'
// React-Bootstrap
import { Button } from 'react-bootstrap';
//Routing
import { useNavigate } from "react-router-dom";

type UserData = {
    name: string
}

function TopNavbar() {
    const [user] = useAuthState(auth)
    const navigate = useNavigate();

    const [userMessage, setUserMessage] = useState("");

    const signUserOut = async () => {
        try {
            await signOut(auth);
            navigate("/signedout");
        }
        catch (err) {
            console.error(err)
        }
    }

    const updateUserMessage = async () => {
        try {
            const docRef = doc(db, "users/" + auth.currentUser?.uid);
            const userDocument = await getDoc(docRef);
            const userData = userDocument.data() as UserData;
            const firstName = userData.name.split(' ')[0];
            setUserMessage("Hi, " + firstName + "!");
        } catch (error) {
            setUserMessage("NULL User");
            console.error("OOPS! " + error)
        };
    }

    onAuthStateChanged(auth, () => {
        updateUserMessage();
    })

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
                        {user && userMessage && (
                            <>
                                <Nav.Link>{userMessage}</Nav.Link>
                                <Button variant="secondary" size="sm" onClick={signUserOut}>Sign Out</Button>
                            </>
                        )}
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default TopNavbar;