import { Pool } from "mysql2/promise";
import mysql from "mysql2/promise"
import dotenv from 'dotenv';

export default class MySQL{
    private static instance:MySQL;
    private pool:Pool;

    /**
     * Cria o Pool MySQL
     */
    constructor(){
        dotenv.config();
        this.pool = mysql.createPool({
            host: process.env.MYSQ_HOST,
            port: parseInt(process.env.MYSQL_PORT as string),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.DATABASE,
            connectionLimit: 10,
            waitForConnections: true,
            queueLimit: 0
        })
        this.testConnection();
    }

    async testConnection() {
        try {
            const conn = await this.pool.getConnection();
            await conn.ping();  // 🔥 testa conexão
            conn.release();
            console.log('✅ Conexão com MySQL bem-sucedida');
        } catch (error) {
            console.error('❌ Erro ao conectar no MySQL:\n', error);
            process.exit(1); // encerra a aplicação se não conectar
        }
    }


    public static getInstance(): MySQL{
        if(!MySQL.instance){
            MySQL.instance = new MySQL();
        }
        return this.instance;
    }

    public getPool(): Pool{
        return this.pool;
    }

}