// Read business facts from data/facts.js. Every screen uses these helpers, so a fact changes in one place.
import { facts } from '../../data/facts.js';
import { confirmTag } from './annotate.js';

export const rupees = (n) => `Rs ${Number(n).toLocaleString('en-IN')}`;

export function fact(key) {
  const f = facts[key];
  if (!f) return confirmTag(key);
  if (f.value === undefined) return confirmTag(f.confirm);
  if (key === 'codFee') return rupees(f.value);
  if (Array.isArray(f.value)) return f.value.join(', ');
  return String(f.value);
}
export const sizes = () => facts.sizes.value;
