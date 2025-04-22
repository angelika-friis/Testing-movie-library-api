import { http, HttpResponse } from 'msw';

export const handlers = [
    http.post("https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token", async ({ request }) => {
        const { username, password } = await request.json();
        if (username === 'Angelika' && password === 'password') {
            return new HttpResponse('mocked-jwt-token'
                , {
                    status: 200,
                    headers: { 'Content-Type': 'text/plain' }
                });
        }
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }),
    http.get('https://tokenservice-jwt-2025.fly.dev/movies', async ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader === 'Bearer mocked-jwt-token') {
            return HttpResponse.json([
                {
                    "title": "The Matrix",
                    "director": "Lana Wachowski, Lily Wachowski",
                    "description": "Matrix är en amerikansk science fiction/actionfilm från 1999 i regi av syskonen Wachowski.",
                    "productionYear": 1999,
                    "id": 9595,
                },
                {
                    "title": "The Hobbit: An Unexpected Journey",
                    "director": "Peter Jackson",
                    "description": "Based on the 1937 novel The Hobbit by J. R. R. Tolkien. The Hobbit trilogy is the first installment in acting as a prequel to Jackson's The Lord of the Rings trilogy.",
                    "productionYear": 2012,
                    "id": 9596,
                },
                {
                    "title": "The Lord of the Rings: The Fellowship of the Ring",
                    "director": "Peter Jackson",
                    "description": "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
                    "productionYear": 2001,
                    "id": 9597,
                }
            ]);
        }
        return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    })
];