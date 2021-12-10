CREATE TABLE users (
    username TEXT,
    user_uuid UUID PRIMARY KEY
);

CREATE TABLE current_games (
    id INTEGER PRIMARY KEY,
    user_id UUID,
    current_seed INT,
    CONSTRAINT fk_player
       FOREIGN KEY(user_id)
          REFERENCES users(user_uuid)
);

CREATE TABLE winners (
    id INTEGER PRIMARY KEY,
    seed INT,
    user_id UUID,
    CONSTRAINT fk_winner
       FOREIGN KEY(user_id)
          REFERENCES users(user_uuid)
);