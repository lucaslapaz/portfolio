USE blog_db;

-- password: 123admin123
INSERT INTO users (username, name, email, password, permission) VALUES ('admin', 'Admin', 'contact@example.com', '$2b$12$6mxsKPpN71LxTBk2cMr3TuY38mYkpOFIqMYYaNew23YDHhWBXzt4e', 10);
