import TopNavbar from "./TopNavbar";
import JobList from "./JobList";
import CreateJob from "./CreateJobCard";
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

    const [openCreateJob, setOpenCreateJob] = useState(false);

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
                    <Button onClick={() => { setOpenCreateJob(true) }}>Create a Job</Button>
                    {openCreateJob && <CreateJob />}
                    <JobList />
                </>
            )}
        </>
    )
}

export default Board;