import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { addDoc, collection } from 'firebase/firestore'
import { db, auth } from '../config/firebase';
import { Timestamp } from "firebase/firestore"

function CreateJob() {

    const jobCollectionRef = collection(db, "jobs")

    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    const submitNewJob = async () => {
        try {
            const timestamp = Timestamp.fromDate(new Date());
            await addDoc(jobCollectionRef, { title: jobTitle, description: jobDescription, timeCreated: timestamp, userID: auth.currentUser?.uid })
            console.log('Job Created')
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Container style={{ width: '30rem', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '3rem' }}>
            <h3>Create a new job</h3>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Control size="lg" type="text" placeholder="Job Title" onChange={(e) => setJobTitle(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control style={{ height: "10rem" }} as="textarea" placeholder="Description" onChange={(e) => setJobDescription(e.target.value)} />
                </Form.Group>
                <Button variant="primary" onClick={submitNewJob}>
                    Create Job
                </Button>
                <Button style={{ marginLeft: "0.5rem" }} variant="outline-danger">
                    Cancel
                </Button>
            </Form>
        </Container>
    )
}

export default CreateJob;