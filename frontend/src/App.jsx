import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AcademicDetails from "./pages/AcademicDetails";
import Skills from "./pages/Skills";
import InterestAssessment from "./pages/InterestAssessment";
import SkillAssessment from "./pages/SkillAssessment";
import Prediction from "./pages/Prediction";
import CareerRoadmap from "./pages/CareerRoadmap";
import Courses from "./pages/Courses";
import CareerReport from "./pages/CareerReport";

import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/register"
              replace
            />
          }
        />

        {/* AUTH */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        {/* FORGOT PASSWORD */}

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPassword />
          }
        />

        {/* MAIN APPLICATION */}

        <Route
          element={
            <Layout />
          }
        >

          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />

          <Route
            path="/profile"
            element={
              <Profile />
            }
          />

          <Route
            path="/academic-details"
            element={
              <AcademicDetails />
            }
          />

          <Route
            path="/skills"
            element={
              <Skills />
            }
          />

          <Route
            path="/interest-assessment"
            element={
              <InterestAssessment />
            }
          />

          <Route
            path="/skill-assessment"
            element={
              <SkillAssessment />
            }
          />

          <Route
            path="/ai-prediction"
            element={
              <Prediction />
            }
          />

          <Route
            path="/career-roadmap"
            element={
              <CareerRoadmap />
            }
          />

          <Route
            path="/courses"
            element={
              <Courses />
            }
          />

          <Route
            path="/career-report"
            element={
              <CareerReport />
            }
          />

        </Route>

        {/* UNKNOWN */}

        <Route
          path="*"
          element={
            <Navigate
              to="/register"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;