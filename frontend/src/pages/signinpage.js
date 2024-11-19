import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie"; // Import useCookies hook from react-cookie
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slice";

const Signin = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["token"]); // Initialize cookies hook and set default token cookie value
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      // Make a POST request to login
      const response = await axios.post(
        "http://127.0.0.1:8090/api/login", // API endpoint for login
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true, // This is essential to send cookies with requests
        }
      );

      const responseData = response.data;

      if (responseData.success) {
        console.log("Login Successful", response.data);

        dispatch(setUser(response?.data?.user));

        // Store the token in a cookie with an expiration time (e.g., 7 days)
        setCookie("token", responseData.token, {
          path: "/",
          expires: new Date(Date.now() + 86400000), // 86400000 ms = 1 day
        });

        navigate("/"); // Navigate to dashboard on successful login
      } else {
        setErrorMessage(responseData.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear error message whenever the user starts typing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    setErrorMessage(""); // Clear the error when the user modifies the input
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-2 mb-4 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={handleInputChange} // Use the common handler for both inputs
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={handleInputChange} // Use the common handler for both inputs
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
