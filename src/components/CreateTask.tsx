import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../config/firebase';
import { Timestamp } from "firebase/firestore"

function CreateTask() {

    const taskCollectionRef = collection(db, "tasks")

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");

    const submitNewTask = async () => {
        try {
            const timestamp = Timestamp.fromDate(new Date());
            await addDoc(taskCollectionRef, { title: taskTitle, description: taskDescription, timeCreated: timestamp })
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <Container style={{ width: '30rem', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '3rem' }}>
                <h3>Create a task</h3>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control size="lg" type="text" placeholder="Task Title"
                            onChange={(e) => setTaskTitle(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control style={{ height: "10rem" }} as="textarea" placeholder="Description"
                            onChange={(e) => setTaskDescription(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={submitNewTask}>
                        Create Task
                    </Button>
                </Form>
            </Container>
        </>
    )
}

export default CreateTask;