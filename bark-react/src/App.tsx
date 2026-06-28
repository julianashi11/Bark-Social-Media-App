import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurrentUserProvider, useCurrentUser } from './context/CurrentUserContext';
import NavBar from './components/NavBar';
import PickUser from './pages/PickUser';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import FindUsers from './pages/FindUsers';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';

// Layout shell shown on every authenticated route. If no user is
// picked yet, redirects to /pick-user.
function ProtectedShell({ children }: { children: ReactNode }) {
  const { user } = useCurrentUser();
  if (!user) return <Navigate to="/pick-user" replace />;
  return (
    <div className="page">
      <NavBar />
      <main className="page-content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <CurrentUserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/pick-user" element={<PickUser />} />
          <Route
            path="/feed"
            element={
              <ProtectedShell>
                <Feed />
              </ProtectedShell>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedShell>
                <Profile />
              </ProtectedShell>
            }
          />
          <Route
            path="/find"
            element={
              <ProtectedShell>
                <FindUsers />
              </ProtectedShell>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedShell>
                <Groups />
              </ProtectedShell>
            }
          />
          <Route
            path="/groups/:groupId"
            element={
              <ProtectedShell>
                <GroupDetail />
              </ProtectedShell>
            }
          />
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </BrowserRouter>
    </CurrentUserProvider>
  );
}
