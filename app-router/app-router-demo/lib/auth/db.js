import sql from "better-sqlite3";
import path from "path";

// Assuming .db is in the /data directory relative to the root of your application
const dbPath = path.join(process.cwd(), "data", "training.db");
const db = sql(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT
  );
`);

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);

db.exec(`
  CREATE TABLE IF NOT EXISTS trainings (
    id INTEGER PRIMARY KEY,
    title TEXT,
    image TEXT,
    description TEXT
  );
`);

const hasTrainings =
  db.prepare("SELECT COUNT(*) as count FROM trainings").get().count > 0;

if (!hasTrainings) {
  db.exec(`
    INSERT INTO trainings (title, image, description)
    VALUES
    ('Yoga', '/training/yoga.jpg', 'A gentle way to improve flexibility and balance.'),
    ('Boxing', '/training/boxing.jpg', 'A high-energy workout that improves strength and speed.'),
    ('Running', '/training/running.jpg', 'A great way to improve cardiovascular health and endurance.'),
    ('Weightlifting', '/training/weightlifting.jpg', 'A strength-building workout that helps tone muscles.'),
    ('Cycling', '/training/cycling.jpg', 'A low-impact workout that improves cardiovascular health and endurance.'),
    ('Gaming', '/training/gaming.jpg', 'A fun way to improve hand-eye coordination and reflexes.'),
    ('Sailing', '/training/sailing.jpg', 'A relaxing way to enjoy the outdoors and improve balance.');
`);
}

export default db;
