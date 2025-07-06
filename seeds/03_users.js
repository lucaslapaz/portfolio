/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function(knex) {

    await knex('users').insert([
        {id: 1, username:'lucaslapaz', name:'Lucas Lapaz', email:'jorgeescolaceal@gmail.com', creation_date:'2025-06-21 03:24:37', password:'$2b$12$i24zCLVN.qxPUc41GrXtReHosmIGhejD8rjBTnHt8g1t3UEJedSJO', permission: 10},
        {id: 2, username:'admin', name:'Admin', email:'contact@example.com', creation_date:'2025-07-05 12:03:31', password:'$2b$12$6mxsKPpN71LxTBk2cMr3TuY38mYkpOFIqMYYaNew23YDHhWBXzt4e', permission: 10}
    ])
};