import { handleResponse } from './helper.handleResponse';

const REF_HOST = "http://127.0.0.1:3381"
const isProd = window.location.href.includes('maze.app');
const URL = isProd ? 'https://maze.app.megabox.dev' : REF_HOST;

function register(name) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'playerName': name })
  };

  return fetch(`${URL}/register`, requestOptions)
    .then(handleResponse)
    .then(data => {
      localStorage.setItem('currentPlayerData', JSON.stringify(data));
      return data;
    });
}

function unregister(id) {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };

  return fetch(`${URL}/unregister/${id}`, requestOptions);
}

export const playerService = {
  register,
  unregister
}
