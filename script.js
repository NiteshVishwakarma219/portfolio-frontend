/* =========================
FILE: script.js
========================= */

const API_BASE_URL = "https://portfolio-backend-zlld.onrender.com";

/* =========================
GLOBAL TELEMETRY 3D GLOBE
========================= */
const globeContainer = document.getElementById("globe-container");

if (globeContainer && typeof THREE !== "undefined") {
    const globeScene = new THREE.Scene();

    const globeCamera = new THREE.PerspectiveCamera(
        60,
        globeContainer.clientWidth / globeContainer.clientHeight,
        0.1,
        1000
    );

    const globeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    globeRenderer.setSize(globeContainer.clientWidth || 500, 400);
    globeContainer.appendChild(globeRenderer.domElement);

    // Wireframe globe representing the controller server network
    const globeGeometry = new THREE.SphereGeometry(2, 32, 32);
    const globeMaterial = new THREE.MeshBasicMaterial({
        color: 0x2fd9c4,
        wireframe: true,
        transparent: true,
        opacity: 0.32
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeScene.add(globeMesh);

    // Glowing data-point nodes on the globe (AWS regions / traffic origins)
    const nodeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const nodeColors = [0x2fd9c4, 0xf2a65a, 0x9b8cff];

    for (let i = 0; i < 18; i++) {
        const nodeMaterial = new THREE.MeshBasicMaterial({
            color: nodeColors[i % nodeColors.length]
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        const phi = Math.acos(-1 + (2 * Math.random()));
        const theta = Math.sqrt(Math.PI * 2) * Math.random();

        node.position.setFromSphericalCoords(2, phi, theta);
        globeScene.add(node);
    }

    globeCamera.position.z = 5;

    function animateGlobe() {
        requestAnimationFrame(animateGlobe);
        globeMesh.rotation.y += 0.003;
        globeMesh.rotation.x += 0.0005;
        globeRenderer.render(globeScene, globeCamera);
    }

    animateGlobe();

    window.addEventListener("resize", () => {
        if (!globeContainer.clientWidth) return;
        globeCamera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
        globeCamera.updateProjectionMatrix();
        globeRenderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight || 400);
    });
}

/* =========================
LIVE REQUEST COUNTER (visual flavor)
========================= */
const liveRequestsEl = document.getElementById("live-requests");
if (liveRequestsEl) {
    setInterval(() => {
        const base = 1400 + Math.floor(Math.random() * 200);
        liveRequestsEl.textContent = `${base.toLocaleString()} req/sec`;
    }, 2200);
}

/* =========================
HEADER SCROLL EFFECT
========================= */
const siteHeader = document.querySelector("header");
if (siteHeader) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            siteHeader.style.background = "rgba(7,11,18,0.96)";
            siteHeader.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
        } else {
            siteHeader.style.background = "rgba(7,11,18,0.85)";
            siteHeader.style.boxShadow = "none";
        }
    });
}

/* =========================
MOBILE MENU TOGGLE
========================= */
const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon && navbar) {
    menuIcon.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });

    navbar.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navbar.classList.remove("active");
        });
    });
}

/* =========================
TYPING EFFECT
========================= */
const typingTexts = [
    "Cloud Engineer",
    "Cloud Security Engineer",
    "DevOps Engineer",
    "Linux Administrator",
    "SRE"
];

let textIndex = 0;
let charIndex = 0;

function typeEffect() {
    const heroTitle = document.getElementById("typewriter");
    if (!heroTitle) return;

    if (charIndex < typingTexts[textIndex].length) {
        heroTitle.innerHTML = typingTexts[textIndex].substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeEffect, 100);
    } else {
        setTimeout(eraseEffect, 1500);
    }
}

function eraseEffect() {
    const heroTitle = document.getElementById("typewriter");
    if (!heroTitle) return;

    if (charIndex > 0) {
        heroTitle.innerHTML = typingTexts[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseEffect, 50);
    } else {
        textIndex++;
        if (textIndex >= typingTexts.length) {
            textIndex = 0;
        }
        setTimeout(typeEffect, 300);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const heroTitle = document.getElementById("typewriter");
    if (typingTexts.length && heroTitle) {
        setTimeout(typeEffect, 1000);
    }
});

/* =========================
SCROLL REVEAL (fixed: now targets the real .reveal elements)
========================= */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
});

/* =========================
SKILL BAR FILL-ON-SCROLL
========================= */
const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("filled");
            skillBarObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll(".progress-line").forEach((bar) => {
    skillBarObserver.observe(bar);
});

/* =========================
PROJECT CARD HOVER GLOW (recolored to match card's category accent)
========================= */
const cards = document.querySelectorAll(".project-card");
cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const accent = getComputedStyle(card).getPropertyValue("--accent-c").trim() || "#2FD9C4";
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, ${accent}22, #131C2B 45%)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.background = "";
    });
});

/* =========================
BUTTON RIPPLE EFFECT
========================= */
const buttons = document.querySelectorAll(".btn");

buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        this.appendChild(ripple);

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => ripple.remove(), 600);
    });
});

/* =========================
AUTO YEAR FOOTER
========================= */
const footerText = document.querySelector(".footer-text p");
const year = new Date().getFullYear();

if (footerText) {
    footerText.innerHTML = `Copyright &copy; ${year} Nitesh Vishwakarma | All Rights Reserved.`;
}

/* =========================
CONTACT FORM -> BACKEND -> MONGODB
========================= */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");

        if (!nameInput || !emailInput || !messageInput) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (formStatus) {
            formStatus.textContent = "Sending...";
            formStatus.style.color = "var(--muted)";
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await res.json();

            if (res.ok) {
                if (formStatus) {
                    formStatus.textContent = "Message sent! I'll get back to you soon.";
                    formStatus.style.color = "#22c55e";
                }
                contactForm.reset();
            } else {
                if (formStatus) {
                    formStatus.textContent = data.error || "Something went wrong.";
                    formStatus.style.color = "#F2555A";
                }
            }
        } catch (err) {
            if (formStatus) {
                formStatus.textContent = "Network error — please try again in a moment.";
                formStatus.style.color = "#F2555A";
            }
        }
    });
}

/* =========================
SECURE ACCESS INTRO LOADER
========================= */
(function initIntroLoader() {
    const loader = document.getElementById("intro-loader");
    if (!loader) return;

    document.body.classList.add("locked");

    const TOTAL_DURATION_MS = 4700; // matches the CSS animation length + small buffer

    setTimeout(() => {
        document.body.classList.remove("locked");
        loader.remove();
    }, TOTAL_DURATION_MS);
})();

/* =========================
ANIMATED NETWORK BACKGROUND
========================= */
(function initNetworkBackground() {
    const container = document.getElementById("canvas-container");
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.id = "bg-network-canvas";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let width, height, particles;
    const COLORS = ["47,217,196", "155,140,255", "242,166,90"];
    const PARTICLE_COUNT_BASE = 70;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticles() {
        const count = Math.min(PARTICLE_COUNT_BASE, Math.floor((width * height) / 18000));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.8 + 0.8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
        }));
    }

    function step() {
        ctx.clearRect(0, 0, width, height);

        // move + draw particles
        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, 0.75)`;
            ctx.fill();
        });

        // connect nearby particles with faint lines
        const maxDist = 140;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(47, 217, 196, ${0.14 * (1 - dist / maxDist)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(step);
    }

    resize();
    createParticles();
    step();

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            createParticles();
        }, 200);
    });
})();

/* =========================
PORTFOLIO ASSISTANT CHATBOT
(Scripted keyword-matching assistant — fast and free, not a
generative-AI backend. Swap the `respond()` function for a real
fetch() call to an LLM API later if you want true generative answers.)
========================= */
(function initChatbot() {
    const widget = document.getElementById("chatbot-widget");
    const toggle = document.getElementById("chatbot-toggle");
    const messagesEl = document.getElementById("chatbot-messages");
    const form = document.getElementById("chatbot-input-form");
    const input = document.getElementById("chatbot-input");
    const quickReplies = document.getElementById("chatbot-quick-replies");

    if (!widget || !toggle || !messagesEl || !form || !input) return;

    const KNOWLEDGE = {
        greeting: "Hi! I'm Nitesh's portfolio assistant. Ask me about his skills, projects, experience, or how to get in touch — or tap a quick option below.",
        skills: "Nitesh works across four areas: <strong>AWS Cloud</strong> (VPC, EC2, RDS, IAM, CloudWatch), <strong>Cloud Security</strong> (IAM hardening, security groups, monitoring), <strong>DevOps</strong> (Docker, Kubernetes, Terraform, Jenkins), and <strong>Linux & Programming</strong> (Bash, Python, Git). Check the Tech Stack section for the full breakdown.",
        projects: "A few highlights: <strong>Enterprise AWS Cloud Infrastructure with Terraform</strong>, <strong>Enterprise AWS Cloud Security Platform</strong>, and <strong>Enterprise Linux Administration & Security</strong> — plus AI-assisted cloud tooling like CloudOps Guardian and an AWS Bedrock assistant. Scroll to the Projects section, or see <a href='https://github.com/NiteshVishwakarma219' target='_blank'>his GitHub</a> for everything.",
        contact: "You can reach Nitesh directly at <a href='mailto:niteshvishwakarma8574@gmail.com'>niteshvishwakarma8574@gmail.com</a>, or connect on <a href='https://linkedin.com/in/nitesh1vishwakarma' target='_blank'>LinkedIn</a>. There's also a contact form right on this page.",
        resume: "You can download his resume directly here: <a href='/Nitesh_Vishwakarma_Resume_Cloud_DevOps.pdf' target='_blank'>Nitesh_Vishwakarma_Resume_Cloud_DevOps.pdf</a>.",
        education: "Nitesh is pursuing a BCA specializing in Cloud Computing & Security at Amity University Online (2024–2027), currently holding an 8.45 SGPA.",
        experience: "Nitesh's hands-on work centers on production-style AWS infrastructure built with Terraform, cloud security hardening, and Linux systems administration — all documented publicly on his GitHub as enterprise-style reference projects.",
        hire: "He's actively open to Cloud Engineer, Cloud Security, SOC Analyst, and Linux Administrator roles. The best way to follow up is email or LinkedIn — both are in the Contact section.",
        fallback: "I don't have a scripted answer for that one — but Nitesh definitely will! Try asking about his <strong>skills</strong>, <strong>projects</strong>, <strong>education</strong>, or <strong>contact</strong> info, or reach out to him directly."
    };

    const KEYWORD_MAP = [
        [["skill", "tech stack", "technolog", "aws", "linux", "terraform", "docker"], "skills"],
        [["project", "repo", "github", "work sample", "portfolio piece"], "projects"],
        [["contact", "email", "reach", "linkedin", "phone", "connect"], "contact"],
        [["resume", "cv"], "resume"],
        [["education", "degree", "college", "university", "study", "bca"], "education"],
        [["experience", "background", "history"], "experience"],
        [["hire", "job", "opportunity", "available", "open to work", "recruit"], "hire"],
        [["hi", "hello", "hey"], "greeting"]
    ];

    function matchIntent(text) {
        const t = text.toLowerCase();
        for (const [keywords, intent] of KEYWORD_MAP) {
            if (keywords.some((k) => t.includes(k))) return intent;
        }
        return "fallback";
    }

    function addMessage(html, sender) {
        const el = document.createElement("div");
        el.className = `chat-msg ${sender}`;
        el.innerHTML = html;
        messagesEl.appendChild(el);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        const el = document.createElement("div");
        el.className = "typing-indicator";
        el.id = "typing-indicator";
        el.innerHTML = "<span></span><span></span><span></span>";
        messagesEl.appendChild(el);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
        const el = document.getElementById("typing-indicator");
        if (el) el.remove();
    }

    function respond(userText) {
        showTyping();
        const delay = 500 + Math.random() * 500;
        setTimeout(() => {
            hideTyping();
            const intent = matchIntent(userText);
            addMessage(KNOWLEDGE[intent], "bot");
        }, delay);
    }

    let greeted = false;
    toggle.addEventListener("click", () => {
        widget.classList.toggle("open");
        if (widget.classList.contains("open") && !greeted) {
            greeted = true;
            setTimeout(() => addMessage(KNOWLEDGE.greeting, "bot"), 300);
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        addMessage(text, "user");
        input.value = "";
        respond(text);
    });

    if (quickReplies) {
        quickReplies.querySelectorAll("button").forEach((btn) => {
            btn.addEventListener("click", () => {
                const intent = btn.dataset.q;
                addMessage(btn.textContent, "user");
                showTyping();
                setTimeout(() => {
                    hideTyping();
                    addMessage(KNOWLEDGE[intent] || KNOWLEDGE.fallback, "bot");
                }, 400);
            });
        });
    }
})();

/* =========================
CERTIFICATES PAGE — click-to-enlarge lightbox
(Only activates on pages that actually contain these elements,
i.e. certificates.html — harmless no-op everywhere else.)
========================= */
(function initCertLightbox() {
    const lightbox = document.getElementById("cert-lightbox");
    const lightboxImg = document.getElementById("cert-lightbox-img");
    const lightboxCaption = document.getElementById("cert-lightbox-caption");
    const closeBtn = document.getElementById("cert-lightbox-close");
    const gridItems = document.querySelectorAll(".cert-grid-item");

    if (!lightbox || !lightboxImg || !gridItems.length) return;

    function openLightbox(src, name) {
        lightboxImg.src = src;
        lightboxImg.alt = name;
        if (lightboxCaption) lightboxCaption.textContent = name;
        lightbox.classList.add("open");
        document.body.classList.add("locked");
    }

    function closeLightbox() {
        lightbox.classList.remove("open");
        document.body.classList.remove("locked");
    }

    gridItems.forEach((item) => {
        item.addEventListener("click", () => {
            const src = item.dataset.img;
            const name = item.dataset.name || "Document";
            openLightbox(src, name);
        });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

    // click outside the image (on the dark backdrop) also closes it
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
})();