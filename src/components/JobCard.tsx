import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button";
import { Timestamp } from 'firebase/firestore'
import { Form } from "react-bootstrap";
import { useState } from 'react'
import { JobCardModal } from "./JobCardModal";

type Job = {
    id: string
    title: string,
    description: string,
    timeCreated: Timestamp,
    userID: string
    boardID: string
}

interface Props {
    job: Job
    boardID: String
    refresh: () => void
}

export const JobCard: React.FC<Props> = ({ job, boardID, refresh }) => {

    const [openCard, setOpenCard] = useState(false);

    return (
        <>
            {job.boardID == boardID && boardID != "" && (
                <Card style={{ width: '30rem', padding: '2rem', margin: '1rem', backgroundColor: '#EEE2DE' }}>
                    <Form>
                        <>
                            <h2>{job.title} <Button size='sm' variant="secondary" onClick={() => setOpenCard(true)}>Open Job Card</Button></h2>
                            <Form.Label>{job.description}</Form.Label>
                            {openCard && (<JobCardModal job={job} refresh={refresh} openCard={setOpenCard} />)}
                        </>
                    </Form>
                </Card>
            )}
        </>
    )
}