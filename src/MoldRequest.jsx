import {useContext, useEffect, useState} from "react";
import {db} from "./firebase";
import {collection, addDoc,serverTimestamp} from "firebase/firestore";//serverTimestamp gets teh current time
import { UserContext } from "./UserContext"; //importthe context
import { useNavigate } from "react-router-dom";


function MoldRequest(){
    const {user} = useContext(UserContext);//get logged-in user
    const navigate = useNavigate();

    //Variables for mold request when the mod is down
    const [machine, setMachineNumber] = useState("");
    const [machineMessage, setMachineMessage] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() =>{
        if(!user || user.role !== "admin"){
            navigate("/home");//redirect if not allowed
        }

    }, [user,navigate]);

    const handleSubmission = async (e) =>{
        e.preventDefault();

        //if teh text boxes are empty or nothing is submitted
        if(!machine || !machineMessage){
            setMessage("Please fill in all fields");
            return;
        }

        try{
            await addDoc(collection(db,"molds"), {
                machine,
                machineMessage,
                requester: user.firstName + " " + user.lastName,
                role: user.role,
                userID: user.uid,
                submittedAt: serverTimestamp(),
            });

            setMessage("Machine request submitted successfully!");
            setMachineNumber("");
            setMachineMessage("");

        }catch(err){
            console.error("Error submitting request info: ", err);
            setMessage("Failed to sumbit request!");
        }
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
                <h2>Submit a Downed Mold Request</h2>
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmission}>
                

                    <label>Select in the machine number: </label>
                    <select value={machine} onChange={(e) =>setMachineNumber(e.target.value)}>
                        <option disabled value="">Please Select</option>

                        <optgroup label="Honda">
                            <option value="G-19">G-19</option>
                            <option value="G-18">G-18</option>
                            <option value="D-42">D-42</option>
                        </optgroup>    

                        <optgroup label="Toyota (Big Side)">
                            <option value="G-21">G-21</option>
                            <option value="F-36">F-36</option>
                            <option value="D-37">D-37</option>
                            <option value="D-38">D-38</option>
                            <option value="E-57">E-57</option>
                            <option value="E-41">E-41</option>
                            <option value="E-40">E-40</option>
                            <option value="F-24">F-24</option>
                            <option value="G-10">G-10</option>
                        </optgroup>

                        <optgroup label="Toyota(Small Side)">
                            <option value="C-72">C-72</option>
                            <option value="B-44">B-44</option>
                            <option value="C-105">C-105</option>
                            <option value="B-42">B-42</option>
                            <option value="C-108">C-108</option>
                            <option value="C-93">C-93</option>
                            <option value="D-39">D-39</option>
                            <option value="E-45">E-45</option>
                        </optgroup>
                    </select> <br />

                    <label>Describe the problem for the machine selected above: </label>
                    <textarea value={machineMessage} rows="5" cols="50" onChange={(e) =>setMachineMessage(e.target.value)}/><br />

                    <label>Name of the requester: </label>
                    <input type="text"  value={user.firstName + " " + user.lastName} disabled /><br />

                    <button type="submit">Submit Mold</button>
                </form>

            </div>
            </div>

        </>
    )
}

export default MoldRequest;
//for admins
