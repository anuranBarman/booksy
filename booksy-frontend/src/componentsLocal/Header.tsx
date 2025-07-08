import { Button } from "@/components/ui/button"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const isAuthPage = location.pathname === "/auth"

  const handleLogout = () => {
    logout()
    navigate("/auth")
  }

  const handleMyBooks = () => {
    navigate("/library")
  }

  const handleActivity = () => {
    navigate("/activity")
  }

  const handleRatings = () => {
    navigate("/ratings")
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold">
          Booksy
        </Link>

        {!isAuthPage && (
          <nav className="flex gap-4 items-center">
            {isLoggedIn && <Button variant="ghost" onClick={handleActivity}>
                Activity
              </Button>}
            {isLoggedIn && <Button variant="ghost" onClick={handleRatings}>
                Ratings
              </Button>}
            {isLoggedIn && <Button variant="ghost" onClick={handleMyBooks}>
                Library
              </Button>}
            {isLoggedIn ? (
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}