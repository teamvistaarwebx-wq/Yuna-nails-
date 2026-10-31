// Photo or video slot. Until real media arrives every slot is a labelled placeholder with a "Placeholder photo" tag.
// In wireframe mode it is a plain grey box (CSS). Ratios follow the fixed media slots (brief 13).
import { photoTag } from './annotate.js';

const RATIOS = { '4:5': '4 / 5', '1:1': '1 / 1', '9:16': '9 / 16', '16:9': '16 / 9' };

export function media({ label = 'Photo', ratio = '4:5', tone = null, video = false, className = '', tag = true } = {}) {
  const style = `--ratio: ${RATIOS[ratio] || ratio};${tone ? ` --tone: ${tone};` : ''}`;
  return `<div class="media${video ? ' media--video' : ''}${className ? ` ${className}` : ''}" style="${style}" role="img" aria-label="${label} (placeholder)">
    <span class="media__label">${label} · ${ratio}</span>
    ${video ? '<span class="media__play" aria-hidden="true"></span>' : ''}
    ${tag ? photoTag(video ? 'Placeholder video' : 'Placeholder photo') : ''}
  </div>`;
}
