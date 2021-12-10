import { handleResponse } from './helper.handleResponse';

function register(id, name) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, 'playerName': name })
  };

  return fetch('http://127.0.0.1:8081/register', requestOptions)
    .then(handleResponse)
    .then(data => {
      localStorage.setItem('currentPlayerData', JSON.stringify(data));
      return data;
    });
}

function unregister() {
  localStorage.removeItem('currentPlayerData')
}

export const playerService = {
  register,
  unregister
}
