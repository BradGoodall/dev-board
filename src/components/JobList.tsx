import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button";
import { db } from '../config/firebase';
import { useState, useEffect } from "react";
import { getDocs, collection, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { auth } from "../config/firebase";

type Task = {
    id: string
    title: string,
    description: string,
    timeCreated: Timestamp,
    userID: string
}

// type UserData = {
//     name: string,
// }

function TaskList() {
    const [taskList, setTaskList] = useState<Array<Task>>()

    const taskCollectionRef = collection(db, "tasks");
    //const userCollectionRef = collection(db, "users");
    //const boardCollectionRef = collection(db, "boards");

    const getTaskList = async () => {
        // Get data from db
        try {
            const data = await getDocs(taskCollectionRef);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id, } as Task));
            setTaskList(filteredData);
        } catch (err) {
            console.error(err);
        }
    }

    // Delete a Task
    const deleteTask = async (task: Task, id: string) => {
        // If the current userID != task owner ID
        if (task.userID != auth.currentUser?.uid) {
            console.log('Incorrect uid');
            return
        }

        // Delete the task from the DB
        try {
            const taskDoc = doc(db, "tasks", id)
            await deleteDoc(taskDoc)
        } catch (error) {
            console.error(error)
        }
    }

    // Retrieve the Creators Username from a taskID
    // const getUserName = async (taskID: string) => {
    //     const docRef = doc(db, "tasks/" + taskID);
    //     const taskDocument = await getDoc(docRef);
    //     const userData = taskDocument.data() as UserData;
    //     return userData.name
    // }

    useEffect(() => {
        getTaskList();
    }, [])

    return (
        <>
            <Container style={{ width: 'auto', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '3rem' }}>
                <h1>Tasks</h1>
                {taskList?.map((task: Task) => (
                    <Card key={task.id} style={{ width: '30rem', padding: '2rem' }}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>{task.timeCreated.toDate().toDateString()}</p>
                        <p style={{ color: 'gray', fontSize: '0.8rem' }}>Created By: {task.userID}</p>
                        <Button variant="danger" onClick={() => deleteTask(task, task.id)}>Delete Task</Button>
                    </Card>
                ))}
            </Container>
        </>
    )
}

export default TaskList;