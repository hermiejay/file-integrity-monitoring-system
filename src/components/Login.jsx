import { useState } from 'react';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();

    // Check if admin login
    if (formData.username === 'admin' && formData.password === 'admin123') {
      // Admin login
      const adminUser = {
        username: 'admin',
        role: 'admin'
      };
      localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
      onLogin(adminUser);
      setMessage('Admin login successful!');
      return;
    }

    // Regular user login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === formData.username && u.password === formData.password);

    if (user) {
      const loggedInUser = {
        username: user.username,
        role: 'user'
      };
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      onLogin(loggedInUser);
      setMessage('Login successful!');
    } else {
      setMessage('Invalid username or password');
    }
  };

  // Handle register
  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.username.length < 3) {
      setMessage('Username must be at least 3 characters');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.username === formData.username);

    if (existingUser) {
      setMessage('Username already exists');
      return;
    }

    // Add new user
    users.push({
      username: formData.username,
      password: formData.password
    });

    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after registration
    const loggedInUser = {
      username: formData.username,
      role: 'user'
    };
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    onLogin(loggedInUser);
    setMessage('Registration successful!');
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          {isLogin ? 'Login' : 'Register'} - FIMS
        </h2>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-md text-sm ${
              message.includes('successful') || message.includes('successful')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
              setFormData({ username: '', password: '' });
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>

     
     
          
        
      </div>
    </div>
  );
};

export default Login;
