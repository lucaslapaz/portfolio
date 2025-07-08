import FileMetada from "../models/FileMetadata";
import NotesRepository from "../repositories/NotesRepository";

export default class NotesService{

    private notesRepository: NotesRepository;

    constructor(notesRepository: NotesRepository){
        this.notesRepository = notesRepository;
    }

    async getFilesList(path: string = "") : Promise<FileMetada[] | null>{
        const filesList:FileMetada[] | null = await this.notesRepository.getMetadataList(path);

        let compactFileList:FileMetada[] | null = null;

        if(filesList && filesList.length > 0){
            compactFileList = [];
            let itemsToSkip = new Set(["nãoincluir", "naoincluir"]);

            for(let file of filesList){
                if(file.name.toLocaleLowerCase().startsWith("naoincluir")){
                    continue;
                }

                if(file.type === 'dir' || file.name.toLocaleLowerCase().endsWith('.md')){
                    let compactFile: FileMetada = {
                        name: file.name,
                        path: file.path,
                        size: file.size,
                        type: file.type
                    }
                    compactFileList.push(compactFile);
                }
            }

            compactFileList.sort((a: FileMetada, b: FileMetada): number => {
                // Primeiro critério: type (pastas antes de arquivos)
                if (a.type === 'dir' && b.type !== 'dir') return -1;
                if (a.type !== 'dir' && b.type === 'dir') return 1;
                // Segundo critério: ordem alfabética pelo name
                return a.name.localeCompare(b.name);
            }); 

        }
        return compactFileList;
    }

    async getFileContent(path:string): Promise<string | null>{
        const data:FileMetada | null = await this.notesRepository.getFileMetadata(path);
        if(data){
            const contentBuffer:Buffer<ArrayBuffer> = Buffer.from(data.content as string, 'base64');
            const content:string = contentBuffer.toString('utf-8');
            return content;
        }
        return null;
    }
}