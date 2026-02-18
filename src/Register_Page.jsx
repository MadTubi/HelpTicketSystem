import {useState} from "react";
import {db} from "./firebase";
import { doc, setDoc, getDoc} from "firebase/firestore";//Used to create a custom register/log in page
import {useNavigate} from "react-router-dom";//Used to move through pages


function Register_Page(){

    //variables used to set up information for the user
    const[idNum, setIdNum] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("maintenance");
    const [passcode, setPasscode] = useState("");
    const [confirmPasscode, setConfirmPasscode] = useState("");
    const [ error, setError] = useState("");
    const navigate = useNavigate();

    //function to stop the page from reloading and resetting all the 
    //information entered
    const handleRegister = async (e) =>{
        e.preventDefault();

        //Validation

        //user id must be 5 digits long
        if(!/^\d{5}$/.test(idNum)){
            setError("User ID must be 5 digits!");
            return;
        }

        //passcode should be 4 digits long
        if(!/^\d{4}$/.test(passcode)){
            setError("Passcode must be 4 digits!");
            return;
        }

        //check if passcodes match
        if(passcode !== confirmPasscode){
            setError("Passcodes do not match.")
            return;
        }

        const userRef = doc(db, "users", idNum);
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()){
            setError("User ID already exists!");
            return;
        }

        //Save to firestore
        await setDoc(userRef, {firstName, lastName, role, passcode});

        //Navigate to login
        navigate("/");
    };

    return(
        <>
        <div className="page-container">
            <div>
                <h1>Registration Page</h1>
                {error && <p style={{color:"red"}}>{error}</p>}

                <form onSubmit={handleRegister}>
                    <label>Enter in a User ID: </label>
                    <input type="text" placeholder="5-digit User ID" value={idNum} onChange={(e) => setIdNum(e.target.value)} /><br />

                    <label>Enter in your first name: </label>
                    <input type="text" placeholder="i.e John" value={firstName} onChange={(e) => setFirstName(e.target.value)} /><br />

                    <label>Enter in your last name: </label>
                    <input type="text" placeholder="i.e Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} /><br />

                    <label>Select Role: </label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="maintenance">Maintenance</option>
                    </select><br />

                    <label>Enter in a passcode: </label>
                    <input type = "password" placeholder="4-digit passcode" value={passcode} onChange= {(e) =>setPasscode(e.target.value)} /><br />

                    <label>Re-enter in a passcode: </label>
                    <input type = "password" placeholder="4-digit passcode" value={confirmPasscode} onChange= {(e) =>setConfirmPasscode(e.target.value)} /><br />


                    <button type="submit">Register </button>               
                </form>

            </div>
            </div>
        
        </>
    );

}

export default Register_Page;