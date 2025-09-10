// src/App.js
import { HashRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import HomePage from "./pages/HomePage";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import PetAdoptionQuiz from "./pages/PetQuiz";
import PetSchedule from "./pages/PetSchedule";
import SellPetForm from "./pages/SellPetForm";
import PetResults from "./pages/PetResult";
import PetBrowse from "./pages/PetBrowse";
import CreditScore from "./pages/creditScore";
import DonationPage from "./pages/DonationPage";
import AdoptPage from "./pages/AdoptPAge.js";
import AdoptionStoriesPage from "./pages/AdoptionStoriesPage"; // Import the new component
// A simple component to protect routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner/loader
  }
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();

  const handleQuizComplete = (recommendedPet, location) => {
    console.log(`Recommended Pet: ${recommendedPet}, Location: ${location}`);
    navigate(`/pet-results?pet=${recommendedPet}&location=${location}`);
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protect routes that require authentication */}
      <Route path="/quiz" element={<ProtectedRoute><PetAdoptionQuiz onQuizComplete={handleQuizComplete} /></ProtectedRoute>} />
      <Route path="/pet-schedule" element={<ProtectedRoute><PetSchedule /></ProtectedRoute>} />
      <Route path="/sell-pet" element={<ProtectedRoute><SellPetForm /></ProtectedRoute>} />
      <Route path="/pet-results" element={<ProtectedRoute><PetResults /></ProtectedRoute>} />
      <Route path="/pets" element={<ProtectedRoute><PetBrowse /></ProtectedRoute>} />
      <Route path="/credit-score" element={<ProtectedRoute><CreditScore /></ProtectedRoute>} />
      <Route path="/donations" element={<DonationPage/>}/>
      <Route path="/adopt/:id" element={<ProtectedRoute><AdoptPage /></ProtectedRoute>} />
      <Route path="/stories" element={<ProtectedRoute><AdoptionStoriesPage /></ProtectedRoute>} /> {/* NEW ROUTE */}
      {/* Add more protected routes as needed */}
    </Routes>
  );
}

export default App;