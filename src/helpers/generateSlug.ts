import { v4 as uuidv4 } from 'uuid';

export const generateSlug = (input: string): string => {

  const uuid = uuidv4().split('-');

  const lastUUID = uuid[uuid.length - 1]

  const title = input
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')

  return `${title}-${lastUUID}`;
}