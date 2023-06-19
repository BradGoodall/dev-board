import { Button, Modal } from 'react-bootstrap';
import { Timestamp, collection, addDoc } from 'firebase/firestore'
import { auth, db } from "../config/firebase";
import { Form } from "react-bootstrap";
import { useState } from 'react'

interface Props {
    boardID: string;
    refresh: () => void;
    openCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateJobModal: React.FC<Props> = ({ boardID, refresh, openCard }) => {

    const [isModalOpen, setIsModalOpen] = useState(true);

    const closeModal = () => {
        setIsModalOpen(false);
        openCard(false);
    };

    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    const jobCollectionRef = collection(db, "jobs")

    const submitNewJob = async () => {
        try {
            const timestamp = Timestamp.fromDate(new Date());
            await addDoc(jobCollectionRef, { title: jobTitle, description: jobDescription, timeCreated: timestamp, userID: auth.currentUser?.uid, boardID: boardID })
            console.log('Job Created')
            console.log('#WRITE Created a New Job Card');
            closeModal();
            refresh();
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <>
            <Modal show={isModalOpen} onHide={closeModal} centered dialogClassName="modal-background">
                <Modal.Header closeButton>
                    <Modal.Title>Create a Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>Job Title</Form.Label>
                    <Form.Control type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                    <Form.Label>Description</Form.Label>
                    <Form.Control style={{ height: "5rem" }} as="textarea" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></Form.Control><br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={submitNewJob}>Create Job</Button>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}