import { useState, useEffect } from 'react';
import { usersApi } from '../services/api';
import { User } from '../types';

export interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
}

export const useUsers = (): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersApi.getAll();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError('Nie udało się pobrać listy użytkowników');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Błąd podczas pobierania listy użytkowników');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const refreshUsers = async () => {
    await fetchUsers();
  };

  return { users, loading, error, refreshUsers };
};
