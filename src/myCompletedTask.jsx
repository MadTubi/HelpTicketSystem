import { useEffect, useState, useContext } from "react";
import {collection, query, where, getDocs, orderBy,Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";


function MyCompletedTask(){
    const {user} = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    const getDate = (value) => {
        if (!value) return null;
        if (value.toDate) return value.toDate(); // Firestore Timestamp
        return value; // JS Date
    };

    useEffect(() =>{
        if(!user) return;
        const fetchMyTasks = async () =>{
            //first day of teh current month
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0,0,0,0);


            const q = query(collection(db, "molds"), where("status", "==", "fixed"),
                                                    where("fixedBy", "==", user.firstName + " "+ user.lastName),
                                                    where("fixedAt", ">=", Timestamp.fromDate(startOfMonth)),
                                                orderBy("fixedAt", "desc"));
            
            const snapShot = await getDocs(q);
            setTasks(snapShot.docs.map(d=> ({id: d.id, ...d.data() })));
        };

        fetchMyTasks();

    }, [user]);

    return(
        <>
        <div className="page-container">
            <ul>
                <li onClick={() =>navigate("/home")} style={{ cursor: "pointer", padding: "8px 0", color: "blue" }}>Profile Page</li>
                {user?.role === "admin" && (<li onClick={() =>navigate("/createForm")} style={{ cursor: "pointer", padding: "8px 0", color: "blue" }}> Submit Mold Request Form</li>)}
                {user?.role === "admin" && (<li onClick={() =>navigate("/viewAll")} style={{ cursor: "pointer", padding: "8px 0", color: "blue" }}>View All Request</li>)}
                {user?.role === "maintenance" && (<li onClick={() =>navigate("/userViewAll")} style={{ cursor: "pointer", padding: "8px 0", color: "blue" }}>View All Request</li>)}
                {user?.role === "maintenance" && (<li onClick={() =>navigate("/myCompletedTask")} style={{ cursor: "pointer", padding: "8px 0", color: "blue" }}> My Completed Task</li>)}
            </ul>

            <h2>My Completed Tasks (This Month)</h2>

            {tasks.length === 0? (<p>No tasks completed this month</p>):(
                <table border="1">
                    <thead>
                        <tr>
                            <th>Machine</th>
                            <th>Message</th>
                            <th>Fixed At</th>
                            <th>Time Taken</th> 
                        </tr>   
                    </thead>

                    <tbody>
                        {tasks.map(task=>{
                            const submitted = getDate(task.submittedAt);
                            const fixed = getDate(task.fixedAt);
                            const diffMs = fixed - submitted;
                            const hours = Math.floor(diffMs / 3600000);
                            const days = Math.floor(hours / 24);

                            return(
                                <tr key={task.id}>
                                    <td>{task.machine}</td>
                                    <td>{task.machineMessage}</td>
                                    <td>{fixed.toLocaleString()}</td>
                                    <td>{days > 0 ?  days + " day(s)" : hours + " hour(s)"}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
            </div>
        </>
    )

}

export default MyCompletedTask;