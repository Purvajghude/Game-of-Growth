// Temporary bypass: the dashboard is now accessible without authentication.
export default function RequireAuth({ children }) {
  return children;
}
