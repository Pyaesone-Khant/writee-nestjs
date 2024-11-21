
export function slugChanger(payload: string): string {
    return payload
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\u1000-\u109F\s]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
        .replace(/^-+|-+$/g, '');
}