import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  test,
  expect,
} from "vitest";

let jwtToken;

beforeAll(async () => {
  const res = await fetch(
    "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Username",
        password: "Password",
      }),
    }
  );

  jwtToken = await res.text();
});

describe("GET /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        title: "Testfilm",
        description:
          "Det här är en testfilm som används för att testa API:et med Vitest.",
        director: "Testregissör",
        productionYear: 2025,
      }),
    });

    createdMovie = await res.json();
  });

  afterEach(async () => {
    if (createdMovie?.id) {
      await fetch(
        `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
    }
  });

  test("returnerar status 200 och en film", async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });

  test("GET /movies/{id} returnerar rätt film", async () => {
    const res = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie?.id}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.title).toBe("Testfilm");
  });
});

describe("DELETE /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        title: "Film att radera",
        description: "Den här filmen skapas i beforeEach och raderas i testet.",
        director: "Testregissör",
        productionYear: 2024,
      }),
    });

    createdMovie = await res.json();
  });

  test("DELETE returnerar 204", async () => {
    expect(createdMovie?.id).toBeDefined();

    const res = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    expect(res.status).toBe(204);
  });
});

describe("POST + DELETE i ett test", () => {
  test("skapar och raderar en film i samma test", async () => {
    const movieData = {
      title: "Testfilm",
      description: "Det här är en testfilm som raderas i samma test.",
      director: "Testregissör",
      productionYear: 2023,
    };

    const postRes = await fetch(
      "https://tokenservice-jwt-2025.fly.dev/movies",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(movieData),
      }
    );

    const createdMovie = await postRes.json();
    expect(postRes.status).toBe(201);
    expect(createdMovie?.id).toBeDefined();

    const deleteRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    expect(deleteRes.status).toBe(204);
  });
});

describe("PUT + GET i samma test", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        title: "Originaltitel",
        description: "Film för att testa PUT och GET.",
        director: "Testregissör",
        productionYear: 2025,
      }),
    });

    createdMovie = await res.json();
  });

  afterEach(async () => {
    if (createdMovie?.id) {
      await fetch(
        `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
    }
  });

  test("PUT uppdaterar filmens titel och GET visar den nya titeln", async () => {
    const updatedData = {
      title: "Uppdaterad titel",
      description: createdMovie.description,
      director: createdMovie.director,
      productionYear: createdMovie.productionYear,
    };

    const putRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    expect(putRes.status).toBe(200);

    const getRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const getData = await getRes.json();
    expect(getRes.status).toBe(200);
    expect(getData.title).toBe("Uppdaterad titel");
  });
});
