import { useState } from "react";
import {useEffect} from "react";
import shortid from "shortid"
import io from 'socket.io-client';

function App() {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [socket, setSocket] = useState('');
    useEffect(() => {
        const socket = io('http://localhost:8000');
        socket.on('updateData', (serverTasks) => {setTasks(serverTasks)})
        socket.on('addTask', (serverTask)=>{addTask(serverTask)})
        socket.on('removeTask', (id)=>{removeTask(id, false)})
        setSocket(socket);
    }, []);
    const addTask = (task) => {
        console.log('Add')
        setTasks(tasks => [...tasks, task])
        socket.emit('addTask', task)
    }
    const removeTask = (id, send) => {
        setTasks(tasks => tasks.filter(task => task.id !== id))
        if (send){socket.emit('removeTask', id)}
    }
    const submitForm = (e) => {
        e.preventDefault()
        addTask({id: shortid(), name: taskName})
    }
    return (
        <div className="App">
            <header>
                <h1>ToDoList.app</h1>
            </header>
            <section className="tasks-section" id="tasks-section">
                <h2>Tasks</h2>
                <ul className="tasks-section__list" id="tasks-list">
                    {tasks.map((task)=>{return(<li key={task.id} className="task">{task.name}<button onClick={()=>removeTask(task.id, true)} className="btn btn--red">Remove</button></li>)})}
                </ul>
                <form id="add-task-form" onSubmit={submitForm}>
                    <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={(e)=>setTaskName(e.target.value)}/>
                    <button className="btn" type="submit">Add</button>
                </form>
            </section>
        </div>
    );
}

export default App;
