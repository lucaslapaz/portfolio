import os, { arch, hostname, platform } from "os";

export default class StatusService{
    
    public getServerStatus(): Object{
        return {
            hostname: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
            uptime: os.uptime(),
            memory: {
                total: os.totalmem(),
                free: os.freemem()
            },
            nodeVersion: process.version
        }
    }
}