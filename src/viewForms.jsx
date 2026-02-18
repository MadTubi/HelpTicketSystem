import {useEffect, useState, useContext} from "react";
import {db} from "./firebase";
import {collection, getDocs, query, orderBy} from "firebase/firestore";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

function ViewForms(){
    const [maintenanceForms, setMaintenanceForms] = useState([]);
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    //if they are not an admin, then go back to the home page
    useEffect(() =>{
        if(!user || user.role !== "admin"){
            navigate("/home");
        }
    }, [user,navigate]);

    useEffect(() =>{
        const fetchForms = async () =>{
            try{
                const q = query(collection(db,"molds"), orderBy("submittedAt", "desc"));
                const querySnapShot = await getDocs(q);
                const formData = querySnapShot.docs.map((doc) =>({id:doc.id, ...doc.data()}));
                setMaintenanceForms(formData);

            }catch(err){
                console.error("Error fetching forms: ", err);
            }
        };

        fetchForms();
    }, []);

    //calculate time difference
    const calTimeDiff = (submittedAt,fixedAt) =>{
        const diffMs = fixedAt - submittedAt;
        const mins = Math.floor(diffMs/60000);
        const hours = Math.floor(mins/60);
        const days = Math.floor(hours/24);

        if(days > 0) return days + " day(s)";
        if(hours > 0) return hours + " hour(s)";
        return mins + " minute(s)";
    };

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

        <h2>Submitted Mold Requests</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Machine</th>
                        <th>Machine Message</th>
                        <th>Requester</th>
                        <th>Time Submitted</th>
                        <th>Time Pending</th>
                    </tr>
                    
                </thead>

                <tbody>
                    {maintenanceForms.map(form =>(
                        <tr key={form.id}>
                            <td>{form.machine}</td>
                            <td>{form.machineMessage}</td>
                            <td>{form.requester}</td>
                            <td>{form.submittedAt.toDate().toLocaleString()}</td>
                            <td>{calTimeDiff(form.submittedAt.toDate(), new Date())}</td>
                        </tr>  

                    ))}
                </tbody>
            </table>
            </div>
        </>
    );


}

export default ViewForms;
//for admins