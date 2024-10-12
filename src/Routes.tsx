import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Landing from "./pages/Landing/Landing";
import ProtectedRoute from './components/ProtectedRoute';

function RoutesCfg() {
  return (
    <Router>
      <Routes >
        <Route  path="/" element={<Home />} />
        <Route
          path="/landing"
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default RoutesCfg;