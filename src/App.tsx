import { Route, Routes } from "react-router-dom";
import Register from "@/components/Register";
import Login from "@/components/Login";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";
import Requests from "@/pages/Requests";

function App() {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/information" element={<Dashboard />} />
            </Routes>
          </Layout>
        }
      >
        {/* <Layout><></></Layout> */}
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
