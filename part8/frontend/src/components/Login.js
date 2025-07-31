import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN, CREATE_USER } from "../queries/users";

const Login = ({ setToken, onError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      onError(error.graphQLErrors[0]?.message || "Login failed");
    },
  });

  const [createUser] = useMutation(CREATE_USER, {
    onError: (error) => {
      onError(error.graphQLErrors[0]?.message || "User creation failed");
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isRegistering) {
        await createUser({
          variables: { username, favoriteGenre },
        });
        onError("User created successfully! You can now log in.");
        setIsRegistering(false);
        setUsername("");
        setPassword("");
        setFavoriteGenre("");
      } else {
        const result = await login({
          variables: { username, password },
        });
        const token = result.data.login.value;
        localStorage.setItem("library-user-token", token);
        setToken(token);
      }
    } catch (error) {
      // Error is handled by onError callback
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setUsername("");
    setPassword("");
    setFavoriteGenre("");
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-field">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isRegistering && (
          <div className="form-field">
            <label htmlFor="favoriteGenre">Favorite Genre:</label>
            <input
              id="favoriteGenre"
              type="text"
              value={favoriteGenre}
              onChange={(e) => setFavoriteGenre(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="submit-button">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <button onClick={toggleMode} className="toggle-button">
        {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
      </button>
    </div>
  );
};

export default Login; 