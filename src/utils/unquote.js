/** Strips the typographic quote marks the shared copy wraps the founder's line in. */
export const unquote = (text) => text.replace(/^[“„"]|[”“"]$/g, '')
