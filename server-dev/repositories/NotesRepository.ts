import FileMetada from "../models/FileMetadata";

export default class NotesRepository{

    private repositoryURL: string = process.env.REPOSITORY_API_URL as string;
    private userAuthToken: string = process.env.USER_AUTH_TOKEN as string;

    async getMetadataList(path:string = "", branch: string = "main"):Promise<FileMetada[] | null>{
        const url = this.repositoryURL + path + `?ref=${branch}`;
        const request = await fetch(url, {
            headers: {
                "Authorization": `token ${this.userAuthToken}`,
                "Accept": "application/vnd.github.v3+json"
            }
        })

        if(request.ok){
            const listFile = await request.json();
            return listFile;
        }

        return null;
    }

    async getFileMetadata(path: string, branch: string = "main"):Promise<FileMetada | null>{
        const url:string = this.repositoryURL + path + `?ref=${branch}`;
        const request = await fetch(url, {
            headers: {
                "Authorization": `token ${this.userAuthToken}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if(request.ok){
            const metadata = await request.json();

            console.log(metadata);
            return {
                name: metadata.name,
                path: metadata.path,
                content: metadata.content,
                size: metadata.size,
                type: metadata.type
            } as FileMetada;
        }
        return null;
    }
}