export function generateSlug(titulo: string) {
  return titulo
    // 1) converter para minúsculo
    .toLowerCase()
    // 2) substituir acentos e ç
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove os diacríticos
    .replace(/ç/g, 'c')
    // 3) remover números
    .replace(/[0-9]/g, '')
    // 4) trocar espaços por -
    .replace(/\s+/g, '-')
    // 5) remover caracteres especiais que não sejam letras nem -
    .replace(/[^a-z\-]/g, '')
    // 6) remover múltiplos -
    .replace(/\-+/g, '-')
    // 7) remover - do início e fim
    .replace(/^\-+|\-+$/g, '');
}