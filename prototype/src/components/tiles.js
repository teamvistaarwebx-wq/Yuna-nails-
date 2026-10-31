// Review and customer-reel tiles. Never write a review: the slot shows where a real Judge.me review goes.
import { media } from './media.js';
import { confirmTag } from './annotate.js';

export const reelTile = (caption = '') => `<figure class="reel">${media({ label: 'Customer reel', ratio: '9:16', video: true })}${caption ? `<figcaption class="tiny muted">${caption}</figcaption>` : ''}</figure>`;

export const reviewTile = () => `<figure class="review">
  <blockquote class="review__quote">A real customer review goes here, word for word.</blockquote>
  <figcaption class="review__name">${confirmTag('paste one real Judge.me review')}</figcaption>
</figure>`;
