import { Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";
import Requests from "@/pages/Requests";
import AuthPage from "@/pages/Auth";

function App() {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthPage />} />

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
      />
    </Routes>
  );
}

export default App;
