import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import TopNavbar from './components/TopNavbar';
import Auth from './components/Auth';
import CreateTask from './components/CreateTask';
import { db } from './config/firebase';
import { useState, useEffect } from "react";
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { Container } from 'react-bootstrap';
import { Timestamp } from 'firebase/firestore/lite';

const siteTitle: string = "devBoard"

function App() {
  type Task = {
    id: string
    title: string,
    description: string,
    timeCreated: Timestamp
  }
  const [taskList, setTaskList] = useState<Array<Task>>()

  const taskCollectionRef = collection(db, "tasks")

  const getTaskList = async () => {
    // Get data from db
    try {
      const data = await getDocs(taskCollectionRef);
      const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id, } as Task));
      setTaskList(filteredData);
      console.log(taskList);
    } catch (err) {
      console.error(err);
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const taskDoc = doc(db, "tasks", id)
      await deleteDoc(taskDoc)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getTaskList();
  }, [])

  return (
    <>
      <TopNavbar title={siteTitle} />
      <div>
        {taskList?.map((task: Task) => (
          <div key={task.id}>
            <h1>{task.title}</h1>
            <p>{task.description}</p>
            <p>{task.timeCreated.toDate().toDateString()}</p>
            <Button onClick={() => deleteTask(task.id)}>Delete Task</Button>
          </div>

        ))}
      </div>
      <CreateTask />
      <Auth />
    </>
  )
}

export default App
