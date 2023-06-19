import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FcGoogle } from "react-icons/fc"
import { auth, googleProvider, db } from "../config/firebase";
import { setDoc, doc, Timestamp, getDoc, updateDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import TopNavbar from "./TopNavbar";
//Routing
import { useNavigate } from "react-router-dom";

interface User {
    email: string;
    provider: string;
}

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [emailChecked, setEmailChecked] = useState(false);
    const [emailExists, setEmailExists] = useState(false);

    //Navigation
    const navigate = useNavigate();

    //Create Account with Email and Password
    const createAccountEmailPass = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await updateUserDatabase(firstName + " " + lastName, "Email");
            navigate("/board");
        }
        catch (err) {
            console.error(err)
        }
    }

    //Sign-In with Email and Password
    const signInEmailPass = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/board");
        }
        catch (err) {
            console.error(err)
        }
    }

    //Sign-In with Google
    const signInWithGoogle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, googleProvider);
            await updateUserDatabase(auth.currentUser?.displayName?.toString(), "Google");
            navigate("/board");
        }
        catch (err) {
            console.error(err)
        }
    }

    //Check if Email exists
    const checkEmailExists = async (e: React.MouseEvent<HTMLButtonElement>, emailToCheck: string) => {
        e.preventDefault();
        setEmailExists(false);
        try {
            const userCollectionRef = collection(db, "users");
            const userData = await getDocs(userCollectionRef);
            console.log('#READ Checking Emails');
            const filteredUserData = userData.docs.map((doc) => ({ ...doc.data() } as User));
            filteredUserData.map((doc) => {
                if ((doc.email == emailToCheck) && (doc.provider == "Email")) {
                    setEmailExists(true);
                    console.log('Email Found!');
                    return
                }
            })
            if (emailExists == false) {
                console.log('Email Not Found!');
            }
            setEmailChecked(true);
        }
        catch (err) {
            console.error(err)
        }
    }

    //Update the user database
    const updateUserDatabase = async (userName: string | undefined, provider: string) => {
        const userID = auth.currentUser?.uid.toString();
        const docRef = doc(db, "users/" + userID);
        const userDoc = await getDoc(docRef);
        // Create new user
        if (!userDoc.exists()) {
            const timestamp = Timestamp.fromDate(new Date());
            // Generate a new board
            const boardRef = await addDoc(collection(db, "boards"), {
                ownerID: auth.currentUser?.uid,
                boardName: userName!.split(' ')[0] + "'s Board",
                timeCreated: timestamp
            });
            console.log('#WRITE Created a New Board');
            await setDoc(docRef, {
                name: userName,
                email: email,
                timeCreated: timestamp,
                lastLogin: timestamp,
                userID: auth.currentUser?.uid,
                boardID: boardRef.id,
                imageUrl: (auth.currentUser?.photoURL != null) ? auth.currentUser?.photoURL : "/default_profile_image.png",
                provider: provider
            })
            console.log('#WRITE Created a New User Account');
            console.log("Account Created")
        }
        else {
            // Update existing data
            const timestamp = Timestamp.fromDate(new Date());
            await updateDoc(docRef, { lastLogin: timestamp })
            console.log("Account Already Exists, Logged In")
            console.log('#WRITE Updated User Login Timestamp');
        }
    }

    return (
        <>
            <TopNavbar />
            <Container className="window-box" style={{ width: '30rem', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '3rem' }}>
                {!emailChecked && (
                    <>
                        <h1 style={{ textAlign: "center" }}>Sign-In to <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>devBoard</span></h1>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" onClick={(e) => checkEmailExists(e, email)} type="submit" style={{ margin: '0.5rem' }}>
                                Continue
                            </Button>
                        </Form>
                    </>
                )}
                {emailChecked && emailExists && (
                    <>
                        <h1 style={{ textAlign: "center" }}>Sign-In to <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>devBoard</span></h1>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" onClick={(e) => signInEmailPass(e)} type="submit" style={{ margin: '0.5rem' }}>
                                Sign-In
                            </Button>
                            <Button variant="secondary" onClick={() => setEmailChecked(false)} style={{ margin: '0.5rem' }}>
                                Back
                            </Button>
                        </Form>
                    </>
                )}
                {emailChecked && !emailExists && (
                    <>
                        <h1 style={{ textAlign: "center" }}>Create a <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>devBoard</span> account</h1>
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
                                <Form.Control type="email" placeholder="Enter email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" onClick={(e) => createAccountEmailPass(e)} type="submit" style={{ margin: '0.5rem' }}>
                                Create Account
                            </Button>
                            <Button variant="secondary" onClick={() => setEmailChecked(false)} style={{ margin: '0.5rem' }}>
                                Back
                            </Button>
                        </Form>
                    </>
                )}
            </Container >

            <Container className="window-box" style={{ width: '30rem', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '3rem', textAlign: "center" }}>
                <h4>Alternative Sign-In Methods</h4>
                <Button size="lg" variant="light" type="submit" onClick={(e) => signInWithGoogle(e)}>
                    <FcGoogle /> Sign-In with Google
                </Button>
            </Container>
        </>
    )
}

export default LoginForm;