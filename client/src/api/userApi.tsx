import type { User } from '@shared/types/user';

export const getUsers = async (): Promise<User[]> => {
  const res = await fetch('http://localhost:5000/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const addUser = async (user: User): Promise<User> => {
  const res = await fetch('http://localhost:5000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to add user');
  return res.json();
};
