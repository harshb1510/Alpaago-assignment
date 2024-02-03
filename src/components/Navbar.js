import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const Navbar = ({ weatherData }) => {
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <>
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/">
                <span className="sr-only">Workflow</span>
                <img
                  className="h-8 w-auto sm:h-10"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                  alt=""
                />
              </Link>
            </div>
            <nav className="hidden md:flex space-x-10">
              <div className="relative">
                <span>Home</span>
              </div>
              <Link
                to={"/"}
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link
                to={"/"}
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Docs
              </Link>
              <div className="relative">
                <span>More</span>
              </div>
            </nav>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              {user ? (
                // If user is logged in, show the logout button
                <button
                  onClick={handleLogout}
                  className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Logout
                </button>
              ) : (
                // If user is not logged in, show login and signup buttons
                <>
                  <Link
                    to="/login"
                    className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
          {weatherData && (
            <div className="text-base font-medium text-gray-500 text-center">
              Weather: {weatherData.main.temp}°C, {weatherData.weather[0].description}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
