import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { server } from './server';
import Login from '../../components/Login';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('hämtar och visar filmer efter inloggning'
    , async () => {
        render(<Login />);

        const usernameTextField = screen.getByPlaceholderText("Användarnamn");
        const passwordTextField = screen.getByPlaceholderText("Lösenord");
        const button = screen.getByRole('button');

        fireEvent.change(usernameTextField, { target: { value: 'Angelika' } });
        fireEvent.change(passwordTextField, { target: { value: 'password' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/The Matrix/)).toBeInTheDocument();
            expect(screen.getByText(/1999/)).toBeInTheDocument();
            expect(screen.getByText(/Lana Wachowski, Lily Wachowski/)).toBeInTheDocument();
        });
    });