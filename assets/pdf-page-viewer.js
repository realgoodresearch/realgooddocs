(function () {
  function updateExpandedBodyState() {
    const hasExpandedViewer = Array.from(document.querySelectorAll('.pdf-page-viewer')).some(function (viewer) {
      return viewer.classList.contains('pdf-page-viewer--expanded');
    });
    document.body.classList.toggle('pdf-viewer-expanded', hasExpandedViewer);
  }

  function initViewer(viewer) {
    if (!viewer || viewer.dataset.initialized === 'true') {
      return;
    }
    viewer.dataset.initialized = 'true';

    const file = viewer.dataset.file;
    const startPageRaw = parseInt(viewer.dataset.start || '1', 10);
    const endPageRaw = parseInt(viewer.dataset.end || '0', 10);
    const initialPageRaw = parseInt(viewer.dataset.page || String(startPageRaw), 10);

    const prevButton = viewer.querySelector('.pdf-prev-page');
    const nextButton = viewer.querySelector('.pdf-next-page');
    const downloadLink = viewer.querySelector('.pdf-download-pdf');
    const expandButton = viewer.querySelector('.pdf-expand-viewer');
    const status = viewer.querySelector('.pdf-page-status');
    const message = viewer.querySelector('.pdf-message');
    const canvas = viewer.querySelector('.pdf-canvas');
    const context = canvas.getContext('2d');
    const expandLabel = expandButton ? expandButton.querySelector('.pdf-sr-only') : null;

    let pdfDocument = null;
    let startPage = Math.max(1, startPageRaw);
    let endPage = endPageRaw;
    let currentPage = Math.max(1, initialPageRaw);
    let renderToken = 0;
    let isExpanded = false;

    function setMessage(text) {
      message.textContent = text;
      message.style.display = 'block';
    }

    function clearMessage() {
      message.style.display = 'none';
    }

    function updateControls() {
      const relativeIndex = currentPage - startPage + 1;
      const totalShown = endPage - startPage + 1;
      status.textContent = 'Slide ' + relativeIndex + ' of ' + totalShown;
      prevButton.disabled = currentPage <= startPage;
      nextButton.disabled = currentPage >= endPage;
    }

    function updateExpandButton() {
      if (!expandButton) {
        return;
      }
      const label = isExpanded ? 'Collapse viewer' : 'Expand viewer';
      expandButton.setAttribute('aria-label', label);
      expandButton.setAttribute('aria-pressed', String(isExpanded));
      expandButton.setAttribute('title', label);
      if (expandLabel) {
        expandLabel.textContent = label;
      }
      viewer.classList.toggle('pdf-page-viewer--expanded', isExpanded);
      updateExpandedBodyState();
    }

    async function renderPage(pageNumber) {
      const page = await pdfDocument.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const availableWidth = Math.max(320, viewer.clientWidth - 24);
      const availableHeight = isExpanded ? Math.max(320, window.innerHeight - 170) : Infinity;
      const widthScale = availableWidth / baseViewport.width;
      const heightScale = Number.isFinite(availableHeight) ? availableHeight / baseViewport.height : widthScale;
      const scale = Math.max(0.25, Math.min(widthScale, heightScale));
      const viewport = page.getViewport({ scale: scale });
      const outputScale = window.devicePixelRatio || 1;
      const token = ++renderToken;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';

      await page.render({
        canvasContext: context,
        transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null,
        viewport: viewport
      }).promise;

      if (token !== renderToken) {
        return;
      }

      clearMessage();
      updateControls();
    }

    async function goToPage(pageNumber) {
      currentPage = Math.min(endPage, Math.max(startPage, pageNumber));
      setMessage('Loading slide...');
      await renderPage(currentPage);
    }

    prevButton.addEventListener('click', function () {
      if (currentPage > startPage) {
        goToPage(currentPage - 1);
      }
    });

    nextButton.addEventListener('click', function () {
      if (currentPage < endPage) {
        goToPage(currentPage + 1);
      }
    });

    if (expandButton) {
      expandButton.addEventListener('click', function () {
        isExpanded = !isExpanded;
        updateExpandButton();
        if (pdfDocument) {
          window.requestAnimationFrame(function () {
            goToPage(currentPage);
          });
        }
      });
    }

    viewer.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' && currentPage > startPage) {
        event.preventDefault();
        goToPage(currentPage - 1);
      }
      if (event.key === 'ArrowRight' && currentPage < endPage) {
        event.preventDefault();
        goToPage(currentPage + 1);
      }
      if (event.key === 'Escape' && isExpanded) {
        event.preventDefault();
        isExpanded = false;
        updateExpandButton();
        if (pdfDocument) {
          window.requestAnimationFrame(function () {
            goToPage(currentPage);
          });
        }
      }
    });

    let resizeTimer = null;
    window.addEventListener('resize', function () {
      if (!pdfDocument) {
        return;
      }
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        goToPage(currentPage);
      }, 150);
    });

    async function init() {
      if (!file) {
        setMessage('Missing PDF file.');
        status.textContent = 'Unavailable';
        return;
      }

      if (downloadLink) {
        downloadLink.href = file;
      }

      updateExpandButton();

      try {
        pdfDocument = await pdfjsLib.getDocument(file).promise;
        endPage = endPageRaw > 0 ? Math.min(endPageRaw, pdfDocument.numPages) : pdfDocument.numPages;
        startPage = Math.min(startPage, endPage);
        currentPage = Math.min(Math.max(currentPage, startPage), endPage);
        await goToPage(currentPage);
      } catch (error) {
        console.error(error);
        setMessage('The PDF could not be loaded.');
        status.textContent = 'Unavailable';
      }
    }

    init();
  }

  function initAllViewers() {
    if (typeof pdfjsLib === 'undefined') {
      return;
    }
    document.querySelectorAll('.pdf-page-viewer').forEach(initViewer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllViewers, { once: true });
  } else {
    initAllViewers();
  }
})();
