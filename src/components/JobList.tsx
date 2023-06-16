import Container from "react-bootstrap/Container"
import { db } from '../config/firebase';
import { useState, useEffect } from "react";
import { getDocs, collection, Timestamp } from 'firebase/firestore';
import { JobCard } from "./JobCard";
import { Button } from "react-bootstrap";
import { CreateJobCard } from "./CreateJobCard";

// Define Job Type
type Job = {
    id: string
    title: string,
    description: string,
    timeCreated: Timestamp,
    userID: string
    boardID: string
}

interface Props {
    boardID: String
}

export const JobList: React.FC<Props> = ({ boardID }) => {
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
            <Container style={{ width: 'auto', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '2rem' }}>
                <h1>Job List <Button onClick={() => { setOpenCreateJob(!openCreateJob) }}>Create New Job</Button></h1>
                {openCreateJob && <CreateJobCard boardID={boardID} refresh={getJobList} setOpenCreateJob={setOpenCreateJob} />}
                {jobList?.map((job: Job) => (<JobCard key={job.id} job={job} boardID={boardID} refresh={getJobList} />))}
            </Container>
        </>
    )
}