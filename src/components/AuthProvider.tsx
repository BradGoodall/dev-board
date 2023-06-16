import { createContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../config/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface User {
    userID: string;
    name: string;
    imageUrl: string;
    boardID: string;
}

export const AuthContext = createContext<User | null>(null);

interface AuthContextProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthContextProps) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const firestore = getFirestore();
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data() as User;
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;