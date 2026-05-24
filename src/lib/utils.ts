/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STORAGE_KEY = 'matematika_akademiyasi_user';

export function saveUser(user: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getUser() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}
