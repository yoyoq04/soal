import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Explicitly export UserProfile interface
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Authentication API Helpers
export const registerApi = async (data: {
  username: string;
  email: string;
  systemRole: string;
  password: string;
}) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const loginApi = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const postComment = async (projectId: number, userId: number, commentText: string) => {
  const response = await apiClient.post('/comments/', {
    project_id: projectId,
    user_id: userId,
    comment_text: commentText,
  });
  return response.data;
};