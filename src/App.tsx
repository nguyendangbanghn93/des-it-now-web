import { Route, Routes } from "react-router-dom";

import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";
import Loading from "@/components/commons/Loading";
import PrivateRoute from "@/components/PrivateRoute";
import Requests from "@/pages/Requests";
import { ConfigProvider } from "@/stores/configStore";
import FinancialManagement from "@/pages/FinancialManagement";
import User from "@/pages/User";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth/*" element={<AuthPage />} />
        <Route
          path="*"
          element={
            <Layout>
              <PrivateRoute>
                <Routes>
                  <Route path="/user/*" element={<User />} />
                  <Route
                    path="*"
                    element={
                      <ConfigProvider>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/requests" element={<Requests />} />
                          <Route path="/information" element={<Dashboard />} />
                          <Route
                            path="/financial"
                            element={<FinancialManagement />}
                          />
                        </Routes>
                      </ConfigProvider>
                    }
                  />
                </Routes>
              </PrivateRoute>
            </Layout>
          }
        />
      </Routes>
      <Loading />
    </>
  );
}

export default App;
