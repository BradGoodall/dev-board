// Firebase Authorisation
import { AuthContext } from './AuthProvider';
//React
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
import { Button } from 'react-bootstrap'
import { Form } from "react-bootstrap";

type BoardData = {
    boardName: string,
    boardCustomURL: string,
    ownerID: string
}

function Board() {
    const user = useContext(AuthContext);

    const [boardID, setBoardID] = useState("");
    const [boardData, setBoardData] = useState<BoardData>();
    const [newBoardName, setNewBoardName] = useState("");
    const { boardURL } = useParams();

    const [editBoardName, setEditBoardName] = useState(false);



    // Get the users board data
    const retrieveBoardData = async () => {
        try {
            let loadableBoardID = boardID;
            if (boardID == "") {
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
            setNewBoardName(boardData.boardName)
            console.log('#READ Retreived Board Data & Name');

        } catch (error) {
            console.error(error);
        };
    }

    const updateBoardName = async (name: string) => {
        const docRef = doc(db, "boards/" + boardID);
        await updateDoc(docRef, {
            boardName: name,

        })
        console.log('#WRITE Updated Board Name');
        await retrieveBoardData();
    }

    useEffect(() => {
        if (user) {
            if (boardURL) {
                setBoardID(boardURL)
                console.log("BoardID set from URL")
            }
            retrieveBoardData();
        }
    }, [user])

    return (
        <>
            <TopNavbar />
            {user && boardID != "" && (
                <>
                    {!editBoardName && (
                        <h1>{boardData?.boardName} <Button size='sm' variant="secondary" onClick={() => setEditBoardName(true)}>Edit Board Title</Button></h1>
                    )}
                    {editBoardName && (
                        <>
                            <Form.Control type="text" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} />
                            <Button size='sm' variant="secondary" onClick={() => { updateBoardName(newBoardName); setEditBoardName(false) }}>Save</Button>
                        </>
                    )}
                    <h5 style={{ color: 'gray' }}>Board ID: {boardID}</h5>

                    <JobList boardID={boardID} />
                </>
            )}
        </>
    )
}

export default Board;