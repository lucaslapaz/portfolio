/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {

    await knex.schema.dropTableIfExists("users");

    return knex.raw(`
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
    `)
};      

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw(`
        DROP TABLE IF EXISTS users;
    `)
};
