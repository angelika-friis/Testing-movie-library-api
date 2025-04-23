import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");

  const [movies, setMovies] = useState([]);

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

    if (!res.ok) {
      alert("Fel användarnamn eller lösenord");
      return;
    }

    const jwt = await res.text();
    setToken(jwt);

    const moviesRes = await fetch(
      "https://tokenservice-jwt-2025.fly.dev/movies",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!moviesRes.ok) {
      alert("Misslyckades att hämta filmer");
      return;
    }

    const moviesList = await moviesRes.json();
    setMovies(moviesList);

    setUsername("");
    setPassword("");
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

      {token && <p>Inloggad</p>}

      {token && movies.length === 0 && <p>Det finns inga filmer att visa</p>}

      {movies.length > 0 && (
        <ul>
          {movies.map((film) => (
            <li key={film.id}><strong>{film.title}</strong> ({film.productionYear}) - <i>{film.director}</i></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Login;
