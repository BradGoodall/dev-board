import { Button, Modal } from 'react-bootstrap';
import { Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { GetJobUserName } from "./GetJobUserName";
import { auth, db } from "../config/firebase";
import { Form } from "react-bootstrap";
import { useState } from 'react'

type Job = {
    id: string
    title: string,
    description: string,
    timeCreated: Timestamp,
    userID: string
    boardID: string
}

interface Props {
    job: Job;
    refresh: () => void;
    openCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export const JobCardModal: React.FC<Props> = ({ job, refresh, openCard }) => {

    const [isModalOpen, setIsModalOpen] = useState(true);

    const closeModal = () => {
        setIsModalOpen(false);
        openCard(false);
    };

    const [jobTitle, setJobTitle] = useState(job.title);
    const [jobDescription, setJobDescription] = useState(job.description);
    const [editJob, setEditJob] = useState(false);

    // Update a Job Card
    const updateJob = async () => {
        const docRef = doc(db, "jobs/" + job.id);
        const timestamp = Timestamp.fromDate(new Date());
        await updateDoc(docRef, {
            title: jobTitle,
            description: jobDescription,
            timeUpdated: timestamp,
        })
        console.log('#WRITE Updated a Job Card');
        refresh();
        setEditJob(false);
    }

    // Delete a Job Card
    const deleteJob = async (job: Job, id: string) => {
        // If the current userID != job owner ID
        if (job.userID != auth.currentUser?.uid) {
            console.error('You do not have permission to delete this Job Card!');
            return
        }

        // Delete the job from the DB
        try {
            const jobDoc = doc(db, "jobs", id)
            await deleteDoc(jobDoc)
            console.log('#DELETE Deleted a Job Card');
            refresh();
            closeModal();
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Modal show={isModalOpen} onHide={closeModal} centered dialogClassName="modal-background">
                <Modal.Header closeButton>
                    <Modal.Title>{jobTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!editJob && (
                        <>
                            <h4>Description</h4>
                            <p>{jobDescription}</p>
                        </>
                    )}
                    {editJob && (
                        <>
                            <Form.Label>Job Title</Form.Label>
                            <Form.Control type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                            <Form.Label>Description</Form.Label>
                            <Form.Control style={{ height: "5rem" }} as="textarea" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></Form.Control><br />
                        </>
                    )}

                    <h4>Placeholder Job Tasks</h4>
                    <p>These will be populated from the database later.</p>
                    <div style={{ padding: '0.5rem', borderStyle: 'solid', borderColor: 'gray' }}>
                        <Form.Check type='checkbox' label="Job Task 1" />
                        <Form.Check type='checkbox' label="Job Task 2" />
                        <Form.Check type='checkbox' label="Job Task 3" />
                        <Form.Check type='checkbox' label="Job Task 4" />
                    </div>
                    <p style={{ color: 'gray', fontSize: '0.8rem' }}><span style={{ color: 'black' }}>Job Created:</span> {job.timeCreated.toDate().toUTCString()}</p>
                    <p style={{ color: 'gray', fontSize: '0.8rem' }}><span style={{ color: 'black' }}>Created By:</span> <GetJobUserName userID={job.userID} /></p>

                </Modal.Body>
                <Modal.Footer>
                    {job.userID == auth.currentUser?.uid && editJob && (
                        <>
                            <Button className="modal-button" variant="danger" onClick={() => deleteJob(job, job.id)}>Delete Job</Button>
                            <Button className="modal-button" variant="primary" onClick={() => { updateJob() }}>Save Changes</Button>
                            <Button variant="secondary" onClick={() => setEditJob(false)}>Discard Changes</Button>
                        </>
                    )}
                    {job.userID == auth.currentUser?.uid && !editJob && (
                        <>
                            <Button variant="primary" onClick={() => setEditJob(true)}>Edit Job</Button>
                            <Button variant="secondary" onClick={closeModal}>Close</Button>
                        </>
                    )}
                    {job.userID != auth.currentUser?.uid && (
                        <Button variant="secondary" onClick={closeModal}>Close</Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );

}