import TopNavbar from "./TopNavbar";
import TaskList from "./TaskList";
import CreateTask from "./CreateTask";
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
// Firebase
import { auth } from '../config/firebase';
//React-Firebase-Hooks
import { useAuthState } from 'react-firebase-hooks/auth'

function Board() {
    const [user] = useAuthState(auth)

    const [boardID, setBoardID] = useState("N/A");
    const { boardURL } = useParams();

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
                    <TaskList />
                    <CreateTask />
                </>
            )}
        </>
    )
}

export default Board;