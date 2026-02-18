//Routes
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register_Page";
import Login from "./LogIn_Page";
import Home from "./HomePage";
import Create from "./MoldRequest";
import View from "./viewForms";
import Uview from "./userViewForms";
import TaskView from "./myCompletedTask";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createForm" element={<Create />} />
          <Route path="/viewAll" element={<View />} />
          <Route path="/userViewAll" element={<Uview />}/>
          <Route path="/myCompletedTask" element={<TaskView />}/>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
