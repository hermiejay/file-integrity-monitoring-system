import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Login from './components/Login'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'
import FileScanner from './components/FileScanner'
import Alerts from './components/Alerts'
import Footer from './components/Footer'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('loggedInUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        // Set default page based on role
        setCurrentPage(userData.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('loggedInUser')
      }
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    // Set default page based on role
    setCurrentPage(userData.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')
  }

  const handleLogout = () => {
    // Clear storage
    localStorage.removeItem('loggedInUser')
    setUser(null)
    setCurrentPage('dashboard')
  }

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'user-dashboard':
        return <UserDashboard user={user} setCurrentPage={setCurrentPage} />
      case 'admin-dashboard':
        return <AdminDashboard setCurrentPage={setCurrentPage} />
      case 'scanner':
        return <FileScanner user={user} />
      case 'alerts':
        return <Alerts user={user} />
      default:
        return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard user={user} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

export default App
