/* ==========================================================================
   KHANA DRAMA — script.js
   ========================================================================== */
(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Loading screen ---------------- */
  window.addEventListener('load', function(){
    var loader = document.getElementById('loader');
    setTimeout(function(){ loader.classList.add('hide'); }, 500);
  });

  /* ---------------- Scroll progress bar ---------------- */
  var progressBar = document.getElementById('scroll-progress');
  function updateProgress(){
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var scrollHeight = h.scrollHeight - h.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ---------------- Nav scrolled state + active link ---------------- */
  var nav = document.getElementById('siteNav');
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"], .mm-links a[href^="#"]'));
  var fabTop = document.getElementById('fabTop');

  function onScroll(){
    updateProgress();
    if (window.scrollY > 40){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
    if (window.scrollY > 600){ fabTop.classList.add('show'); } else { fabTop.classList.remove('show'); }

    var scrollPos = window.scrollY + 140;
    sections.forEach(function(sec){
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight){
        navLinks.forEach(function(a){ a.classList.remove('active'); });
        var match = navLinks.find(function(a){ return a.getAttribute('href') === '#' + sec.id; });
        if (match) match.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  fabTop.addEventListener('click', function(){ window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ---------------- Mobile menu ---------------- */
  var burger = document.getElementById('burgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMobileMenu(){
    mobileMenu.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu(){
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', function(){
    if (mobileMenu.classList.contains('open')) closeMobileMenu(); else openMobileMenu();
  });
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

  mobileMenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
  });

  // Guard: if the viewport is resized/rotated past the mobile breakpoint while
  // the menu is open, close it so it can't get stuck covering the desktop layout.
  window.addEventListener('resize', function(){
    if (window.innerWidth > 900 && mobileMenu.classList.contains('open')) closeMobileMenu();
  });

  /* ---------------- Hero particles ---------------- */
  var particleWrap = document.getElementById('heroParticles');
  if (particleWrap && !reduceMotion){
    var count = window.innerWidth < 720 ? 14 : 26;
    for (var i=0;i<count;i++){
      var p = document.createElement('span');
      p.style.left = Math.random()*100 + '%';
      p.style.animationDuration = (8 + Math.random()*10) + 's';
      p.style.animationDelay = (Math.random()*10) + 's';
      p.style.opacity = (0.2 + Math.random()*0.5).toFixed(2);
      particleWrap.appendChild(p);
    }
  }

  /* ---------------- Hero mouse parallax ---------------- */
  var heroBg = document.getElementById('heroBg');
  if (heroBg && window.matchMedia('(hover:hover)').matches && !reduceMotion){
    document.querySelector('.hero').addEventListener('mousemove', function(e){
      var x = (e.clientX / window.innerWidth - 0.5) * 18;
      var y = (e.clientY / window.innerHeight - 0.5) * 18;
      heroBg.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------------- Menu Acts tabs ---------------- */
  var actBtns = Array.prototype.slice.call(document.querySelectorAll('.act-btn'));
  var actPanels = Array.prototype.slice.call(document.querySelectorAll('.act-panel'));
  actBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      actBtns.forEach(function(b){ b.classList.remove('active'); });
      actPanels.forEach(function(p){ p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById(btn.dataset.act).classList.add('active');
    });
  });

  /* ---------------- Animated counters ---------------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  function animateCounter(el){
    var target = parseInt(el.dataset.count, 10);
    var decimal = el.dataset.decimal ? parseInt(el.dataset.decimal,10) : 0;
    var divisor = Math.pow(10, decimal);
    var duration = 1800, start = null;
    function step(ts){
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = (target * eased) / divisor;
      el.textContent = decimal ? val.toFixed(decimal) : Math.floor(val).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = decimal ? (target/divisor).toFixed(decimal) : target.toLocaleString('en-IN');
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window){
    var counterIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(c){ counterIO.observe(c); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------------- Chef specials carousel arrows ---------------- */
  var track = document.getElementById('specialsTrack');
  var prevBtn = document.getElementById('specialPrev');
  var nextBtn = document.getElementById('specialNext');
  if (track){
    var scrollAmt = function(){ return track.clientWidth * 0.8; };
    prevBtn.addEventListener('click', function(){ track.scrollBy({ left: -scrollAmt(), behavior:'smooth' }); });
    nextBtn.addEventListener('click', function(){ track.scrollBy({ left: scrollAmt(), behavior:'smooth' }); });
  }

  /* ---------------- Gallery lightbox ---------------- */
  var masonryItems = Array.prototype.slice.call(document.querySelectorAll('.masonry-item'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentIndex = 0;

  function openLightbox(idx){
    currentIndex = idx;
    var item = masonryItems[idx];
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector('img').alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  masonryItems.forEach(function(item, idx){
    item.addEventListener('click', function(){ openLightbox(idx); });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', function(){ openLightbox((currentIndex - 1 + masonryItems.length) % masonryItems.length); });
  lightboxNext.addEventListener('click', function(){ openLightbox((currentIndex + 1) % masonryItems.length); });
  document.addEventListener('keydown', function(e){
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* ---------------- Button ripple ---------------- */
  document.querySelectorAll('.btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function(){ ripple.remove(); }, 650);
    });
  });

  /* ---------------- Custom cursor (desktop) ---------------- */
  var cursorDot = document.getElementById('cursorDot');
  if (cursorDot && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.addEventListener('mousemove', function(e){
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .dish-card, .masonry-item').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursorDot.classList.add('grow'); });
      el.addEventListener('mouseleave', function(){ cursorDot.classList.remove('grow'); });
    });
  }

  /* ---------------- Smooth anchor navigation offset for fixed nav ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = target.getBoundingClientRect().top + window.scrollY - 74;
      window.scrollTo({ top: offset, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

})();