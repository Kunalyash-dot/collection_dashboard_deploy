import {BrowserRouter,Routes,Route} from 'react-router-dom'
// import SignIn from './pages/SignIn';
import Home from './pages/Home';
import StateHeadHome from './pages/stateHead/Home';
import EmployeeHome from './pages/employees/Home';
import UserCreation from './pages/UserCreation';
import ManagerCreation from './pages/ManagerCreation';
import BranchCreation from './pages/BranchCreation';
import CustomerCreation from './pages/CustomerCreation';
import BulkUpload from './pages/BulkUpload';
import Charts from './pages/Charts';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './utils/ProtectedRoute';
import DataTable from './pages/DataTable';
import EmployeeDataTable from './pages/EmployeeDataTable';
import AccessDenied from './pages/AccessDenied';
import EmployeeChart from './pages/employees/EmployeeChart';



function App() {
 
  return (
   <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<LoginPage />} />

         {/* Role-Based Protected Routes */}
         {/* Admin Dashboard */}
        <Route path='/' element={<ProtectedRoute roles={['Admin',"Manager","StateHead","Employee"]} component={Home }/>}  />
        <Route
          path="/creation/users"
          element={<ProtectedRoute roles={["Admin"]} component={UserCreation} />}
        />
        <Route
          path="/creation/managers"
          element={<ProtectedRoute roles={["Admin"]} component={ManagerCreation} />}
        />
        <Route
          path="/creation/branches"
          element={<ProtectedRoute roles={["Admin"]} component={BranchCreation} />}
        />
        <Route
          path="/creation/customers"
          element={<ProtectedRoute roles={["Admin"]} component={CustomerCreation} />}
        />
        <Route
          path="/creation/bulk-upload"
          element={<ProtectedRoute roles={["Admin"]} component={BulkUpload} />}
        />
        <Route
          path="/charts"
          element={<ProtectedRoute roles={["Admin"]} component={Charts} />}
        />
        <Route
          path="/data"
          element={<ProtectedRoute roles={["Admin"]} component={DataTable} />}
        />

          {/* State Head Dashboard */}
          <Route
          path="/statehead/dashboard"
          element={<ProtectedRoute roles={["StateHead"]} component={StateHeadHome} />}
        />
        <Route
          path="/statehead/table"
          element={<ProtectedRoute roles={["StateHead"]} component={Charts} />}
        />
        <Route
          path="/statehead/data"
          element={<ProtectedRoute roles={["StateHead"]} component={DataTable} />}
        />

        {/* Manager Dashboard */}
        <Route
          path="/manager/:id/dashboard"
          element={<ProtectedRoute roles={["Manager"]} component={Home} />}
        />
        <Route
          path="/manager/table"
          element={<ProtectedRoute roles={["Manager"]} component={Charts} />}
        />
         <Route
          path="/manager/data"
          element={<ProtectedRoute roles={["Manager"]} component={DataTable} />}
        />

        {/* Employee Dashboard */}
        <Route
          path="/employee/:id/dashboard"
          element={<ProtectedRoute roles={["Employee"]} component={EmployeeHome} />}
        />
<Route
          path="/employee/table"
          element={<ProtectedRoute roles={["Employee"]} component={EmployeeChart} />}
        />
         <Route
          path="/employee/data"
          element={<ProtectedRoute roles={["Employee"]} component={EmployeeDataTable} />}
        />
         {/* Unauthorized Page */}
         <Route path="/unauthorized" element={<AccessDenied />} />
      </Routes>

   </BrowserRouter>
  )
}

export default App;
