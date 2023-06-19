// Firebase Authorisation
import { AuthContext } from './AuthProvider';
// React
import { useState, useEffect, useContext } from 'react'
// Components
import TopNavbar from "./TopNavbar";
import { JobList } from "./JobList";
// React-Router
import { useParams } from 'react-router-dom'
// Firebase
import { db } from '../config/firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore'
// React-Bootstrap
import { Container, Row, Col } from "react-bootstrap";
import { Button } from 'react-bootstrap'
import { Form } from "react-bootstrap";

type BoardData = {
    boardName: string,
    boardCustomURL: string,
    ownerID: string
    backgroundURL: string
}

function Board() {
    const user = useContext(AuthContext);

    // Board Data
    const { boardURL } = useParams();
    const [boardID, setBoardID] = useState("");
    const [boardData, setBoardData] = useState<BoardData>();
    const [newBoardName, setNewBoardName] = useState("");
    const [editBoardName, setEditBoardName] = useState(false);
    const [backgroundURL, setBackgroundURL] = useState("");



    // Get the users board data
    const retrieveBoardData = async (loadableBoardID: string) => {
        try {
            if (loadableBoardID == "") {
                // Get users board id
                setBoardID(user!.boardID);
                loadableBoardID = user!.boardID;
                console.log("Setting board ID: boards/" + user!.boardID!);
                console.log('#READ Retreived Board ID');
            }

            // Get the board
            console.log("Retreiving boards/" + loadableBoardID);
            const boardDocRef = doc(db, "boards/" + loadableBoardID);
            const boardDocument = await getDoc(boardDocRef);
            const boardData = boardDocument.data() as BoardData;
            setBoardData(boardData);
            setNewBoardName(boardData.boardName);
            setBackgroundURL(boardData.backgroundURL);
            console.log('#READ Retreived Board Data & Name');

        } catch (error) {
            console.error(error);
        };
    }

    // Update the Boards Name
    const updateBoardName = async (name: string) => {
        const docRef = doc(db, "boards/" + boardID);
        await updateDoc(docRef, {
            boardName: name,

        })
        console.log('#WRITE Updated Board Name');
        await retrieveBoardData(boardID);
    }

    // Upon Loading, Set the BoardID from the URL (if there is one) and retrieve the board data.
    useEffect(() => {
        if (boardURL) {
            setBoardID(boardURL)
            console.log("BoardID set from URL: " + boardURL)
            retrieveBoardData(boardURL);
        }
        else retrieveBoardData(boardID);
    }, [user])

    return (
        <>
            <TopNavbar />
            {boardID != "" && boardData && (
                <Container fluid className='board' style={{ padding: "2rem", minHeight: "96vh", backgroundImage: `url(${backgroundURL})` }}>
                    <Row>
                        <Col xs="3">
                            <div className='lane'>
                                <h1 className='board-title-text'>{boardData?.boardName}</h1> {user?.userID == boardData.ownerID && !editBoardName && (<Button className="h1-button" size='sm' variant="secondary" onClick={() => setEditBoardName(true)}>Edit Board Title</Button>)}
                                <h6 className='board-title-text'>Sharable URL: <a href={"https://devboard.io/board/" + boardID}>devboard.io/board/{boardID}</a></h6>
                            </div>
                            {editBoardName && (
                                <>
                                    <Form.Control type="text" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} />
                                    <Button size='sm' variant="secondary" onClick={() => { updateBoardName(newBoardName); setEditBoardName(false) }}>Save</Button>
                                </>
                            )}
                        </Col>
                        <Col xs="8">
                            <JobList boardID={boardID} boardData={boardData} />
                        </Col>
                    </Row>
                </Container>
            )}
            {boardID == "" && !user && (
                <>
                    <div className="window-box">
                        <h3>You need an account to use <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>devBoard</span></h3>
                        <Button variant="success" href="/login">Get Started</Button>
                    </div>
                </>
            )}
        </>
    )
}

export default Board;