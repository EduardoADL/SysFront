import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import Landing from "./pages/Landing/Landing";
import ProtectedRoute from './components/ProtectedRoute';
import { BalanceProvider } from "./context/BalanceContext";

function RoutesCfg() {
  return (
    <BalanceProvider>
      <Router>
        <Routes >
          <Route path="/" element={<Home />} />
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
    </BalanceProvider>
  );
}

export default RoutesCfg;