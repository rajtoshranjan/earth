import { useIndexedDbStore } from 'use-idb-store';
import { AuthRecord } from './types';

export const useAuthStore = () => {
  return useIndexedDbStore<AuthRecord>('auth-records');
};
