import React, { useState, useEffect } from 'react';
interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
}
const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  useEffect(() => {
    fetch('http://localhost:5501/api/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);
  const addUser = async () => {
    const response = await fetch('http://localhost:5501/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, age: parseInt(age) }),
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
  };
  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.email} ({user.age} years old)
          </li>
        ))}
      </ul>
      <h2>Add User</h2>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" />
      <button onClick={addUser}>Add User</button>
    </div>
  );
};
export default App;