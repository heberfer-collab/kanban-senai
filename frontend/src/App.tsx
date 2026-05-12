import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Categories } from './pages/Categories';
import { Profile } from './pages/Profile';
import { SharedTask } from './pages/SharedTask';
import { MainLayout } from './components/MainLayout';
import { useAuthStore } from './store/authStore';

// Componente para proteger rotas
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(state => state.token);
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/shared/:token" element={<SharedTask />} />
        
        {/* Rotas Protegidas */}
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="categories" element={<Categories />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
