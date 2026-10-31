// Shown for screens that land in a later build step, so every link in the map goes somewhere.
export function render({ root, def }) {
  if (!def) {
    root.innerHTML = '<div class="stub"><p class="h2">Screen not found</p><p class="muted">Open the screen map from the toolbar.</p></div>';
    return {};
  }
  root.innerHTML = `
    <div class="stub">
      <p class="eyebrow">Brief ${def.brief} · built in step ${def.step}</p>
      <p class="h2">${def.title}</p>
      <p class="muted" style="max-width:36ch;margin:0 auto">${def.summary}</p>
      <ul aria-label="States">${def.states.map((s) => `<li>${s.label}</li>`).join('')}</ul>
    </div>`;
  return {};
}
