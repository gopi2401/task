import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./signup";
import Login from "./login";
import AdimnLogin from "./adminlogin"
import Table from "./table"
import OrgTable from './OrgTable'
import User from "./user";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="adminlogin" element={<AdimnLogin />} />
        <Route path="table" element={<Table />} />
        <Route path="orgtable" element={<OrgTable />} />
        <Route path="user" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
