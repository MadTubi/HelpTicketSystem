import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import {UserContext} from "./UserContext";
import {getWeeklyTasks, generateCSV, downloadCSV} from "./weeklyReport.jsx"

function HomePage(){
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const handleDownloadWeeklyReport = async () => {
        const tasks = await getWeeklyTasks();
        const csv = generateCSV(tasks);
        downloadCSV(csv, "weekly_maintenance_report.csv");
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

        <div>
            {user.role === "admin" && (
                <button onClick={handleDownloadWeeklyReport}>
                    Download Weekly Maintenace Report
                </button>
            )}
        </div>

        

        <div>
            <h1>Login Successful!</h1>
            <p>Welcome ,  {user?.firstName} {user?.lastName}</p>
            <p>Role: {user?.role}</p>
        </div>

        <div>
            
            {/*LOG OUT BUTTON*/}
            <button onClick={() => navigate("/", {replace: true})}>Log Out</button>
        </div>
        </div>
            
        </>
    )

}

export default HomePage;


