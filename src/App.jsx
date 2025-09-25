import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RoleRoute from "./components/RoleRoute";

// Dashboards
import DashboardLayout from "./layouts/DashboardLayout";
// import AdminDashboard from "./pages/AdminDashboard";
import HrDashboard from "./pages/HrDashboard";
import CandidatePortal from "./pages/CandidatePortal";

// Auth
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// HR Sub-Pages
import JobsBoard from "./pages/Jobs/JobsBoard";
import CandidatesList from "./pages/Candidates/CandidatesList";
import CandidateProfile from "./pages/Candidates/CandidateProfile";
import PipelineBoard from "./pages/Candidates/PipelineBoard";
import AssessmentBuilder from "./pages/Assessments/AssessmentBuilder";
import AssessmentRuntime from "./pages/Assessments/AssessmentRuntime";
import Test from "./pages/Candidates/Test";
import JobDescription from "./pages/Jobs/JobDescription";
import AssessmentsHome from "./pages/Assessments/AssessmentsHome";
import JobForm from "./pages/Jobs/JobEdit";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<DashboardLayout><Login /></DashboardLayout>} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes */}
          {/* <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          /> */}
          <Route
            path="/test"
            element={
                <Test/>
            }
          />

          {/* HR Routes */}
          <Route
            path="/hr"
            element={<DashboardLayout>
              <RoleRoute allowedRoles={["hr", "admin"]}>
                <HrDashboard />
              </RoleRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/jobs"
            element={<DashboardLayout>
              <RoleRoute allowedRoles={["hr", "admin"]}>
                <JobsBoard />
              </RoleRoute>
              </DashboardLayout>
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <RoleRoute allowedRoles={["hr", "admin"]}>
                <JobDescription />
              </RoleRoute>
            }
          />

          <Route
            path="/candidates"
            element={
              <DashboardLayout>
              <RoleRoute allowedRoles={["hr", "admin"]}>
                <CandidatesList />
              </RoleRoute>
              </DashboardLayout>
            }
          />

          <Route
            path="/jobs/edit/:id"
            element={
              <DashboardLayout>
                <RoleRoute allowedRoles={["hr", "admin"]}>
                  <JobForm />   {/* or a dedicated JobEdit page */}
                </RoleRoute>
              </DashboardLayout>
            }
          />



          <Route
            path="/candidates/:id"
            element={<DashboardLayout>
              <RoleRoute allowedRoles={["hr", "admin"]}>
                <CandidateProfile />
              </RoleRoute>
              </DashboardLayout>
            }
          />

           <Route
          path="/pipeline"
          element={<DashboardLayout>
            <RoleRoute allowedRoles={["hr", "admin"]}>
              <PipelineBoard />
            </RoleRoute>
            </DashboardLayout>
          }
          />
          

          {/* <Route
            path="/assessments"
            element={<DashboardLayout>
              <RoleRoute allowedRoles={["hr", "admin"]}>
                <AssessmentBuilder />
              </RoleRoute>
              </DashboardLayout>
            }
          /> */}

          <Route
            path="/assessments"
            element={
              <DashboardLayout>
                <RoleRoute allowedRoles={["hr", "admin"]}>
                  <AssessmentsHome />
                </RoleRoute>
              </DashboardLayout>
            }
          />

          <Route
            path="/assessments/builder/:jobId"
            element={
              <DashboardLayout>
                <RoleRoute allowedRoles={["hr", "admin"]}>
                  <AssessmentBuilder />
                </RoleRoute>
              </DashboardLayout>
            }
          />

          <Route
            path="/assessments/:assessmentId/runtime"
            element={
              <DashboardLayout>
                <RoleRoute allowedRoles={["hr", "admin"]}>
                  <AssessmentRuntime />
                </RoleRoute>
              </DashboardLayout>
            }
          />


          {/* Candidate Routes */}
          <Route
            path="/candidate"
            element={
              <DashboardLayout>
              <RoleRoute allowedRoles={["candidate", "admin"]}>
                <CandidatePortal />
              </RoleRoute>
              </DashboardLayout>
            }
          />

          {/* Fallback → redirect to login */}
          <Route path="*" element={<DashboardLayout><Login /></DashboardLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
