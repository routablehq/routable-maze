const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('api/maze.db');

function addUser(username, uuid) {
    const stmt = db.prepare('INSERT INTO users(username, user_uuid) VALUES(?1, ?2) ON CONFLICT DO NOTHING');
    stmt.run(username, uuid);
}

function joinGame(uuid, seed) {
    const stmt = db.prepare('INSERT INTO current_games(user_id, current_seed) VALUES(?1, ?2) ON CONFLICT DO NOTHING');
    stmt.run(uuid, seed);
}

function removeUser(uuid) {
    db.serialize(function() {
        db.prepare("DELETE FROM winners WHERE user_id = ?1").run(uuid).finalize();
        db.prepare("DELETE FROM current_games WHERE user_id = ?1").run(uuid).finalize();
        db.prepare("DELETE FROM users WHERE user_uuid = ?1").run(uuid).finalize();
    });
}

module.exports = { addUser, joinGame, removeUser }