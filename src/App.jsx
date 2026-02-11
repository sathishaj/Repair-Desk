import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Jobcard from './pages/Jobcard';
import Customerpage from './pages/Customerpage';
import Adminpage from './pages/Adminpage';
import Loginpage from './pages/Loginpage';
import Authguard from './pages/Authguard'
import Profilepage from './pages/Profilepage';

function App() {
  

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Loginpage />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <Authguard>
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/Profile" element={<Profilepage />} />
                <Route path="/Customer" element={<Customerpage />} />
                <Route path="/Jobcard" element={<Jobcard />} />
                <Route path="/Admin" element={<Adminpage />} />
              </Routes>
            </>
          </Authguard>
        }
      />
    </Routes>
  );
}

export default App;
