import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
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


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================================= */}
        {/* DEFAULT PAGE */}
        {/* ================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/register"
              replace
            />
          }
        />


        {/* ================================= */}
        {/* AUTHENTICATION */}
        {/* ================================= */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================================= */}
        {/* DASHBOARD */}
        {/* ================================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ================================= */}
        {/* PROFILE */}
        {/* ================================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* ================================= */}
        {/* ACADEMIC DETAILS */}
        {/* ================================= */}

        <Route
          path="/academic-details"
          element={<AcademicDetails />}
        />


        {/* ================================= */}
        {/* SKILLS */}
        {/* ================================= */}

        <Route
          path="/skills"
          element={<Skills />}
        />


        {/* ================================= */}
        {/* INTEREST ASSESSMENT */}
        {/* ================================= */}

        <Route
          path="/interest-assessment"
          element={<InterestAssessment />}
        />


        {/* ================================= */}
        {/* SKILL ASSESSMENT */}
        {/* ================================= */}

        <Route
          path="/skill-assessment"
          element={<SkillAssessment />}
        />


        {/* ================================= */}
        {/* AI PREDICTION */}
        {/* ================================= */}

        <Route
          path="/ai-prediction"
          element={<Prediction />}
        />


        {/* ================================= */}
        {/* CAREER ROADMAP */}
        {/* ================================= */}

        <Route
          path="/career-roadmap"
          element={<CareerRoadmap />}
        />


        {/* ================================= */}
        {/* COURSES */}
        {/* ================================= */}

        <Route
          path="/courses"
          element={<Courses />}
        />


        {/* ================================= */}
        {/* CAREER REPORT */}
        {/* ================================= */}

        <Route
          path="/career-report"
          element={<CareerReport />}
        />


        {/* ================================= */}
        {/* UNKNOWN URL */}
        {/* ================================= */}

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