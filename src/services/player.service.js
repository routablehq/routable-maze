import { handleResponse } from './helper.handleResponse';

const REF_HOST = "http://127.0.0.1:8081"

function register(name) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'playerName': name })
  };

  return fetch(`${REF_HOST}/register`, requestOptions)
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

  return fetch(`${REF_HOST}/unregister/${id}`, requestOptions);
}

export const playerService = {
  register,
  unregister
}
