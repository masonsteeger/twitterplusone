CREATE DATABASE twitterplusone;

CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(32) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  following uuid[],
  tweets uuid[],
  favorites uuid[]
);

INSERT INTO users (username, email, password) VALUES ('animuzofficial', 'masonsteeger@gmail.com', 'asdf123');

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE tweets(
  tweet_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author uuid NOT NULL,
  tweet VARCHAR(281) NOT NULL,
  favorites_num INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON tweets
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

INSERT INTO tweets (author, tweet) VALUES('test', 'test');
