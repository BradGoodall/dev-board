import TopNavbar from "./TopNavbar";
import JobList from "./JobList";
import CreateTask from "./CreateTask";
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
// Firebase
import { auth } from '../config/firebase';
// React-Firebase-Hooks
import { useAuthState } from 'react-firebase-hooks/auth'
// React-Bootstrap
import { Button } from "react-bootstrap";

function Board() {
    const [user] = useAuthState(auth)

    const [boardID, setBoardID] = useState("N/A");
    const { boardURL } = useParams();

    const [openCreateTask, setOpenCreateTask] = useState(false);

    useEffect(() => {
        if (boardURL) {
            setBoardID(boardURL)
        }
    }, [])

    return (
        <>
            <TopNavbar />
            <h1>Board {boardID}</h1>
            {user && (
                <>
                    <Button onClick={() => { setOpenCreateTask(true) }}>Create a Task</Button>
                    {openCreateTask && <CreateTask />}
                    <JobList />
                </>
            )}
        </>
    )
}

export default Board;