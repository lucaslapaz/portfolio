export default interface FileMetadata {
    name: string;                     // Nome do arquivo ou diretório
    path: string;                     // Caminho completo dentro do repositório
    content?: string;
    sha?: string;                     // SHA hash que identifica unicamente este arquivo na árvore Git
    size: number;                     // Tamanho do arquivo em bytes (0 para diretórios)
    url?: string;                     // URL da API do GitHub para este recurso
    html_url?: string;                // URL para visualizar no site do GitHub (interface web)
    git_url?: string;                 // URL da API Git bruta (usada internamente pelo Git)
    download_url?: string | null;      // URL direta para download do conteúdo
    type: 'file' | 'dir';             // Tipo do recurso (arquivo ou diretório)
    _links?: {                        
      self: string;                   // Link para o recurso na API REST
      git: string;                    // Link para o recurso na API Git
      html: string;                   // Link para visualizar o recurso na interface web
    }
}
