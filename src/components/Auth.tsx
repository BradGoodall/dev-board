import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FcGoogle } from "react-icons/fc"
import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut, getAuth } from "firebase/auth";
import { useState, useEffect } from "react";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState<string | null | undefined>("");

    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setUserName(auth?.currentUser?.email);
        }
        catch (err) {
            console.error(err)
        }
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            setUserName(auth?.currentUser?.displayName);
        }
        catch (err) {
            console.error(err)
        }
    }

    const signUserOut = async () => {
        try {
            await signOut(auth);
            setUserName(auth?.currentUser?.displayName);
        }
        catch (err) {
            console.error(err)
        }
    }

    const printEmail = () => {
        console.log(auth?.currentUser?.email)
    }

    //const data = await auth.updateCurrentUser(auth.currentUser)
    useEffect(() => {
        const getUserData = async () => {
            try {
                setUserName(auth?.currentUser?.displayName)
            } catch (err) {
                console.error(err);
            }
        }
        getUserData();
    }, [])

    return (
        <>
            <h1>Hello, {userName}</h1>
            <Button onClick={signUserOut}>Sign Out</Button>
            <Button onClick={printEmail}>Test</Button>
            <Container style={{ width: '30rem', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '3rem' }}>
                <h1>Sign-In to devBoard</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={signIn}>
                        Sign-In
                    </Button>
                </Form>
            </Container>

            <Container style={{ width: '30rem', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '3rem' }}>
                <h4>Alternative Sign-In Methods</h4>
                <Button variant="light" type="submit" onClick={signInWithGoogle}>
                    <FcGoogle /> Sign-In with Google
                </Button>
            </Container>
        </>
    )
}

export default Auth;