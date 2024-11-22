import * as UUID from 'uuid';

export function slugChanger({ payload, addUUID = false }: { payload: string, addUUID?: boolean }): string {
    let slug = payload
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\u1000-\u109F\s]/g, '-')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
        .replace(/^-+|-+$/g, '');

    if (addUUID) {
        const uuidArr = UUID.v4()?.split('-');
        slug += `-${uuidArr[uuidArr.length - 1]}`;
    }

    return slug;
}