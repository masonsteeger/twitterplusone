CREATE DATABASE twitterplusone;

CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(32) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL

);

INSERT INTO users (username, email, password) VALUES ('animuzoffical', 'masonsteeger@gmail.com', 'asdf123');
