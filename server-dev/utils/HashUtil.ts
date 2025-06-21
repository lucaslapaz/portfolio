import bcrypt from "bcrypt";


export class HashUtil{
    // Número de rounds do salt. 12 é um valor seguro e razoável.
    private static saltRounds = 12;

    /**
     * Gera um novo hash a partir da senha
     * @param password A senha em texto plano
     * @returns O hash gerado
     */
    static async generateHash(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }
    
    /**
     * Compara uma senha em texto plano com o hash salvo
     * @param password A senha em texto plano
     * @param hash O hash salvo no banco
     * @returns true se a senha bater, false caso contrário
     */
    static async compare(password: string, hash: string) : Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}