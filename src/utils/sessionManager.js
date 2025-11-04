// src/utils/sessionManager.js
import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "stylehub_session_id";

export const getOrCreateSessionId = () => {
  // Check if session ID exists in localStorage
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    // Generate new UUID v4
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};

export const getSessionId = () => {
  return localStorage.getItem(SESSION_KEY);
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const resetSession = () => {
  const newSessionId = uuidv4();
  localStorage.setItem(SESSION_KEY, newSessionId);
  return newSessionId;
};
