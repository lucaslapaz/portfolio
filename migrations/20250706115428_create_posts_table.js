/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.dropTableIfExists("posts");

    return knex.raw(`
        CREATE TABLE posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(200) NOT NULL,
            formatted_title VARCHAR(200) NOT NULL,
            description VARCHAR(255) NOT NULL DEFAULT '',
            content TEXT NOT NULL,
            creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_listed BOOLEAN NOT NULL DEFAULT TRUE,

            UNIQUE KEY (formatted_title),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
        );
    `)
};      

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw(`
        DROP TABLE IF EXISTS posts;
    `)
};
