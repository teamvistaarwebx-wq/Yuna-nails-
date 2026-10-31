/* Yuna Soft Glam. One small deferred script, no framework. Config comes from window.Yuna (layout/theme.liquid). */
(() => {
  const Y = window.Yuna || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Money ---------- */
  function formatMoney(cents) {
    const fmt = Y.moneyFormat || 'Rs. {{amount}}';
    const value = (cents / 100).toFixed(2);
    const [whole, dec] = value.split('.');
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const amount = dec === '00' ? grouped : `${grouped}.${dec}`;
    return fmt.replace(/\{\{\s*(\w+)\s*\}\}/, (_m, key) => (key.includes('no_decimals') ? grouped : amount));
  }

  /* ---------- Dialogs (cart drawer, size sheet, menu, search) ---------- */
  let lastFocus = null;
  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    lastFocus = document.activeElement;
    $$('dialog.overlay[open]').forEach((d) => d !== dialog && d.close());
    dialog.showModal();
    document.body.classList.add('has-overlay');
  }
  function closeDialog(dialog) { if (dialog && dialog.open) dialog.close(); }
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) closeDialog(closeBtn.closest('dialog'));
    if (e.target.matches('dialog.overlay')) closeDialog(e.target); // backdrop tap
  });
  $$('dialog.overlay').forEach((d) => d.addEventListener('close', () => {
    if (!$('dialog.overlay[open]')) document.body.classList.remove('has-overlay');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }));

  /* ---------- Videos: poster first, video only after load, only when visible ---------- */
  function startVideos() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    const videos = $$('video[data-deferred-video]');
    if (!videos.length || reduce || saveData || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const v = entry.target;
        if (entry.isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; }
          v.play().then(() => v.classList.add('is-playing')).catch(() => {});
        } else if (v.src) {
          v.pause();
        }
      });
    }, { rootMargin: '100px' });
    videos.forEach((v) => io.observe(v));
  }
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  if (document.readyState === 'complete') idle(startVideos);
  else window.addEventListener('load', () => idle(startVideos));

  /* ---------- Cart ---------- */
  const drawer = $('#CartDrawer');
  async function cartRequest(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...body, sections: 'cart-drawer', sections_url: window.location.pathname }),
    });
    const json = await res.json();
    if (!res.ok || json.status) throw new Error(json.description || json.message || 'Something went wrong. Please try again.');
    return json;
  }
  function renderDrawer(sections) {
    const html = sections && sections['cart-drawer'];
    if (!html) return;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const fresh = doc.querySelector('.shopify-section') || doc.body.firstElementChild;
    const current = $('#shopify-section-cart-drawer');
    if (fresh && current) current.innerHTML = fresh.innerHTML;
    const count = $('[data-cart-count-value]', current);
    updateCount(count ? Number(count.dataset.cartCountValue) : null);
  }
  function updateCount(n) {
    if (n === null) return;
    $$('[data-cart-count]').forEach((el) => { el.textContent = n; el.hidden = n === 0; });
  }
  async function addItems(items, button) {
    if (button) button.classList.add('is-loading');
    try {
      const json = await cartRequest(`${Y.routes.cart_add_url}.js`, { items });
      renderDrawer(json.sections);
      openDialog(drawer);
      return true;
    } catch (err) {
      alertNear(button, err.message);
      return false;
    } finally {
      if (button) button.classList.remove('is-loading');
    }
  }
  async function changeLine(key, quantity) {
    const line = $(`[data-key="${CSS.escape(key)}"]`, drawer);
    if (line) line.style.opacity = '.5';
    try {
      const json = await cartRequest(`${Y.routes.cart_change_url}.js`, { id: key, quantity });
      renderDrawer(json.sections);
    } catch (err) {
      if (line) line.style.opacity = '';
      alertNear(line, err.message);
    }
  }
  function alertNear(el, message) {
    const host = (el && el.parentElement) || document.body;
    let msg = host.querySelector(':scope > .form-message--error');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'form-message form-message--error';
      msg.setAttribute('role', 'alert');
      host.appendChild(msg);
    }
    msg.textContent = message;
  }
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-cart-toggle]');
    if (toggle && drawer) { e.preventDefault(); openDialog(drawer); return; }
    const qtyBtn = e.target.closest('#CartDrawer [data-qty-change]');
    if (qtyBtn) { changeLine(qtyBtn.closest('[data-key]').dataset.key, Number(qtyBtn.dataset.qtyChange)); return; }
    const addBtn = e.target.closest('[data-add-variant]');
    if (addBtn) { addItems([{ id: Number(addBtn.dataset.addVariant), quantity: 1 }], addBtn); }
  });
  document.addEventListener('change', (e) => {
    if (e.target.matches('#CartDrawer [data-qty-input]')) {
      changeLine(e.target.closest('[data-key]').dataset.key, Math.max(0, Number(e.target.value) || 0));
    }
  });

  /* ---------- Size + variant logic shared by the product page and quick add ---------- */
  function sizeIndex(product) {
    const want = (Y.sizeOption || 'Size').toLowerCase().trim();
    const names = product.options.map((o) => (typeof o === 'string' ? o : o.name).toLowerCase().trim());
    return names.indexOf(want);
  }
  // Returns { variant, properties } or null when a size (or Size me later) is still needed.
  function resolve(product, chosen, sizeLater) {
    const si = sizeIndex(product);
    const props = {};
    let candidates = product.variants;
    product.options.forEach((_o, i) => {
      if (i === si) return;
      if (chosen[i]) candidates = candidates.filter((v) => v.options[i] === chosen[i]);
    });
    if (si < 0) {
      const v = candidates.find((x) => x.available) || null;
      return v ? { variant: v, properties: props } : null;
    }
    if (sizeLater) {
      const laterValue = (Y.sizeLaterVariant || '').trim();
      let v = candidates.find((x) => x.options[si] === laterValue && x.available);
      if (!v) v = candidates.find((x) => x.available);
      if (!v) return null;
      // Always flag the line, so the order shows it even when a dedicated "Size me later" variant exists.
      props.Size = Y.sizeLaterProperty;
      return { variant: v, properties: props };
    }
    if (!chosen[si]) return null;
    const v = candidates.find((x) => x.options[si] === chosen[si]);
    return v ? { variant: v, properties: props } : null;
  }
  function showSizeError(group, show) {
    if (!group) return;
    group.classList.toggle('has-error', show);
    const err = $('[data-size-error]', group);
    if (err) err.hidden = !show;
    if (show) {
      group.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const first = $('input', group);
      if (first) first.focus({ preventScroll: true });
    }
  }

  /* ---------- Product page ---------- */
  $$('[data-product-root]').forEach((root) => {
    const product = JSON.parse($('[data-product-json]', root).textContent);
    const si = sizeIndex(product);
    const sizeGroup = $('[data-size-group]', root);
    const addBtn = $('[data-add]', root);
    const buyBtn = $('[data-buy-now]', root);
    const priceEl = $('[data-price]', root);
    const sticky = $('[data-sticky-buy]');
    let current = null;
    let qty = 1;

    function chosenOptions() {
      const chosen = [];
      $$('[data-option-group]', root).forEach((g) => {
        const i = Number(g.dataset.optionIndex);
        const checked = $('input:checked', g);
        chosen[i] = checked && checked.value !== '__later' ? checked.value : null;
      });
      return chosen;
    }
    function sizeLater() { const r = $('[data-size-later]', root); return !!(r && r.checked); }

    function update() {
      current = resolve(product, chosenOptions(), sizeLater());
      const ready = !!(current && current.variant.available);
      [addBtn, buyBtn].forEach((b) => b && b.setAttribute('aria-disabled', String(!ready)));
      const stickyBtn = sticky && $('[data-sticky-add]', sticky);
      if (stickyBtn) stickyBtn.textContent = ready ? stickyBtn.dataset.labelReady : stickyBtn.dataset.labelChoose;
      const note = $('[data-size-later-note]', root);
      if (note) note.hidden = !sizeLater();
      const picked = $('[data-size-picked]', root);
      if (picked) {
        const c = chosenOptions()[si];
        picked.textContent = sizeLater() ? `: ${Y.sizeLaterLabelShort}` : c ? `: ${c}` : '';
      }
      if (ready) showSizeError(sizeGroup, false);
      const unit = current ? current.variant.price : product.variants[0].price;
      if (priceEl) priceEl.textContent = formatMoney(unit);
      updateTiers(unit);
      if (current && !sizeLater()) {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', current.variant.id);
        window.history.replaceState({}, '', url);
      }
    }
    function updateTiers(unit) {
      $$('[data-tier]', root).forEach((input) => {
        const q = Number(input.dataset.qty);
        const total = unit * q;
        const fixed = Number(input.dataset.saveFixed) || 0;
        const pct = Number(input.dataset.savePercent) || 0;
        const save = fixed || Math.floor((total * pct) / 100);
        const priceBox = $('[data-tier-price]', input.parentElement);
        if (priceBox) priceBox.innerHTML = `${formatMoney(total - save)}${save > 0 ? `<s>${formatMoney(total)}</s>` : ''}`;
      });
      const checked = $('[data-tier]:checked', root);
      qty = checked ? Number(checked.dataset.qty) : 1;
      if (buyBtn) buyBtn.hidden = qty > 1 && Y.buyNowMulti === 'hide';
    }

    function add(button) {
      if (!current) { showSizeError(sizeGroup, true); return; }
      addItems([{ id: current.variant.id, quantity: qty, properties: current.properties }], button);
    }
    function buyNow(button) {
      if (!current) { showSizeError(sizeGroup, true); return; }
      if (qty > 1) { add(button); return; } // bundles always go through the bag
      if (Y.buyNowMode === 'cart_checkout') {
        addItems([{ id: current.variant.id, quantity: 1, properties: current.properties }], button)
          .then((ok) => { if (ok) window.location.href = '/checkout'; });
        return;
      }
      let url = `${Y.routes.root}cart/${current.variant.id}:1`;
      if (current.properties.Size) url += `?attributes[Size]=${encodeURIComponent(current.properties.Size)}`;
      window.location.href = url;
    }

    root.addEventListener('change', (e) => { if (e.target.matches('input[type="radio"]')) update(); });
    if (addBtn) addBtn.addEventListener('click', (e) => { e.preventDefault(); add(addBtn); });
    if (buyBtn) buyBtn.addEventListener('click', (e) => { e.preventDefault(); buyNow(buyBtn); });
    const form = $('form[data-product-form]', root);
    if (form) form.addEventListener('submit', (e) => { e.preventDefault(); add(addBtn); });

    // Sticky add-to-bag bar on phones, shown whenever the main buttons are off screen (above or below),
    // so an Add to bag is always in reach. Without a size it scrolls to the size step and shows the note.
    if (sticky && addBtn && 'IntersectionObserver' in window) {
      const stickyAdd = $('[data-sticky-add]', sticky);
      stickyAdd.addEventListener('click', () => add(stickyAdd));
      new IntersectionObserver(([entry]) => {
        const show = !entry.isIntersecting && window.innerWidth < 990;
        sticky.classList.toggle('is-visible', show);
        document.documentElement.style.setProperty('--sticky-offset', show ? `${sticky.offsetHeight}px` : '0px');
      }).observe($('.buy-buttons', root));
    }

    // Gallery counter on phones.
    const track = $('.gallery__track', root);
    const counter = $('[data-gallery-count]', root);
    if (track && counter) {
      const total = track.children.length;
      track.addEventListener('scroll', () => {
        const i = Math.round(track.scrollLeft / track.clientWidth) + 1;
        counter.textContent = `${Math.min(i, total)} / ${total}`;
      }, { passive: true });
    }

    update();
  });

  /* ---------- Size sheet: quick add and size chart ---------- */
  const sheet = $('#SizeSheet');
  let sheetProduct = null;
  function sheetMode(mode) {
    $('[data-sheet-sizes]', sheet).hidden = mode !== 'add';
    $('[data-sheet-footer]', sheet).hidden = mode !== 'add';
    $('[data-sheet-chart]', sheet).open = mode === 'chart';
  }
  function sheetUpdate() {
    const group = $('[data-sheet-sizes]', sheet);
    const later = $('[data-size-later]', sheet);
    const checked = $('input:checked', group);
    const chosen = [];
    const si = sizeIndex(sheetProduct);
    if (checked && checked.value !== '__later') chosen[si] = checked.value;
    sheetProduct.options.forEach((_o, i) => { if (i !== si) chosen[i] = sheetProduct.variants[0].options[i]; });
    const r = resolve(sheetProduct, chosen, !!(later && later.checked));
    $('[data-sheet-add]', sheet).setAttribute('aria-disabled', String(!r));
    $('[data-size-later-note]', sheet).hidden = !(later && later.checked);
    if (r) showSizeError(group, false);
    return r;
  }
  if (sheet) {
    document.addEventListener('click', (e) => {
      const quick = e.target.closest('[data-quick-add]');
      if (quick) {
        const card = quick.closest('[data-product-card]');
        sheetProduct = JSON.parse($('[data-product-json]', card).textContent);
        $('[data-sheet-title]', sheet).textContent = sheetProduct.title;
        const si = sizeIndex(sheetProduct);
        const chips = $('[data-sheet-chips]', sheet);
        chips.innerHTML = '';
        if (si < 0) {
          // No size option: add straight away.
          const v = sheetProduct.variants.find((x) => x.available);
          if (v) addItems([{ id: v.id, quantity: 1 }], quick);
          return;
        }
        const values = [];
        sheetProduct.variants.forEach((v) => { const s = v.options[si]; if (!values.includes(s) && s !== Y.sizeLaterVariant) values.push(s); });
        values.forEach((s, i) => {
          const avail = sheetProduct.variants.some((v) => v.options[si] === s && v.available);
          chips.insertAdjacentHTML('beforeend', `<div class="chip"><input type="radio" name="sheet-size" id="sheet-size-${i}" value="${s.replace(/"/g, '&quot;')}"${avail ? '' : ' disabled'}><label for="sheet-size-${i}">${s}</label></div>`);
        });
        chips.insertAdjacentHTML('beforeend', `<div class="chip chip--wide"><input type="radio" name="sheet-size" id="sheet-size-later" value="__later" data-size-later><label for="sheet-size-later">${Y.sizeLaterLabel}</label></div>`);
        sheetMode('add');
        sheetUpdate();
        openDialog(sheet);
        return;
      }
      if (e.target.closest('[data-open-size-chart]')) {
        $('[data-sheet-title]', sheet).textContent = Y.sizeChartTitle || 'Find your size';
        sheetMode('chart');
        openDialog(sheet);
      }
    });
    sheet.addEventListener('change', sheetUpdate);
    $('[data-sheet-add]', sheet).addEventListener('click', async (e) => {
      const r = sheetUpdate();
      if (!r) { showSizeError($('[data-sheet-sizes]', sheet), true); return; }
      // addItems opens the bag, which closes this sheet.
      await addItems([{ id: r.variant.id, quantity: 1, properties: r.properties }], e.currentTarget);
    });
  }

  /* ---------- Menu + search ---------- */
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-open]')) { e.preventDefault(); openDialog($('#MenuDrawer')); }
    const s = e.target.closest('[data-search-open]');
    if (s && $('#SearchDialog')) { e.preventDefault(); openDialog($('#SearchDialog')); setTimeout(() => $('#SearchDialog input[type="search"]').focus(), 50); }
  });
  const searchInput = $('#SearchDialog input[type="search"]');
  const results = $('#PredictiveResults');
  if (searchInput && results && Y.predictiveSearch) {
    let timer;
    let controller;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      const q = searchInput.value.trim();
      if (q.length < 2) { results.innerHTML = ''; return; }
      timer = setTimeout(async () => {
        if (controller) controller.abort();
        controller = new AbortController();
        try {
          const url = `${Y.routes.predictive_search_url}?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=6&section_id=predictive-search`;
          const html = await (await fetch(url, { signal: controller.signal })).text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const inner = doc.querySelector('[data-predictive]');
          results.innerHTML = inner ? inner.outerHTML : '';
        } catch (_) { /* aborted or offline */ }
      }, 250);
    });
  }
})();
