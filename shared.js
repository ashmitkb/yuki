/* ══════════════════════════════════════════════════
   YUKI — FINE DINING, BANGALORE
   SHARED JAVASCRIPT SYSTEM (shared.js)
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Inject page fade overlay if it doesn't exist
  if (!document.querySelector('.page-fade-overlay')) {
    const fadeOverlay = document.createElement('div');
    fadeOverlay.className = 'page-fade-overlay';
    document.body.appendChild(fadeOverlay);
  }

  // ─── CUSTOM CURSOR ───
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  let cursorInitialized = false;

  if (cursor && cursorRing) {
    document.addEventListener('mousemove', e => {
      if (!cursorInitialized) {
        cursor.style.opacity = '1';
        cursorRing.style.opacity = '1';
        cursorInitialized = true;
      }
      mouseX = e.clientX; 
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Fix edge-trapping bug: Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorRing.style.opacity = '0';
      cursorInitialized = false;
    });

    // Animate ring with lag interpolation
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
  }

  // ─── LOADER SYNC ───
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        loader.style.opacity = '0';
        loader.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          loader.style.display = 'none';
          revealHero();
        }, 800);
      }, 2400);
    });
  } else {
    // If no loader (like menu.html), reveal hero elements immediately
    revealHero();
  }

  function revealHero() {
    const heroTag = document.getElementById('heroTag');
    const heroWord = document.getElementById('heroWord');
    const heroSub = document.getElementById('heroSub');
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroTag) heroTag.style.cssText = 'opacity:1;transform:translateY(0);transition:opacity 0.8s ease, transform 0.8s ease';
    if (heroWord) heroWord.style.cssText = 'transform:translateY(0);transition:transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s';
    if (heroSub) heroSub.style.cssText = 'opacity:1;transform:translateY(0);transition:opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
    if (heroTitle) heroTitle.style.opacity = '1';
  }

  // ─── MOBILE HAMBURGER & OVERLAY ───
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      hamburger.classList.toggle('open', menuOpen);
      hamburger.setAttribute('aria-expanded', String(menuOpen));
      mobileMenu.classList.toggle('open', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });

    // Close menu on link click
    document.querySelectorAll('.mob-link, .mob-reserve, .mob-reserve-btn').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', e => { 
      if (e.key === 'Escape' && menuOpen) hamburger.click(); 
    });
  }

  // ─── SCROLL EVENTS: PROGRESS & NAVBAR ───
  const progressLine = document.getElementById('progress-line');
  const nav = document.getElementById('nav');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const total = document.body.scrollHeight - window.innerHeight;
        
        if (progressLine && total > 0) {
          progressLine.style.width = (scrolled / total * 100) + '%';
        }
        if (nav) {
          nav.classList.toggle('scrolled', scrolled > 60);
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // ─── INTERSECTION REVEALS ───
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { 
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); 
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

  // ─── MAGNETIC BUTTONS ───
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-reserve, .filter-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { 
      btn.style.transform = ''; 
    });
  });

  // ─── SMOOTH HASH SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      
      // Only smooth scroll if target is on current page
      if (id.startsWith('#')) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ─── PREMIUM EXIT PAGE TRANSITION ───
  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === '/' || href === 'menu.html' || href === 'index.html' || href.startsWith('menu.html#') || href.startsWith('index.html#') || href.startsWith('/#'))) {
      a.addEventListener('click', e => {
        // Skip smooth scroll links pointing to hashes on same page
        const isHashSamePage = href.startsWith('#') || 
                               (window.location.pathname.endsWith('menu.html') && href.startsWith('menu.html#')) ||
                               (window.location.pathname.endsWith('index.html') && href.startsWith('index.html#')) ||
                               (!window.location.pathname.includes('.') && href.startsWith('index.html#'));
                               
        if (isHashSamePage) return;

        e.preventDefault();
        const targetUrl = a.href;
        const fadeOverlay = document.querySelector('.page-fade-overlay');
        if (fadeOverlay) {
          fadeOverlay.classList.add('active');
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 500);
        } else {
          window.location.href = targetUrl;
        }
      });
    }
  });

  // Remove fade-in overlay on load
  const fadeOverlay = document.querySelector('.page-fade-overlay');
  if (fadeOverlay) {
    fadeOverlay.classList.remove('active');
  }


  // ══════════════════════════════════════════════════
  // RESERVATION MODAL LOGIC
  // ══════════════════════════════════════════════════
  const modal = document.getElementById('booking-modal');
  if (modal) {
    const openButtons = document.querySelectorAll('a[href*="#reserve"], .mob-reserve, .mob-reserve-btn, .btn-reserve');
    const closeBtn = modal.querySelector('.booking-close');
    const stepPanels = modal.querySelectorAll('.booking-step-panel');
    const stepDots = modal.querySelectorAll('.booking-step-dot');
    
    let bookingData = {
      covers: '2',
      experience: 'Omakase Tasting Menu',
      price: '₹12,500',
      date: '',
      time: '7:00 PM',
      name: '',
      phone: '',
      email: '',
      dietaries: [],
      requests: ''
    };

    // Open Modal
    openButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        resetBookingFlow();
      });
    });

    // Close Modal
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    closeBtn.addEventListener('click', closeModal);
    modal.querySelector('.close-modal-btn').addEventListener('click', closeModal);

    // Close on click outside container
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });

    // Close on Escape Key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // RESET FLOW
    function resetBookingFlow() {
      goToStep(1);
      // Generate dynamically the next 14 available dates (skipping Mondays)
      generateCalendar();
      
      // Set default selected state in UI
      modal.querySelectorAll('#covers-select .booking-grid-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.value === bookingData.covers);
      });
      
      modal.querySelectorAll('.exp-select-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.exp === bookingData.experience);
      });
      
      modal.querySelectorAll('#slots-grid .slot-button').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.time === bookingData.time);
      });

      // Clear Form Input elements
      modal.querySelector('#booking-name').value = '';
      modal.querySelector('#booking-phone').value = '';
      modal.querySelector('#booking-email').value = '';
      modal.querySelector('#booking-requests').value = '';
      modal.querySelectorAll('.dietary-checkbox').forEach(box => box.classList.remove('selected'));
      bookingData.dietaries = [];
    }

    // STEP NAVIGATION CONTROLLER
    function goToStep(stepNum) {
      stepPanels.forEach(panel => {
        panel.classList.toggle('active', parseInt(panel.dataset.step) === stepNum);
      });
      
      stepDots.forEach(dot => {
        const dStep = parseInt(dot.dataset.step);
        dot.classList.toggle('active', dStep === stepNum);
        dot.classList.toggle('completed', dStep < stepNum);
      });
    }

    // Step 1: Covers Grid Event Listeners
    modal.querySelectorAll('#covers-select .booking-grid-item').forEach(item => {
      item.addEventListener('click', () => {
        modal.querySelectorAll('#covers-select .booking-grid-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        bookingData.covers = item.dataset.value;
      });
    });

    // Step 1: Experience Selector Card Event Listeners
    modal.querySelectorAll('.exp-select-card').forEach(card => {
      card.addEventListener('click', () => {
        modal.querySelectorAll('.exp-select-card').forEach(el => el.classList.remove('selected'));
        card.classList.add('selected');
        bookingData.experience = card.dataset.exp;
        bookingData.price = card.dataset.price;
      });
    });

    // Step 2: Time Slots Event Listeners
    modal.querySelectorAll('#slots-grid .slot-button').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('#slots-grid .slot-button').forEach(el => el.classList.remove('selected'));
        btn.classList.add('selected');
        bookingData.time = btn.dataset.time;
      });
    });

    // Step 3: Dietaries Selectors
    modal.querySelectorAll('.dietary-checkbox').forEach(box => {
      box.addEventListener('click', () => {
        const dietVal = box.dataset.diet;
        if (dietVal === 'None') {
          // Clear all others
          modal.querySelectorAll('.dietary-checkbox').forEach(el => el.classList.remove('selected'));
          box.classList.add('selected');
          bookingData.dietaries = ['None'];
        } else {
          // Remove 'None'
          const noneBox = modal.querySelector('.dietary-checkbox[data-diet="None"]');
          if (noneBox) noneBox.classList.remove('selected');
          bookingData.dietaries = bookingData.dietaries.filter(d => d !== 'None');

          box.classList.toggle('selected');
          if (box.classList.contains('selected')) {
            if (!bookingData.dietaries.includes(dietVal)) bookingData.dietaries.push(dietVal);
          } else {
            bookingData.dietaries = bookingData.dietaries.filter(d => d !== dietVal);
          }
        }
      });
    });

    // Next/Prev Buttons Logic
    modal.querySelectorAll('.next-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentPanel = btn.closest('.booking-step-panel');
        const currentStep = parseInt(currentPanel.dataset.step);
        
        // Validation rules per step
        if (currentStep === 2 && !bookingData.date) {
          alert('Please select a dining date to proceed.');
          return;
        }
        
        goToStep(currentStep + 1);
      });
    });

    modal.querySelectorAll('.prev-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentPanel = btn.closest('.booking-step-panel');
        const currentStep = parseInt(currentPanel.dataset.step);
        goToStep(currentStep - 1);
      });
    });

    // SUBMIT & CONFIRM BOOKING
    modal.querySelector('.submit-booking').addEventListener('click', () => {
      const nameInput = modal.querySelector('#booking-name');
      const phoneInput = modal.querySelector('#booking-phone');
      const emailInput = modal.querySelector('#booking-email');
      
      if (!nameInput.checkValidity() || !phoneInput.checkValidity() || !emailInput.checkValidity()) {
        nameInput.reportValidity() || phoneInput.reportValidity() || emailInput.reportValidity();
        return;
      }

      bookingData.name = nameInput.value;
      bookingData.phone = phoneInput.value;
      bookingData.email = emailInput.value;
      bookingData.requests = modal.querySelector('#booking-requests').value;

      // Populate Success Summary Panel
      const refId = 'YUKI-' + Math.floor(1000 + Math.random() * 9000);
      modal.querySelector('#success-ref-id').innerText = refId;
      
      modal.querySelector('#summary-covers').innerText = bookingData.covers + ' Covers';
      modal.querySelector('#summary-exp').innerText = bookingData.experience + ' (' + bookingData.price + '/pp)';
      
      // Formatting selected date nicely
      const dateObj = new Date(bookingData.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      modal.querySelector('#summary-datetime').innerText = formattedDate + ' at ' + bookingData.time;
      
      modal.querySelector('#summary-contact').innerText = bookingData.name + ' (' + bookingData.phone + ')';

      goToStep(4);
    });

    // GENERATE CALENDAR DATES (Skip Mondays)
    function generateCalendar() {
      const calendarGrid = modal.querySelector('#calendar-grid');
      if (!calendarGrid) return;
      
      calendarGrid.innerHTML = '';
      
      // Add day header row labels
      const dayLabels = ['Sun', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      // We skip Mon in the grid representation or just show days in a linear row
      // A linear list of available dates is much easier and cleaner than a monthly calendar grid
      // Let's create a beautiful linear list of the next 12 valid dates.
      
      const datesList = [];
      let currentDate = new Date();
      
      // Start checking from tomorrow
      currentDate.setDate(currentDate.getDate() + 1);

      while (datesList.length < 12) {
        // Day index (0 = Sun, 1 = Mon, 2 = Tue, ...)
        if (currentDate.getDay() !== 1) { // 1 represents Monday (Yuki is closed on Mondays)
          datesList.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      datesList.forEach((date, index) => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        
        const dayNum = date.getDate();
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        dayEl.innerHTML = `
          <span style="font-size:0.55rem;text-transform:uppercase;color:var(--gold-dim);margin-bottom:2px;">${weekday}</span>
          <strong>${dayNum}</strong>
          <span class="day-month">${monthName}</span>
        `;
        
        const isoDateString = date.toISOString().split('T')[0];
        dayEl.dataset.date = isoDateString;
        
        // Select first date by default
        if (index === 0) {
          dayEl.classList.add('selected');
          bookingData.date = isoDateString;
        }

        dayEl.addEventListener('click', () => {
          calendarGrid.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
          dayEl.classList.add('selected');
          bookingData.date = isoDateString;
        });

        calendarGrid.appendChild(dayEl);
      });
    }
  }
});
