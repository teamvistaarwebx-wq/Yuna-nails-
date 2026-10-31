// Prototype annotations. Not part of the future store; they mark what is unconfirmed or placeholder.

// Yellow tag for an open item (brief 15). `text` says what needs confirming.
export const confirmTag = (text) => `<mark class="confirm" title="Open item: confirm with the client">TO CONFIRM: ${text}</mark>`;

// Small tag on every photo slot until real photos arrive.
export const photoTag = (text = 'Placeholder photo') => `<span class="photo-tag">${text}</span>`;

// A value that may be confirmed or open: { value } or { confirm }.
export const valueOr = (f, format = (v) => v) => (f && f.value !== undefined && f.value !== null ? format(f.value) : confirmTag(f ? f.confirm : 'value'));
