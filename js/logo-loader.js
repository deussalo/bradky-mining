(function () {
  const LOGO_SELECTOR = '.brand-logo';
  const LOGO_SRC = 'assets/bradky-tmp.svg';

  async function loadLogoSvg() {
    const response = await fetch(LOGO_SRC, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error('Failed to load logo SVG');
    }

    const svgText = await response.text();
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) {
      throw new Error('Invalid SVG content');
    }

    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    svg.querySelectorAll('[style]').forEach((el) => {
      const style = el.getAttribute('style');
      if (!style) return;
      const updated = style.replace(/fill\s*:\s*#[0-9a-fA-F]{3,8}/g, 'fill:currentColor');
      el.setAttribute('style', updated);
    });

    svg.querySelectorAll('[fill]').forEach((el) => {
      el.setAttribute('fill', 'currentColor');
    });

    svg.style.fill = 'currentColor';
    return svg;
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const targets = Array.from(document.querySelectorAll(LOGO_SELECTOR));
    if (!targets.length) return;

    try {
      const logoSvg = await loadLogoSvg();
      targets.forEach((target) => {
        const clone = logoSvg.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        target.replaceChildren(clone);
      });
    } catch (err) {
      console.error(err);
    }
  });
})();
