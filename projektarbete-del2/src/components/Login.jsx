import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Användarnamn"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>
  );
}

export default Login;
