import FileMetada from "../models/FileMetadata";

export default class NotesRepository{

    private repositoryURL: string = process.env.REPOSITORY_API_URL as string;
    private userAuthToken: string = process.env.USER_AUTH_TOKEN as string;
    private metadataListCache:Map<string, object> = new Map();
    private fileMetadataCache:Map<string, object> = new Map();
    private cacheTTL: number = 60000;

    async getMetadataList(path:string = "", branch: string = "main"):Promise<FileMetada[] | null>{

        const cacheKey:string = `${path}::${branch}`;

        if(this.metadataListCache.has(cacheKey)){
            const cached = this.metadataListCache.get(cacheKey) as {listFile:FileMetada[], timestamp:number}
            const difference = Date.now() - cached.timestamp;
            if(difference < this.cacheTTL){
                console.log('Retornando valor usando cache.');
                return cached.listFile;
            }
        }

        const url = this.repositoryURL + path + `?ref=${branch}`;
        const request = await fetch(url, {
            headers: {
                "Authorization": `token ${this.userAuthToken}`,
                "Accept": "application/vnd.github.v3+json"
            }
        })

        if(request.ok){
            const listFile = await request.json();
            this.metadataListCache.set(cacheKey, {
                listFile: listFile,
                timestamp: Date.now()
            });
            console.log("Retornando valor consultado no GITHUB.")

            return listFile;
        }

        return null;
    }

    async getFileMetadata(path: string, branch: string = "main"):Promise<FileMetada | null>{

        const cacheKey:string = `${path}::${branch}`;

        if(this.fileMetadataCache.has(cacheKey)){
            const cache = this.fileMetadataCache.get(cacheKey) as {fileMetada:FileMetada, timestamp: number}
            const difference = Date.now() - cache.timestamp;
            if(difference < this.cacheTTL){
                return cache.fileMetada;
            }
            
        }

        const url:string = this.repositoryURL + path + `?ref=${branch}`;
        const request = await fetch(url, {
            headers: {
                "Authorization": `token ${this.userAuthToken}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if(request.ok){
            const metadata = await request.json();
            const fileMetada:FileMetada = {
                name: metadata.name,
                path: metadata.path,
                content: metadata.content,
                size: metadata.size,
                type: metadata.type
            } as FileMetada;

            this.fileMetadataCache.set(cacheKey, {
                fileMetada: fileMetada,
                timestamp: Date.now()
            })
            return fileMetada; 
        }
        return null;
    }
}