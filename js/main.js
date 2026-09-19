/**
 * AVENZIA — CREATIVE • DIGITAL • AGENCY
 * Master Client-Side Logic Engine
 * Includes: Multi-Currency Engine, AI Network Canvas, Workflow Pipeline,
 * Case Study Modal, Services Inspector, and WhatsApp Inquiry Dispatcher.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURATION & EXCHANGE RATES ENGINE
  // ==========================================================================
  const CURRENCY_CONFIG = {
    baseCurrency: 'USD',
    rates: {
      PKR: { rate: 1, symbol: 'PKR ', formatDecimals: 0, prefix: true },
      USD: { rate: 1 / 278, symbol: '$', formatDecimals: 0, prefix: true },
      EUR: { rate: 1 / 300, symbol: '€', formatDecimals: 0, prefix: true },
      AED: { rate: 1 / 76, symbol: 'AED ', formatDecimals: 0, prefix: true },
      GBP: { rate: 1 / 355, symbol: '£', formatDecimals: 0, prefix: true }
    },
    regionDefaults: {
      'pk': 'PKR',
      'us': 'USD',
      'ca': 'USD',
      'uk': 'GBP',
      'ae': 'AED',
      'eu': 'EUR'
    }
  };

  let currentCurrency = 'USD';
  let currentRegion = 'us';

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const updateAllPrices = (targetCurrency) => {
    currentCurrency = targetCurrency;
    const config = CURRENCY_CONFIG.rates[targetCurrency] || CURRENCY_CONFIG.rates.USD;
    
    // Update all elements with data-base-pkr attribute
    const priceElements = document.querySelectorAll('[data-base-pkr]');
    priceElements.forEach(el => {
      const pkrValue = parseFloat(el.getAttribute('data-base-pkr'));
      if (isNaN(pkrValue)) return;
      
      const converted = pkrValue * config.rate;
      // Round nicely: for foreign currencies, round to nearest 5 or 10 for clean agency pricing
      let finalVal;
      if (targetCurrency === 'PKR') {
        finalVal = formatNumber(pkrValue);
      } else {
        // Round to nearest 5 for clean aesthetics
        const rounded = Math.ceil(converted / 5) * 5;
        finalVal = formatNumber(rounded);
      }

      el.textContent = `${config.symbol}${finalVal}`;
    });

    // Update Currency Display in header button
    const currencyLabel = document.getElementById('currentCurrencyLabel');
    if (currencyLabel) {
      currencyLabel.textContent = `🌐 EN | ${targetCurrency}`;
    }

    // Update active state in dropdown
    document.querySelectorAll('.currency-option').forEach(btn => {
      if (btn.getAttribute('data-currency') === targetCurrency) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  };

  // Setup Global Dropdown listeners
  const globalToggleBtn = document.getElementById('globalSelectorBtn');
  const globalDropdown = document.getElementById('globalDropdown');

  if (globalToggleBtn && globalDropdown) {
    globalToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      globalDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!globalDropdown.contains(e.target) && e.target !== globalToggleBtn) {
        globalDropdown.classList.remove('active');
      }
    });

    // Currency options click
    document.querySelectorAll('.currency-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedCurr = btn.getAttribute('data-currency');
        updateAllPrices(selectedCurr);
        globalDropdown.classList.remove('active');
      });
    });

    // Region options click
    document.querySelectorAll('.region-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const region = btn.getAttribute('data-region');
        currentRegion = region;
        const defaultCurr = CURRENCY_CONFIG.regionDefaults[region] || 'USD';
        
        document.querySelectorAll('.region-option').forEach(r => r.classList.remove('selected'));
        btn.classList.add('selected');

        updateAllPrices(defaultCurr);
        globalDropdown.classList.remove('active');
      });
    });
  }

  // Initialize with USD as default international standard
  updateAllPrices('USD');


  // ==========================================================================
  // 2. HEADER SCROLL & DARK SECTION SPY
  // ==========================================================================
  const header = document.querySelector('.header');
  const darkSections = document.querySelectorAll('.ai-hero-section, .ai-services-section, .ai-workflow-section, .usecases-section, .ai-pricing-section, .ai-process-section, .contact-hero-section, .footer');
  const headerLogoDark = document.getElementById('headerLogoDark');
  const headerLogoLight = document.getElementById('headerLogoLight');

  const handleHeaderScroll = () => {
    const scrollY = window.scrollY;
    
    // Sticky blur class
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button
    const btt = document.getElementById('backToTopBtn');
    if (btt) {
      if (scrollY > 600) {
        btt.classList.add('show');
      } else {
        btt.classList.remove('show');
      }
    }

    // Check if header is currently over a dark section
    const headerRect = header.getBoundingClientRect();
    const headerCenter = headerRect.top + (headerRect.height / 2);

    let isOverDark = false;
    darkSections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (headerCenter >= rect.top && headerCenter <= rect.bottom) {
        isOverDark = true;
      }
    });

    if (isOverDark) {
      header.classList.add('header-dark');
      if (headerLogoDark && headerLogoLight) {
        headerLogoDark.style.display = 'none';
        headerLogoLight.style.display = 'block';
      }
    } else {
      header.classList.remove('header-dark');
      if (headerLogoDark && headerLogoLight) {
        headerLogoDark.style.display = 'block';
        headerLogoLight.style.display = 'none';
      }
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // Mobile Menu Toggle
  const mobileToggleBtn = document.getElementById('mobileMenuBtn');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');

  if (mobileToggleBtn && mobileOverlay) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeMobileNav = () => {
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', closeMobileNav);
    }

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }


  // ==========================================================================
  // 3. AI NETWORK CANVAS ANIMATION (SECTION 7)
  // ==========================================================================
  const canvas = document.getElementById('aiNetworkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;
    const maxDistance = 140;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      width = canvas.width = parent.clientWidth;
      height = canvas.height = parent.clientHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.baseColor = Math.random() > 0.4 ? 'rgba(197, 168, 128, ' : 'rgba(240, 240, 245, ';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor + '0.7)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(197, 168, 128, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    };

    animateParticles();
  }


  // ==========================================================================
  // 4. HERO INTERACTIVE CANVAS EFFECT
  // ==========================================================================
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const hCtx = heroCanvas.getContext('2d');
    let hWidth, hHeight;
    let mouse = { x: null, y: null };

    const resizeHero = () => {
      const parent = heroCanvas.parentElement;
      hWidth = heroCanvas.width = parent.clientWidth;
      hHeight = heroCanvas.height = parent.clientHeight;
    };
    window.addEventListener('resize', resizeHero);
    resizeHero();

    const heroNodes = [
      { x: 0.2, y: 0.3, vx: 0.15, vy: 0.1 },
      { x: 0.5, y: 0.2, vx: -0.1, vy: 0.15 },
      { x: 0.8, y: 0.4, vx: -0.12, vy: -0.12 },
      { x: 0.35, y: 0.7, vx: 0.1, vy: -0.1 },
      { x: 0.7, y: 0.75, vx: 0.12, vy: 0.1 }
    ];

    const animateHeroCanvas = () => {
      hCtx.clearRect(0, 0, hWidth, hHeight);

      // Render subtle interconnected mesh overlay
      for (let i = 0; i < heroNodes.length; i++) {
        const n1 = heroNodes[i];
        n1.x += n1.vx * 0.0015;
        n1.y += n1.vy * 0.0015;

        if (n1.x < 0.1 || n1.x > 0.9) n1.vx *= -1;
        if (n1.y < 0.1 || n1.y > 0.9) n1.vy *= -1;

        const px1 = n1.x * hWidth;
        const py1 = n1.y * hHeight;

        for (let j = i + 1; j < heroNodes.length; j++) {
          const n2 = heroNodes[j];
          const px2 = n2.x * hWidth;
          const py2 = n2.y * hHeight;

          hCtx.beginPath();
          hCtx.moveTo(px1, py1);
          hCtx.lineTo(px2, py2);
          hCtx.strokeStyle = 'rgba(197, 168, 128, 0.25)';
          hCtx.lineWidth = 1;
          hCtx.setLineDash([4, 6]);
          hCtx.stroke();
          hCtx.setLineDash([]);
        }

        hCtx.beginPath();
        hCtx.arc(px1, py1, 3.5, 0, Math.PI * 2);
        hCtx.fillStyle = '#C5A880';
        hCtx.fill();
      }

      requestAnimationFrame(animateHeroCanvas);
    };

    animateHeroCanvas();
  }


  // ==========================================================================
  // 5. AI WORKFLOW PIPELINE INTERACTION (SECTION 9)
  // ==========================================================================
  const workflowNodes = document.querySelectorAll('.workflow-step-node');
  let currentActiveNode = 0;

  if (workflowNodes.length > 0) {
    setInterval(() => {
      workflowNodes.forEach((node, idx) => {
        if (idx === currentActiveNode) {
          node.style.borderColor = 'var(--color-champagne)';
          node.style.boxShadow = '0 0 25px rgba(197, 168, 128, 0.4)';
        } else {
          node.style.borderColor = '';
          node.style.boxShadow = '';
        }
      });
      currentActiveNode = (currentActiveNode + 1) % workflowNodes.length;
    }, 1800);
  }


  // ==========================================================================
  // 6. CASE STUDIES MODAL & FILTERING SYSTEM (SECTION 17)
  // ==========================================================================
  const CASE_STUDIES_DATA = {
    'proj-1': {
      title: 'PROJECT 01 — BRAND EXPERIENCE',
      category: 'Brand Identity & Visual System',
      tech: ['Brand Architecture', 'Figma', 'Visual Guidelines', 'Design System'],
      challenge: 'A multi-regional venture group needed a cohesive, future-forward visual identity that positioned them credibly across North America, the UK, and the GCC without losing brand coherence.',
      strategy: 'Engineered a high-precision monolithic identity system built on geometric typographic harmony, adaptive color palettes, and strict international guidelines.',
      solution: 'Developed the complete visual language, executive presentation systems, digital collateral guidelines, and interactive brand book.',
      technology: 'Figma Enterprise, WebGL Brand Portal, Custom Typeface Licensing.',
      result: 'Verified real-world metrics will be published upon client public disclosure.'
    },
    'proj-2': {
      title: 'PROJECT 02 — DIGITAL PRODUCT',
      category: 'Digital Product Design & UX',
      tech: ['Next.js', 'TypeScript', 'Tailwind', 'Design Systems', 'Figma'],
      challenge: 'Transforming a complex multi-layered data analytics dashboard into an intuitive, high-velocity digital product for executive decision-makers.',
      strategy: 'Conducted comprehensive user persona research, simplified visual information hierarchies, and implemented cognitive-load-reduction heuristics.',
      solution: 'Crafted a zero-friction design system, dark/light adaptive modules, and ultra-responsive data tables with instant filtering.',
      technology: 'Enterprise UX Framework, Micro-interactions, High-Performance Canvas Graphics.',
      result: 'Verified real-world metrics will be published upon client public disclosure.'
    },
    'proj-3': {
      title: 'PROJECT 03 — E-COMMERCE',
      category: 'Global E-Commerce Architecture',
      tech: ['Shopify Plus / Headless', 'Stripe', 'Multi-Currency', 'GraphQL'],
      challenge: 'Scaling a luxury lifestyle brand into international markets requiring multi-currency checkout, localized shipping integrations, and sub-second page loads.',
      strategy: 'Constructed a headless commerce frontend integrated with automated inventory sync and localized checkout gateways.',
      solution: 'Deployed an ultra-fast editorial digital storefront with dynamic international currency recalculation and high-converting checkout flows.',
      technology: 'Headless Commerce Architecture, Global CDN, Stripe Billing Engine, Algolia Search.',
      result: 'Verified real-world metrics will be published upon client public disclosure.'
    },
    'proj-4': {
      title: 'PROJECT 04 — WEB APPLICATION',
      category: 'Custom Web Application',
      tech: ['React / Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
      challenge: 'Consolidating multiple disconnected legacy operational spreadsheets into an integrated internal management web platform.',
      strategy: 'Built a modular, cloud-native web architecture with strict role-based access control and live multi-user concurrency.',
      solution: 'Engineered a proprietary internal platform unifying project tracking, document approvals, client portals, and automated billing generation.',
      technology: 'Modern Web Application Stack, Secure JWT Auth, Docker, Cloudflare Enterprise.',
      result: 'Verified real-world metrics will be published upon client public disclosure.'
    },
    'proj-5': {
      title: 'PROJECT 05 — AI AUTOMATION',
      category: 'AI Agents & Business Automation',
      tech: ['OpenAI / Anthropic APIs', 'Make.com / n8n', 'WhatsApp Cloud API', 'Vector DB'],
      challenge: 'A high-volume services company was losing 40% of prospective inbound leads due to slow multi-hour manual response times outside business hours.',
      strategy: 'Designed an autonomous 24/7 AI lead qualification agent with real-time CRM routing and conversational WhatsApp handoff.',
      solution: 'Deployed a multi-model AI assistant integrated directly with WhatsApp, email parsing engines, and central CRM pipelines.',
      technology: 'LLM Orchestration, WhatsApp Business API, CRM Webhooks, PostgreSQL Vector Storage.',
      result: 'Verified real-world metrics will be published upon client public disclosure.'
    },
    'proj-6': {
      title: 'PROJECT 06 — SAAS PLATFORM',
      category: 'Scalable SaaS Architecture',
      tech: ['TypeScript', 'Microservices', 'Stripe Subscriptions', 'Kubernetes'],
      challenge: 'Architecting a scalable multi-tenant SaaS application designed to handle enterprise tier workloads with high availability.',
      strategy: 'Engineered clean tenant isolation, subscription tier billing automations, and resilient asynchronous worker queues.',
      solution: 'Launched an enterprise-ready SaaS suite with automated self-serve onboarding, webhook integrations, and telemetry monitoring.',
      technology: 'Cloud Native Microservices, Stripe Billing, CI/CD Pipeline, Distributed Cache.',
      result: 'Verified real-world metrics will be published upon client public disclosure.'
    }
  };

  const caseModal = document.getElementById('caseModal');
  const modalBody = document.getElementById('modalCaseDetails');
  const modalCloseBtn = document.getElementById('closeCaseModalBtn');

  const openCaseModal = (projectId) => {
    const data = CASE_STUDIES_DATA[projectId];
    if (!data || !modalBody || !caseModal) return;

    modalBody.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--color-champagne); letter-spacing: 0.1em; text-transform: uppercase;">
          ${data.category}
        </span>
        <h2 style="font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 800; margin: 0.5rem 0 1rem; letter-spacing: -0.02em;">
          ${data.title}
        </h2>
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1.5rem;">
          ${data.tech.map(t => `<span class="case-tech-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--color-bg-subtle); padding: 1.25rem 1.5rem; border-radius: var(--radius-md); border-left: 3px solid var(--color-text-primary);">
          <h4 style="font-size: 0.875rem; font-family: var(--font-mono); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem;">The Challenge</h4>
          <p style="font-size: 0.9375rem; color: var(--color-text-secondary); line-height: 1.6;">${data.challenge}</p>
        </div>

        <div style="background: var(--color-bg-subtle); padding: 1.25rem 1.5rem; border-radius: var(--radius-md); border-left: 3px solid var(--color-champagne);">
          <h4 style="font-size: 0.875rem; font-family: var(--font-mono); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem;">Strategic Approach</h4>
          <p style="font-size: 0.9375rem; color: var(--color-text-secondary); line-height: 1.6;">${data.strategy}</p>
        </div>

        <div style="background: var(--color-bg-subtle); padding: 1.25rem 1.5rem; border-radius: var(--radius-md); border-left: 3px solid #10b981;">
          <h4 style="font-size: 0.875rem; font-family: var(--font-mono); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem;">The Solution</h4>
          <p style="font-size: 0.9375rem; color: var(--color-text-secondary); line-height: 1.6;">${data.solution}</p>
        </div>

        <div style="background: var(--color-bg-subtle); padding: 1.25rem 1.5rem; border-radius: var(--radius-md); border-left: 3px solid var(--color-silver);">
          <h4 style="font-size: 0.875rem; font-family: var(--font-mono); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem;">Technology Architecture</h4>
          <p style="font-size: 0.9375rem; color: var(--color-text-secondary); line-height: 1.6;">${data.technology}</p>
        </div>

        <div style="background: var(--color-bg-subtle); padding: 1.25rem 1.5rem; border-radius: var(--radius-md); border-left: 3px solid var(--color-text-tertiary);">
          <h4 style="font-size: 0.875rem; font-family: var(--font-mono); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem;">Verified Results</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-tertiary); font-style: italic;">${data.result}</p>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <a href="#contact" class="btn btn-primary btn-sm modal-contact-trigger">Inquire About Similar Project →</a>
      </div>
    `;

    caseModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Hook modal contact link to close modal and scroll
    const contactTrigger = modalBody.querySelector('.modal-contact-trigger');
    if (contactTrigger) {
      contactTrigger.addEventListener('click', () => {
        caseModal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  };

  document.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('click', () => {
      const projId = card.getAttribute('data-case-id');
      openCaseModal(projId);
    });
  });

  if (modalCloseBtn && caseModal) {
    modalCloseBtn.addEventListener('click', () => {
      caseModal.classList.remove('open');
      document.body.style.overflow = '';
    });

    caseModal.addEventListener('click', (e) => {
      if (e.target === caseModal) {
        caseModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Work Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      document.querySelectorAll('.case-card').forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ==========================================================================
  // 7. CONTACT FORM & DIRECT WHATSAPP INTEGRATION (SECTIONS 22 & 23)
  // ==========================================================================
  const inquiryForm = document.getElementById('inquiryForm');
  const formStatus = document.getElementById('formStatus');
  const OFFICIAL_PHONE = '+923432782604';

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName')?.value.trim() || '';
      const company = document.getElementById('companyName')?.value.trim() || 'N/A';
      const email = document.getElementById('emailAddress')?.value.trim() || '';
      const phone = document.getElementById('phoneNumber')?.value.trim() || '';
      const country = document.getElementById('countryName')?.value.trim() || '';
      const service = document.getElementById('serviceSelect')?.value || '';
      const budget = document.getElementById('budgetSelect')?.value || '';
      const details = document.getElementById('projectDetails')?.value.trim() || '';

      if (!fullName || !email || !service || !budget) {
        alert('Please complete all required fields (Name, Email, Service, Budget).');
        return;
      }

      // Format clean message for WhatsApp API
      const waMessage = 
        `*NEW PROJECT INQUIRY — AVENZIA*\n\n` +
        `*Name:* ${fullName}\n` +
        `*Company:* ${company}\n` +
        `*Email:* ${email}\n` +
        `*Phone:* ${phone}\n` +
        `*Country:* ${country}\n` +
        `*Service:* ${service}\n` +
        `*Budget:* ${budget}\n\n` +
        `*Project Details:*\n${details}\n\n` +
        `_Sent via AVENZIA Corporate Web Portal_`;

      const encodedMsg = encodeURIComponent(waMessage);
      const whatsappUrl = `https://wa.me/${OFFICIAL_PHONE}?text=${encodedMsg}`;

      // Show success message
      if (formStatus) {
        formStatus.className = 'form-status-box success';
        formStatus.innerHTML = `
          ✓ Thank you, ${fullName}! Your inquiry details have been captured.
          <br><br>
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm" style="display:inline-flex; margin-top:8px;">
            Open WhatsApp with Details (+92 343 2782604) →
          </a>
        `;
        formStatus.style.display = 'block';
      }

      // Automatically launch WhatsApp in new tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      inquiryForm.reset();
    });
  }

  // Hook all "START A PROJECT" and "BUILD MY AI SYSTEM" CTA buttons
  document.querySelectorAll('a[href="#contact"]').forEach(cta => {
    cta.addEventListener('click', (e) => {
      const target = document.getElementById('contact');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Back to top button listener
  const bttBtn = document.getElementById('backToTopBtn');
  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 8. SCROLL READING PROGRESS BAR
  // ==========================================================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  if (scrollProgressBar) {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgressBar.style.width = `${progress}%`;
      }
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }


  // ==========================================================================
  // 9. AUTOMATED STAGGERED SCROLL REVEAL ENGINE
  // ==========================================================================
  const revealSelectors = [
    '.section-header-block',
    '.hero-content > *',
    '.hero-visual-frame',
    '.trust-regions-strip',
    '.service-card',
    '.ai-service-card',
    '.pricing-card',
    '.portfolio-card',
    '.testimonial-card',
    '.process-card',
    '.workflow-step-node',
    '.metric-item',
    '.contact-hero-inner',
    '.contact-form-wrapper-card',
    '.faq-item',
    '.value-prop-card'
  ];

  const elementsToReveal = document.querySelectorAll(revealSelectors.join(', '));
  
  elementsToReveal.forEach((el) => {
    el.classList.add('reveal-on-scroll');
    // Add staggered delay to elements inside grids
    const parentGrid = el.closest('.services-grid, .ai-services-grid, .pricing-grid, .portfolio-grid, .testimonials-grid, .usecases-grid, .process-grid');
    if (parentGrid) {
      const siblings = Array.from(parentGrid.children);
      const childIndex = siblings.indexOf(el);
      if (childIndex !== -1) {
        const delay = (childIndex % 4) * 0.1;
        el.style.transitionDelay = `${delay}s`;
      }
    }
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    elementsToReveal.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    elementsToReveal.forEach(el => el.classList.add('in-view'));
  }


  // ==========================================================================
  // 10. ANIMATED METRICS / NUMBERS COUNTER
  // ==========================================================================
  const metricValues = document.querySelectorAll('.metric-value');
  let metricsAnimated = false;

  const animateMetrics = () => {
    if (metricsAnimated) return;
    metricsAnimated = true;

    metricValues.forEach(el => {
      const text = el.textContent.trim();
      const numMatch = text.match(/\d+/);
      if (!numMatch) return;

      const targetNum = parseInt(numMatch[0], 10);
      const suffix = text.replace(numMatch[0], '');
      let current = 0;
      const duration = 1600;
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      const increment = targetNum / totalSteps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
          el.textContent = `${targetNum}${suffix}`;
          clearInterval(timer);
        } else {
          el.textContent = `${Math.floor(current)}${suffix}`;
        }
      }, stepTime);
    });
  };

  const metricsContainer = document.querySelector('.hero-metrics');
  if (metricsContainer && 'IntersectionObserver' in window) {
    const metricObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateMetrics();
          metricObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    metricObserver.observe(metricsContainer);
  }


  // ==========================================================================
  // 11. 3D PERSPECTIVE TILT ON CARDS
  // ==========================================================================
  const tiltableCards = document.querySelectorAll('.service-card, .ai-service-card, .pricing-card, .portfolio-card, .usecase-card');

  if (window.matchMedia('(pointer: fine)').matches) {
    tiltableCards.forEach(card => {
      card.classList.add('tilt-card');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  console.log('AVENZIA Agency Portal Engine loaded successfully.');
});
