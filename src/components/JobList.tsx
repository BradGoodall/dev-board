import Container from "react-bootstrap/Container"
import { db } from '../config/firebase';
import { useState, useEffect } from "react";
import { getDocs, collection, Timestamp } from 'firebase/firestore';
import { JobCard } from "./JobCard";

// Define Job Type
type Job = {
    id: string
    title: string,
    description: string,
    timeCreated: Timestamp,
    userID: string
}

function JobList() {
    const [jobList, setJobList] = useState<Array<Job>>()

    const jobCollectionRef = collection(db, "jobs");

    // Retreive the job list from the db
    const getJobList = async () => {
        try {
            // Grab all jobs
            const data = await getDocs(jobCollectionRef);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id, } as Job));
            setJobList(filteredData);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getJobList();
    }, [])

    return (
        <>
            <Container style={{ width: 'auto', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '3rem' }}>
                <h1>Job List</h1>
                {jobList?.map((job: Job) => (<JobCard job={job} />))}
            </Container>
        </>
    )
}

export default JobList;