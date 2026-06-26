/* ══════════════════════════════════════════════════
   YUKI — FINE DINING, BANGALORE
   HOME PAGE SPECIFIC JS (index.js)
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── PARTICLES GENERATOR ───
  const particlesEl = document.getElementById('particles');
  if (particlesEl) {
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--duration', (8 + Math.random() * 12) + 's');
      p.style.setProperty('--delay', (Math.random() * 10) + 's');
      p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      particlesEl.appendChild(p);
    }
  }

  // ─── PARALLAX HERO BACKGROUND ───
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.innerWidth > 900) {
            const scrolled = window.scrollY;
            heroBg.style.transform = `translateY(${scrolled * 0.12}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ─── GALLERY DRAG & AUTO-SCROLL (WITH BUG FIX) ───
  const galleryTrack = document.getElementById('galleryTrack');
  if (galleryTrack) {
    let isDragging = false, startX = 0, scrollLeft = 0, galleryPos = 0;
    const parentContainer = galleryTrack.parentElement;

    // Mouse drag triggers
    galleryTrack.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.pageX - galleryTrack.offsetLeft;
      scrollLeft = parentContainer.scrollLeft;
      galleryTrack.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const x = e.pageX - galleryTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      parentContainer.scrollLeft = scrollLeft - walk;
    });

    document.addEventListener('mouseup', () => { 
      isDragging = false; 
      galleryTrack.style.cursor = ''; 
    });

    // BUG FIX: Synchronize the auto-scroll position with manual scrolling
    // (trackpad swipe or mouse scrollwheel) to prevent snap-back loops.
    parentContainer.addEventListener('scroll', () => {
      if (!isDragging) {
        galleryPos = parentContainer.scrollLeft;
      }
    });

    // Auto scroll rendering
    function autoScrollGallery() {
      if (!isDragging) {
        galleryPos += 0.4;
        const max = galleryTrack.scrollWidth - parentContainer.offsetWidth;
        if (galleryPos >= max) {
          galleryPos = 0;
        }
        parentContainer.scrollLeft = galleryPos;
      }
      requestAnimationFrame(autoScrollGallery);
    }
    
    // Begin auto-scroll after a short delay for layout to settle
    setTimeout(autoScrollGallery, 1200);
  }
});
