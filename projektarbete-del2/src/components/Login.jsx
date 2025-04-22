import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");

  const handleLogin = async () => {
    const res = await fetch(
      "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );
    const jwt = await res.text();
    setToken(jwt);
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Användarnamn"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Logga in</button>
    </div>
  );
}

export default Login;
