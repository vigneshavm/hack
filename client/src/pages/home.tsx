import { useEffect, useState } from 'react';
import { getUsers, addUser } from '../api/userApi';
import type { User } from '@shared/types/user';

function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<User>({ name: '', email: '' });

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => console.error('Failed to load users', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await addUser(formData);
      setUsers((prev) => [...prev, newUser]);
      setFormData({ name: '', email: '' });
    } catch (err) {
      console.error('Failed to add user', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User List</h2>
      <ul>
        {users.map((user, i) => (
          <li key={i}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>

      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default Home;
