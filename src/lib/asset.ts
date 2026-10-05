/**
 * Resolves an asset name to a public URL. Names without an extension default
 * to `.webp`; pass a full name (e.g. `"whatsapp1.png"`) to use another format.
 */
export const asset = (name: string) => `/assets/${name.includes(".") ? name : `${name}.webp`}`;
