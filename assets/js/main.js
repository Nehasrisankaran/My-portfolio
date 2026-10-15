/**
 * NEHASRI S. — PORTFOLIO INTERACTION ENGINE
 * AI Engineer · Team Lead · Builder
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initThemePicker();
  initNavbar();
  initHeroTyping();
  initProjectFiltering();
  initProjectModals();
  initTerminal();
  initContactInteractions();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. NEURAL PARTICLE NETWORK (CANVAS)
   -------------------------------------------------------------------------- */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
      this.radius = Math.random() * 1.8 + 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle repulsion
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || '#00f5a0';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          let alpha = 1 - dist / 110;
          ctx.strokeStyle = `rgba(0, 245, 160, ${alpha * 0.15})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   2. THEME ACCENT PICKER
   -------------------------------------------------------------------------- */
function initThemePicker() {
  const dots = document.querySelectorAll('.theme-dot');
  const savedTheme = localStorage.getItem('nehasri_portfolio_theme') || 'emerald';

  applyTheme(savedTheme);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-set-theme');
      applyTheme(theme);
    });
  });

  function applyTheme(theme) {
    if (theme === 'emerald') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('nehasri_portfolio_theme', theme);

    dots.forEach(d => {
      d.classList.toggle('active', d.getAttribute('data-set-theme') === theme);
    });
  }
}

/* --------------------------------------------------------------------------
   3. NAVBAR, SCROLL SPY & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      drawer.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(l => {
      l.addEventListener('click', () => {
        toggle.classList.remove('active');
        drawer.classList.remove('open');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   4. HERO TYPING EFFECT
   -------------------------------------------------------------------------- */
function initHeroTyping() {
  const target = document.querySelector('.role-typing-text');
  if (!target) return;

  const roles = [
    'AI Systems Engineer',
    'Team Lead @ Fanam Digital',
    'RAG & LLM Specialist',
    'Multi-Agent Workflow Architect',
    'Builder & Digital Creator'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      typingSpeed = 2200; // pause at peak
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 450;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   5. PROJECT FILTERING
   -------------------------------------------------------------------------- */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. INTERACTIVE PROJECT MODALS
   -------------------------------------------------------------------------- */
const PROJECT_DETAILS = {
  luna: {
    title: 'Luna — AI-Powered Enterprise ERP',
    subtitle: 'Fanam Digital · 2026',
    tags: ['FastAPI', 'PostgreSQL', 'Microsoft Graph', 'AI Agents', 'SharePoint', 'REST APIs'],
    description: `Luna is an end-to-end enterprise ERP platform combining HRMS and dynamic project management. It was engineered to centralize employee directories, sprint tracking, real-time attendance, resource utilization analytics, and performance reviews with deep Microsoft ecosystem automation.`,
    highlights: [
      'Engineered autonomous Microsoft Teams AI agent powered by Microsoft Graph API for automated attendance check-ins, sprint standup summaries, and task status pings.',
      'Designed scalable PostgreSQL schemas and high-throughput FastAPI endpoints managing multi-tier employee utilization and task dependencies.',
      'Integrated enterprise document and policy repositories directly with Microsoft SharePoint.',
      'Implemented role-based access control (RBAC) across departments and leadership teams.'
    ],
    architecture: 'FastAPI Backend ➔ PostgreSQL Data Store ➔ Microsoft Graph API ➔ Microsoft Teams Agent ➔ SharePoint Storage'
  },
  rag: {
    title: 'Persona-Driven RAG Research Assistant',
    subtitle: 'Independent AI System · Feb 2026',
    tags: ['RAG', 'LangChain', 'FAISS', 'Streamlit', 'Claude', 'Gemini', 'Groq / Llama'],
    description: `A sophisticated retrieval-augmented generation engine engineered to ingest dense academic, technical, and corporate documents, allowing users to query knowledge bases under customizable specialized personas (e.g., Executive Analyst, Technical Auditor, Academic Reviewer).`,
    highlights: [
      'Implemented high-speed semantic retrieval using FAISS vector indexing with dense embedding chunking and overlap tuning.',
      'Orchestrated multi-model flexibility: seamless hot-swapping between Claude 3.5/3.7, Google Gemini 1.5/2.0, and Groq-accelerated Llama 3 models.',
      'Engineered hallucination mitigation techniques and precise source document citation extraction.',
      'Packaged in an intuitive, responsive Streamlit dashboard with real-time token streaming and citation highlights.'
    ],
    architecture: 'Document Ingestion ➔ Recursive Chunking ➔ FAISS Vector Index ➔ LangChain Orchestration ➔ Multi-Model LLM Routing ➔ Streamlit UI'
  },
  nudge: {
    title: 'Nudge — Automated Email Reminder & Tracker',
    subtitle: 'Fanam Digital',
    tags: ['Python', 'FastAPI', 'Streamlit', 'Async Scheduling', 'Analytics'],
    description: `A production-grade automated enterprise notification system engineered to dispatch scheduled reminders strictly synchronized to Indian Standard Time (IST), featuring comprehensive delivery observability and automatic failure retry logic.`,
    highlights: [
      'Scheduled background cron tasks managing time-zone aware dispatches without drift.',
      'Comprehensive status tracking: sent, skipped, queued, and failed delivery telemetry with error diagnostics.',
      'Built interactive administrative control panel using Streamlit for instant schedule adjustments and template management.'
    ],
    architecture: 'FastAPI Cron Scheduler ➔ SMTP / API Delivery Gateway ➔ Event Logger ➔ Streamlit Analytics View'
  },
  ocr: {
    title: 'Tamil & Multilingual OCR Document Pipeline',
    subtitle: 'AI Document Processing System',
    tags: ['OCR', 'Tamil NLP', 'Document AI', 'JSON Schema', 'Python'],
    description: `A high-precision document extraction engine capable of scanning unstructured multi-page PDFs containing vernacular Tamil and English text, converting them into structured, strictly validated JSON schemas.`,
    highlights: [
      'Tailored bilingual optical character recognition pipeline optimized for regional script nuances.',
      'Automated table, key-value, and metadata normalization into standardized API payloads.',
      'Reduced manual data entry hours by over 80% for regional business documents.'
    ],
    architecture: 'PDF Preprocessing ➔ Binarization & Deskew ➔ Vernacular OCR Engine ➔ Schema Parser ➔ Structured JSON'
  },
  streak: {
    title: 'Streak Evaluation & Analytics Dashboard',
    subtitle: 'Full-Stack Analytics Platform',
    tags: ['Analytics Dashboard', 'PostgreSQL', 'FastAPI', 'Data Visualization'],
    description: `A high-performance activity analytics engine that tracks learning velocity, sprint task completions, and daily developer habits, rendering rolling metrics across daily, weekly, and monthly time horizons.`,
    highlights: [
      'Optimized SQL aggregation queries for instant streak calculations without performance degradation over large datasets.',
      'Interactive heatmap and progress trends modeled after industry-standard contribution analytics.'
    ],
    architecture: 'FastAPI REST Endpoints ➔ PostgreSQL Time-Series Queries ➔ Dynamic Interactive Visualizations'
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalBody = document.querySelector('.modal-body-content');
  const closeBtn = document.querySelector('.modal-close-btn');
  const openBtns = document.querySelectorAll('.view-project-btn');

  if (!modalBackdrop || !modalBody) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-project-key');
      const data = PROJECT_DETAILS[key];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div>
            <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-primary); font-weight:600; text-transform:uppercase;">${data.subtitle}</div>
            <h2 style="font-family:var(--font-heading); font-size:1.85rem; font-weight:800; color:var(--text-primary); margin-top:0.35rem;">${data.title}</h2>
          </div>
          
          <div style="display:flex; flex-wrap:wrap; gap:0.45rem;">
            ${data.tags.map(t => `<span class="tech-chip" style="background:var(--accent-glow-subtle); color:var(--accent-primary); border-color:var(--border-accent);">${t}</span>`).join('')}
          </div>

          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.25rem;">
            <h4 style="font-family:var(--font-heading); color:var(--text-primary); margin-bottom:0.5rem; font-size:1.05rem;">Project Overview</h4>
            <p style="color:var(--text-secondary); line-height:1.7; font-size:0.95rem;">${data.description}</p>
          </div>

          <div>
            <h4 style="font-family:var(--font-heading); color:var(--text-primary); margin-bottom:0.75rem; font-size:1.05rem;">Key Architecture & Technical Contributions</h4>
            <ul style="display:flex; flex-direction:column; gap:0.6rem;">
              ${data.highlights.map(h => `<li style="position:relative; padding-left:1.5rem; color:var(--text-secondary); font-size:0.92rem; line-height:1.6;"><span style="position:absolute; left:0; color:var(--accent-primary); font-weight:bold;">▹</span>${h}</li>`).join('')}
            </ul>
          </div>

          <div style="background:#070b12; border:1px solid var(--border-accent); border-radius:var(--radius-sm); padding:1rem; font-family:var(--font-mono); font-size:0.8rem;">
            <div style="color:var(--text-muted); margin-bottom:0.3rem;">SYSTEM ARCHITECTURE PIPELINE:</div>
            <div style="color:var(--accent-primary); font-weight:600; line-height:1.5;">${data.architecture}</div>
          </div>

          <div style="display:flex; gap:1rem; margin-top:0.5rem; flex-wrap:wrap;">
            <a href="mailto:nehasri.23cb025@gmail.com?subject=Inquiry%20about%20${encodeURIComponent(data.title)}" class="btn btn-primary btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Inquire About This Build
            </a>
            <a href="https://github.com/Nehasrisankaran" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              View GitHub Profile
            </a>
          </div>
        </div>
      `;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE TERMINAL (NEHA-CLI)
   -------------------------------------------------------------------------- */
function initTerminal() {
  const terminalLog = document.getElementById('cli-log');
  const terminalInput = document.getElementById('cli-input');
  const chips = document.querySelectorAll('.cli-chip-btn');
  if (!terminalLog || !terminalInput) return;

  const COMMANDS = {
    help: `Available commands:
  • <span style="color:var(--accent-primary)">about</span>       : Overview of Nehasri S
  • <span style="color:var(--accent-primary)">skills</span>      : Technical capabilities & stack
  • <span style="color:var(--accent-primary)">projects</span>    : Production systems & builds
  • <span style="color:var(--accent-primary)">experience</span>  : Leadership role @ Fanam Digital
  • <span style="color:var(--accent-primary)">awards</span>      : Honors & certifications (Kalam Award, Azure)
  • <span style="color:var(--accent-primary)">boutique</span>    : Okaybruh clothing brand details
  • <span style="color:var(--accent-primary)">creator</span>     : YouTube (6k+) & digital community
  • <span style="color:var(--accent-primary)">contact</span>     : Direct email & phone
  • <span style="color:var(--accent-primary)">clear</span>       : Clear the console window`,

    about: `<span style="color:var(--text-primary); font-weight:600;">Nehasri S — AI Engineer · Team Lead · Builder</span>
Based in Rasipuram, Tamil Nadu · Open to Remote across India & Relocation.
Specializes in LLM integrations, RAG platforms, autonomous AI agents, and enterprise FastAPI backends.
Fluent in: English, Tamil, Telugu, Hindi.`,

    skills: `[AI & AGENTS]    : LLM Integration, RAG, AI Agents, LangChain, FAISS, Claude, Gemini, Groq
[BACKEND & DB]   : Python, FastAPI, REST APIs, PostgreSQL, MySQL, MongoDB, Java
[ENTERPRISE]     : Microsoft Graph API, Teams Bots, SharePoint, Azure (AZ-900), Streamlit
[LEADERSHIP]     : Team Lead @ Fanam Digital, Architecture Reviews, Developer Mentorship`,

    projects: `1. <span style="color:var(--accent-primary)">Luna ERP</span>        : AI HRMS & Project Management + Teams Agent (FastAPI, Graph API)
2. <span style="color:var(--accent-primary)">Persona RAG</span>     : Multi-model Research Assistant (FAISS, LangChain, Streamlit)
3. <span style="color:var(--accent-primary)">Nudge</span>           : Scheduled IST Email Reminder Engine (FastAPI, Streamlit)
4. <span style="color:var(--accent-primary)">Tamil OCR</span>       : Vernacular Document Parsing to JSON Schemas
5. <span style="color:var(--accent-primary)">Streak Analytics</span>: Habit & Learning Metrics Engine (PostgreSQL)`,

    experience: `[Current Role] AI Engineer & Team Lead — Fanam Digital
[Timeline]     Jan 2026 – Present (Promoted to Team Lead in Aug 2026)
[Focus]        Enterprise AI systems, autonomous agents, team sprint delivery & mentoring.`,

    awards: `★ <span style="color:var(--accent-primary)">Dr. APJ Abdul Kalam Award</span> for Best Engineering Students (IEI, 2026)
★ <span style="color:var(--accent-primary)">Microsoft Certified</span>: Azure Fundamentals (AZ-900) — 90% (Jun 2025)
★ <span style="color:var(--accent-primary)">NPTEL Elite + Top 5%</span>: Blockchain & Applications, IIT Kharagpur (81%)
★ <span style="color:var(--accent-primary)">Claude Code in Action</span>: Anthropic Education (Mar 2026)`,

    boutique: `Clothing Brand: <span style="color:#fb7185; font-weight:bold;">Okaybruh Clothing</span>
Independent brand built & run by Nehasri S.
Featuring custom apparel, digital drops, and growing community.
Direct message for orders: nehasri.23cb025@gmail.com`,

    creator: `Creator Highlights:
• <span style="color:var(--accent-primary)">6,000+</span> YouTube Subscribers (lifestyle, tech, short-form)
• 2 Active Instagram profiles with high community engagement & brand collaborations
• Open to podcast guest appearances and tech panels.`,

    contact: `Email  : <a href="mailto:nehasri.23cb025@gmail.com" style="color:var(--accent-primary)">nehasri.23cb025@gmail.com</a>
Phone  : <a href="tel:+917339259347" style="color:var(--accent-primary)">+91 73392 59347</a>
LinkedIn: <a href="https://www.linkedin.com/in/nehasri-sankaran-b341aa315" target="_blank" style="color:var(--accent-primary)">linkedin.com/in/nehasri-sankaran-b341aa315</a>
GitHub : <a href="https://github.com/Nehasrisankaran" target="_blank" style="color:var(--accent-primary)">github.com/Nehasrisankaran</a>`
  };

  function executeCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      terminalLog.innerHTML = '';
      return;
    }

    const output = COMMANDS[cmd] || `command not found: "${cmd}". Type <span style="color:var(--accent-primary)">help</span> for available commands.`;

    const cmdEntry = document.createElement('div');
    cmdEntry.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.4rem;">
        <span style="color:var(--accent-primary); font-weight:bold;">nehasri@agent-os:~$</span>
        <span>${escapeHtml(raw)}</span>
      </div>
      <div style="margin-left:1.25rem; margin-top:0.35rem; color:var(--text-secondary); line-height:1.6;">${output}</div>
    `;
    terminalLog.appendChild(cmdEntry);
    terminalLog.scrollTop = terminalLog.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
      terminalInput.focus();
    });
  });

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
}

/* --------------------------------------------------------------------------
   8. CONTACT, CLIPBOARD & TOAST
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function initContactInteractions() {
  // Copy buttons
  document.querySelectorAll('.copy-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: ${text}`);
      }).catch(() => {
        showToast(`Copied: ${text}`);
      });
    });
  });

  // Contact Form Submission (direct mailto generator with instant toast)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim() || 'Portfolio Inquiry';
      const message = document.getElementById('form-message').value.trim();

      const mailtoUrl = `mailto:nehasri.23cb025@gmail.com?subject=${encodeURIComponent(`[Portfolio] ${subject} from ${name}`)}&body=${encodeURIComponent(`Hi Nehasri,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`)}`;

      window.location.href = mailtoUrl;
      showToast('Opening your email client to send message to Nehasri!');
      form.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   9. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.glass-card, .project-card, .credential-card, .service-card, .timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
