(function () {
  var mermaidBlocks = new Map();

  // The existing theme stylesheet constrains SVGs to the viewport, which
  // makes multi-column sequence diagrams unreadable on phones. Keep a
  // readable intrinsic width and let the article container scroll instead.
  var style = document.createElement('style');
  style.textContent = [
    '.article-entry pre.mermaid-diagram{background:#fff!important;border:0;box-shadow:none;overflow-x:auto;-webkit-overflow-scrolling:touch;text-align:left;padding:1em;border-radius:4px}',
    '.article-entry pre.mermaid-diagram code.mermaid{display:block;background:transparent!important;padding:0;white-space:normal}',
    '.article-entry pre.mermaid-diagram svg{display:block;height:auto;width:auto!important;max-width:none!important;min-width:900px;margin:0 auto}',
  ].join('\n');
  document.head.appendChild(style);

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
      theme: document.body.classList.contains('dark-mode') ? 'dark' : 'default',
      themeVariables: {
        fontSize: '18px',
        actorBkg: '#f0edff',
        actorBorder: '#6554a4',
        actorTextColor: '#171717',
        signalColor: '#333333',
        signalTextColor: '#171717',
        labelBoxBkgColor: '#fff4bf',
        labelBoxBorderColor: '#8a6d00',
        labelTextColor: '#171717',
        noteBkgColor: '#fff4bf',
        noteBorderColor: '#8a6d00',
        noteTextColor: '#171717'
      },
      sequence: {
        actorFontSize: 18,
        messageFontSize: 17,
        noteFontSize: 16,
        messageMargin: 30,
        actorMargin: 55
      }
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
