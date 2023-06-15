import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FcGoogle } from "react-icons/fc"
import { auth, googleProvider, db } from "../config/firebase";
import { setDoc, doc, Timestamp, getDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import TopNavbar from "./TopNavbar";
//Routing
import { useNavigate } from "react-router-dom";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    //Navigation
    const navigate = useNavigate();

    //Create Account with Email and Password
    const createAccountEmailPass = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            updateUserDatabase(firstName + " " + lastName);
            navigate("/board");
        }
        catch (err) {
            console.error(err)
        }
    }

    //Sign-In with Email and Password
    const signInEmailPass = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/board");
        }
        catch (err) {
            console.error(err)
        }
    }

    //Sign-In with Google
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            updateUserDatabase(auth.currentUser?.displayName?.toString());
            navigate("/board");
        }
        catch (err) {
            console.error(err)
        }
    }

    //Update the user database
    const updateUserDatabase = async (userName: string | undefined) => {
        const userID = auth.currentUser?.uid.toString();
        const docRef = doc(db, "users/" + userID);
        const userDoc = await getDoc(docRef);
        if (!userDoc.exists()) {
            const timestamp = Timestamp.fromDate(new Date());
            await setDoc(docRef, { name: userName, timeCreated: timestamp, lastLogin: timestamp, userID: auth.currentUser?.uid })
            console.log("Account Created")
        }
        else {
            const timestamp = Timestamp.fromDate(new Date());
            await updateDoc(docRef, { lastLogin: timestamp })
            console.log("Account Already Exists, Logged In")
        }
    }

    return (
        <>
            <TopNavbar />
            <Container style={{ width: '30rem', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '3rem' }}>
                <h1>Sign-In to devBoard</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="formFirstLastName">
                        <Form.Label>First name</Form.Label>
                        <Form.Control placeholder="John"
                            onChange={(e) => setFirstName(e.target.value)} />
                        <Form.Label>Last name</Form.Label>
                        <Form.Control placeholder="Smith"
                            onChange={(e) => setLastName(e.target.value)} />
                    </Form.Group>

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
                    <Button variant="primary" onClick={signInEmailPass} style={{ margin: '0.5rem' }}>
                        Sign-In
                    </Button>
                    <Button variant="primary" onClick={createAccountEmailPass} style={{ margin: '0.5rem' }}>
                        Create Account
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