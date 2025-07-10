type Job = {
    name: string;
    intervalMs: number;
    callback: () => Promise<void> | void;
}

export default class Scheduler{
    private static jobs:Map<string, NodeJS.Timeout> = new Map();
    
    static register(job: Job) {
        // Se já existe, remove antes de registrar de novo
        if (this.jobs.has(job.name)) {
            this.remove(job.name);
        }

        const timer = setInterval(async () => {
            try {
                await job.callback();
                // console.log(`Job ${job.name} concluído.`);
            } catch (err: any) {
                console.error(`Erro no job ${job.name}`, err);
            }
        }, job.intervalMs);

        this.jobs.set(job.name, timer);
    }

    static remove(name: string) {
        const timer = this.jobs.get(name);
        if (timer) {
            clearInterval(timer);
            this.jobs.delete(name);
        }
    }
}