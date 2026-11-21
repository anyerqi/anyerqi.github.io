(function () {
  var mermaidBlocks = new Map();

  function collectMermaidBlocks() {
    document.querySelectorAll('code.mermaid').forEach(function (element) {
      if (!mermaidBlocks.has(element)) {
        mermaidBlocks.set(element, element.textContent);
        if (element.parentElement) {
          element.parentElement.classList.add('mermaid-diagram');
        }
      }
    });
  }

  function renderMermaid() {
    collectMermaidBlocks();
    if (!window.mermaid || mermaidBlocks.size === 0) return;

    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: document.body.classList.contains('dark-mode') ? 'dark' : 'default'
    });

    var nodes = Array.from(mermaidBlocks.keys());
    nodes.forEach(function (element) {
      element.removeAttribute('data-processed');
      element.textContent = mermaidBlocks.get(element);
    });

    window.mermaid.run({ nodes: nodes }).catch(function (error) {
      console.error('Mermaid diagram rendering failed:', error);
    });
  }

  function loadMermaid() {
    collectMermaidBlocks();
    if (mermaidBlocks.size === 0) return;

    var observer = new MutationObserver(function () {
      renderMermaid();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = renderMermaid;
    script.onerror = function () {
      console.error('Mermaid could not be loaded; the diagram source remains visible.');
    };
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMermaid, { once: true });
  } else {
    loadMermaid();
  }
})();
