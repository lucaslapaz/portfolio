
DROP TABLE IF EXISTS blog_db;
CREATE DATABASE blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog_db;


-- Tabela de usuários
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL,
    permission TINYINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_permission_range CHECK (permission BETWEEN 0 AND 10)
);


-- Tabela de posts
DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    formatted_title VARCHAR(200) NOT NULL,
    description VARCHAR(255) NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_listed BOOLEAN NOT NULL DEFAULT TRUE,

    -- Constraints
    UNIQUE KEY (formatted_title),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

