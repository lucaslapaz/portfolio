import jwt from 'jsonwebtoken';
import crypto from "crypto";

export class JwtUtil {

    /**
     * Gera um token JWT assinado.
     * @param payload Dados que quer incluid no token (ex: userId)
     * @returns O token
     */
    static generateToken(payload: object): string {
        return jwt.sign(
            payload, 
            process.env.JWT_SECRET as string, 
            { expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string)}
        );
    }

    /**
     * Verifica se o token é valido e retorna o payload
     * @param token O token recebido do cliente
     * @returns O payload decodificado
     * @throws Se o token for inválido ou expirado
     */
    static verifyToken<T extends object>(token: string): T {
        return jwt.verify(token, (process.env.JWT_SECRET as string)) as T;
    }

    /**
     * Gera uma chave secreta segura para user no JWT
     * @param length Tamanho em bytes da chave (padrão: 64)
     * @returns Chave secreta em base64
     */

    static generateSecretKey(length: number = 64): string{
        return crypto.randomBytes(length).toString('base64');
    }
}