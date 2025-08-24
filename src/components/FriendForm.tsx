"use client";
import { useState } from 'react';

export default function FriendForm({ onSubmit, initialData = {} }: { onSubmit: (data: any) => void, initialData?: any }) {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [phone, setPhone] = useState(initialData.phone || '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, email, phone });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Phone</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Save Friend</button>
    </form>
  );
}
