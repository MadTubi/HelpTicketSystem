import {useState} from "react";
import {db} from "./firebase";
import { doc, setDoc, getDoc} from "firebase/firestore";//Used to create a custom register/log in page
import {useNavigate} from "react-router-dom";//Used to move through pages
import {useContext} from "react";
import {UserContext} from "./UserContext";


function LogIn_Page() {
  const [idNum, setIdNum] = useState("");
  const [passcode, setPasscode] = useState("");
  const [ error, setError] = useState("");
  const navigate = useNavigate();
  const {setUser} = useContext(UserContext);


  const handleLogin = async (e) =>{
    e.preventDefault();

    const userRef = doc(db, "users", idNum);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()){
      setError("User ID does not exist");
      return;
    }

    const userData = userSnap.data();
    if(userData.passcode !== passcode){
      setError("Incorrect passcode");
      return;
    }

    //Login sucess navigate to success page with the entered data
    setUser({firstName: userData.firstName, lastName: userData.lastName, role:userData.role, uid:idNum});
    navigate("/home");
  };

  return (
    <>
    <div className="page-container">
      <div>

        <h1>Login Page</h1>
        {error && <p style={{color:"red"}}>{error}</p>}

        <form onSubmit={handleLogin}>

          <label>Enter in your User ID:</label>
          <input type="text" placeholder="5-digit User ID" value={idNum} onChange={(e) =>setIdNum(e.target.value)} /><br />

          <label>Enter in passcode: </label>
          <input type="password" placeholder="4-digit passcode" value={passcode} onChange={(e) =>setPasscode(e.target.value)} />< br />

          <button type="submit">Login</button>
        </form>

        <button onClick={() =>navigate("/register")} style={{marginTop: "20px"}}> Don't have an account?Click here!</button>
      </div>
      </div>
    </>
  )
}

export default LogIn_Page;
