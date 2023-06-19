import Container from "react-bootstrap/Container"
import { db } from '../config/firebase';
import { useState, useEffect, useContext } from "react";
import { getDocs, collection, Timestamp } from 'firebase/firestore';
import { JobCard } from "./JobCard";
import { Button } from "react-bootstrap";
import { CreateJobCard } from "./CreateJobCard";
// Firebase Authorisation
import { AuthContext } from './AuthProvider';

// Define Job Type
type Job = {
    id: string
    title: string,
    description: string,
    timeCreated: Timestamp,
    userID: string
    boardID: string
}

type BoardData = {
    boardName: string,
    boardCustomURL: string,
    ownerID: string
}
interface Props {
    boardID: String
    boardData: BoardData
}


export const JobList: React.FC<Props> = ({ boardID, boardData }) => {
    const user = useContext(AuthContext);

    const jobCollectionRef = collection(db, "jobs");

    const [jobList, setJobList] = useState<Array<Job>>()
    const [openCreateJob, setOpenCreateJob] = useState(false);

    // Retreive the job list from the db
    const getJobList = async () => {
        try {
            // Grab all jobs
            const data = await getDocs(jobCollectionRef);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id, } as Job));
            setJobList(filteredData);
            console.log("#READ Retrieved Job List")
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (!jobList)
            getJobList();
    }, [jobList])

    return (
        <>
            <Container className="window-box">
                <h1>Job List {user?.userID == boardData.ownerID && (<Button onClick={() => { setOpenCreateJob(!openCreateJob) }}>Create New Job</Button>)}</h1>
                {openCreateJob && <CreateJobCard boardID={boardID} refresh={getJobList} setOpenCreateJob={setOpenCreateJob} />}
                {jobList?.map((job: Job) => (<JobCard key={job.id} job={job} boardID={boardID} refresh={getJobList} />))}
            </Container>
        </>
    )
}