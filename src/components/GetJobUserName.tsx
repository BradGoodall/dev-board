import { db } from '../config/firebase';
import { useState, useEffect } from "react";
import { getDoc, doc } from 'firebase/firestore';

type UserData = {
    name: string,
    imageUrl: string
}

interface Props {
    userID: string
}

export const GetJobUserName: React.FC<Props> = ({ userID }) => {

    // Retrieve the Creators Username from a jobID
    const [username, setUsername] = useState('Loading...');
    const [imgURL, setImgURL] = useState("");

    useEffect(() => {
        const getUserName = async () => {
            const docRef = doc(db, "users/" + userID);
            const jobDocument = await getDoc(docRef);
            const userData = jobDocument.data() as UserData;
            setUsername(userData.name);
            setImgURL(userData.imageUrl);
            console.log('#READ Retrieved Username')
        }
        getUserName()
    }, []);

    return (
        <><img className='navbar-user-image' src={imgURL} alt="Profile Image" /> {username} </>
    )
}
