import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button";
import { Timestamp, doc, deleteDoc } from 'firebase/firestore'
import { GetJobUserName } from "./GetJobUserName";
import { auth, db } from "../config/firebase";
import { Form } from "react-bootstrap";

type Job = {
    id: string
    title: string,
    description: string,
    timeCreated: Timestamp,
    userID: string
}

interface Props {
    job: Job
}

export const JobCard: React.FC<Props> = ({ job }) => {

    // Delete a Job
    const deleteJob = async (job: Job, id: string) => {
        // If the current userID != job owner ID
        if (job.userID != auth.currentUser?.uid) {
            console.log('Incorrect uid');
            return
        }

        // Delete the job from the DB
        try {
            const jobDoc = doc(db, "jobs", id)
            await deleteDoc(jobDoc)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            {job.userID == auth.currentUser?.uid && (

                <Card key={job.id} style={{ width: '30rem', padding: '2rem', margin: '1rem', backgroundColor: '#EEE2DE' }}>
                    <Form style={{ marginBottom: '1rem' }}>
                        <h2>{job.title}</h2>
                        <Form.Label>Description</Form.Label>
                        <Form.Control style={{ height: "10rem" }} as="textarea" value={job.description} onChange={() => { }}></Form.Control><br />
                        <h4>Job Tasks</h4>
                        <div style={{ padding: '0.5rem', borderStyle: 'solid', borderColor: 'gray' }}>
                            <Form.Check type='checkbox' label="Job Task 1" />
                            <Form.Check type='checkbox' label="Job Task 2" />
                            <Form.Check type='checkbox' label="Job Task 3" />
                            <Form.Check type='checkbox' label="Job Task 4" />
                        </div>
                    </Form>
                    <p style={{ color: 'gray', fontSize: '0.8rem' }}><span style={{ color: 'black' }}>Job Created:</span> {job.timeCreated.toDate().toUTCString()}</p>
                    <p style={{ color: 'gray', fontSize: '0.8rem' }}><span style={{ color: 'black' }}>Created By:</span> <GetJobUserName userID={job.userID} /></p>
                    <Button variant="danger" onClick={() => deleteJob(job, job.id)}>Delete Job</Button>
                </Card>
            )}
        </>
    )
}