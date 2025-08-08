// src/pages/__tests__/Home.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../home';
import * as userApi from '../../api/userApi';

jest.mock('../../api/userApi');

describe('Home page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays fetched users', async () => {
        (userApi.getUsers as jest.Mock).mockResolvedValue([
            { name: 'Alice', email: 'alice@example.com' },
        ]);

        render(<Home />);
        expect(await screen.findByText(/Alice/i)).toBeInTheDocument();
        expect(screen.getByText(/alice@example.com/i)).toBeInTheDocument();
    });

    test('adds a new user', async () => {
        (userApi.getUsers as jest.Mock).mockResolvedValue([]);
        (userApi.addUser as jest.Mock).mockResolvedValue({
            name: 'Bob',
            email: 'bob@example.com',
        });

        render(<Home />);
        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Bob' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'bob@example.com' } });

        fireEvent.click(screen.getByRole('button', { name: /Add/i }));

        await waitFor(() => {
            expect(screen.getByText(/Bob/)).toBeInTheDocument();
        });
    });
});
