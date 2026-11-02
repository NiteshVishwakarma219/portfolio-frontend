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
    "Cloud Support Engineer",
    "Technical Support Associate",
    "Business Operations Associate",
    "MIS & Reporting Associate",
    "Linux Administrator",
    "Cloud Engineer"
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
        education: "Nitesh is pursuing a BCA specializing in Cloud Computing & Security at Amity University (2024–2027), with a current CGPA of 7.70.",
        experience: "Nitesh completed a 135-hour Cloud Computing Project internship at <strong>TCS iON</strong> (Jun–Aug 2026) on a cloud-based big data processing system, and a <strong>CodeAlpha</strong> Cloud Internship (Jul–Aug 2026) with sandboxed AWS deployments, Linux CLI and Docker. See the Experience section for details.",
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

/* =========================
BUSINESS SECTION: role tabs, procure-to-pay stepper, sample MIS view
========================= */
(function initBusiness() {
    const panel = document.getElementById("biz-panel");
    if (!panel) return;
    const W = "working", F = "foundational", L = "learning";
    const ROLES = {
        ops: {
            title: "Business Operations & MIS",
            text: "I keep data clean, track KPIs and document processes so teams can act on them. Python and SQL let me automate repeat reporting.",
            skills: [["SQL", W], ["Python automation", W], ["Documentation & SOPs", W], ["Linux", W], ["Excel (PivotTables, XLOOKUP)", F], ["Power BI", F], ["MIS reporting", F], ["RFQ, PO, GRN", F], ["Inventory tracking", F], ["B2B order processing", F], ["CRM (Zoho, HubSpot)", L], ["ERP (SAP MM/SD basics)", L]],
            file: "Nitesh_Vishwakarma_Business_Operations_Resume.pdf", label: "Business Operations resume"
        },
        support: {
            title: "Technical & Customer Support",
            text: "I diagnose problems step by step, find the root cause and write it down so the next person fixes it faster.",
            skills: [["Troubleshooting & RCA", W], ["Linux & Bash", W], ["Networking (DNS, TCP/IP)", W], ["Incident response", W], ["Technical documentation", W], ["Monitoring & alerts", W], ["Ticketing & SLA", F], ["Escalation handling", F], ["CRM (Zoho, HubSpot)", L]],
            file: "Nitesh_Vishwakarma_Technical_Support_Resume.pdf", label: "Technical Support resume"
        },
        cloud: {
            title: "Cloud & Infrastructure",
            text: "I build and test AWS environments with Terraform, secure them and prove they recover from failure.",
            skills: [["AWS (EC2, VPC, S3, RDS, IAM)", W], ["Terraform", W], ["Docker", W], ["Linux & Bash", W], ["Python & Boto3", W], ["CloudWatch & SNS", W], ["KMS & Secrets Manager", W], ["Kubernetes", L]],
            file: "Nitesh_Vishwakarma_Resume.pdf", label: "Cloud resume"
        }
    };
    const LVL = { working: "Working", foundational: "Foundational", learning: "Learning" };
    function render(key) {
        const r = ROLES[key];
        panel.innerHTML = "<h3>" + r.title + "</h3><p>" + r.text + "</p><div class='biz-chips'>" +
            r.skills.map(s => "<span class='biz-chip lvl-" + s[1] + "'>" + s[0] + " <em>" + LVL[s[1]] + "</em></span>").join("") +
            "</div><p class='biz-legend'>Working: used in projects. Foundational: studied and practised. Learning: in progress.</p>" +
            "<a class='btn' href='" + r.file + "' target='_blank' rel='noopener'><i class='fa-solid fa-file-arrow-down'></i> " + r.label + "</a>";
    }
    document.querySelectorAll(".biz-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".biz-tab").forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
            tab.classList.add("active"); tab.setAttribute("aria-selected", "true");
            render(tab.dataset.role);
        });
    });
    render("ops");

    // Procure-to-pay stepper
    const STEPS = [
        ["RFQ", "Request for quotation", "The buyer asks approved vendors for price, quantity and delivery terms."],
        ["Quotation", "Compare vendor offers", "Vendors reply. The buyer compares price, delivery time and terms in a sheet."],
        ["PO", "Purchase order", "The chosen vendor gets a purchase order. It is the formal commitment to buy."],
        ["GRN", "Goods receipt note", "The store checks the delivered goods against the PO and records what was received."],
        ["Invoice", "Three-way match", "Accounts match the invoice with the PO and the GRN before approving it."],
        ["Payment", "Vendor payment", "The matched invoice is paid on its due date and the record is closed."]
    ];
    const stepsEl = document.getElementById("p2p-steps"), detail = document.getElementById("p2p-detail");
    function showStep(i) {
        stepsEl.querySelectorAll(".p2p-step").forEach((b, j) => { b.classList.toggle("active", j === i); b.classList.toggle("done", j < i); });
        detail.innerHTML = "<strong>" + STEPS[i][0] + ": " + STEPS[i][1] + "</strong>" + STEPS[i][2];
    }
    STEPS.forEach((s, i) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "p2p-step"; b.textContent = s[0];
        b.addEventListener("click", () => showStep(i));
        stepsEl.appendChild(b);
    });
    showStep(0);

    // Sample MIS view (demo data, not real business data)
    const DATA = {
        Q1: { North: 42, South: 58, East: 31, West: 67 },
        Q2: { North: 51, South: 49, East: 38, West: 72 },
        Q3: { North: 47, South: 63, East: 44, West: 59 },
        Q4: { North: 66, South: 70, East: 52, West: 81 }
    };
    const chart = document.getElementById("mis-chart"), sel = document.getElementById("mis-quarter");
    const summary = document.getElementById("mis-summary"), query = document.getElementById("mis-query");
    function drawMis() {
        const q = sel.value, d = DATA[q], max = Math.max(...Object.values(d));
        const top = Object.keys(d).reduce((a, b) => d[a] >= d[b] ? a : b);
        const total = Object.values(d).reduce((a, b) => a + b, 0);
        chart.innerHTML = Object.keys(d).map(k => "<div class='mis-bar" + (k === top ? " top" : "") + "'><b>" + d[k] + "</b><span class='fill' style='height:0'></span></div>").join("");
        chart.insertAdjacentHTML("afterend", "");
        document.getElementById("mis-labels") && document.getElementById("mis-labels").remove();
        chart.insertAdjacentHTML("afterend", "<div class='mis-labels' id='mis-labels'>" + Object.keys(d).map(k => "<span>" + k + "</span>").join("") + "</div>");
        requestAnimationFrame(() => requestAnimationFrame(() => {
            chart.querySelectorAll(".fill").forEach((el, i) => { el.style.height = (Object.values(d)[i] / max * 80) + "%"; });
        }));
        summary.textContent = q + " total: " + total + " (sample units). Top region: " + top + ".";
        query.textContent = "SELECT region, SUM(sales) FROM orders WHERE quarter = '" + q + "' GROUP BY region;";
    }
    sel.addEventListener("change", drawMis);
    drawMis();
})();

/* =========================
3D TILT ON CARDS + CURSOR GLOW (pointer devices, respects reduced motion)
========================= */
(function initTiltAndGlow() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".skill-column, .project-card, .biz-card, .cert-card").forEach(el => {
        el.classList.add("tilt");
        el.addEventListener("mousemove", e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
            el.style.transform = "perspective(900px) rotateX(" + (-y * 6) + "deg) rotateY(" + (x * 6) + "deg) translateZ(0)";
        });
        el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
    const glow = document.getElementById("cursor-glow");
    if (glow) {
        window.addEventListener("mousemove", e => { glow.style.opacity = 1; glow.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)"; });
        document.addEventListener("mouseleave", () => { glow.style.opacity = 0; });
    }
    const orbit = document.querySelector(".orbit-container");
    if (orbit) {
        window.addEventListener("mousemove", e => {
            const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
            orbit.style.transform = "perspective(900px) rotateY(" + (x * 10) + "deg) rotateX(" + (-y * 10) + "deg)";
        });
    }
})();


/* =========================
ABOUT TABS, COUNTERS, EXPERIENCE CARDS
========================= */
(function initAboutAndExperience() {
    const PANES = {
        background: "<ul><li>Final-year <strong>BCA in Cloud Computing & Security</strong> at Amity University (2024 to 2027), CGPA 7.70.</li><li>Started with Linux and networking, then built AWS projects with Terraform and Docker.</li><li>Completed the <strong>135-hour TCS iON</strong> cloud project and the <strong>CodeAlpha</strong> cloud internship in 2026.</li></ul>",
        do: "<ul><li>Build AWS environments as code: VPC, ALB, Auto Scaling, EC2, RDS, IAM, KMS.</li><li>Write <strong>Python, Boto3 and Bash scripts</strong> to automate repeat tasks.</li><li>Set up monitoring and alerts with CloudWatch and SNS, then troubleshoot and find the root cause.</li><li>Prepare reports and follow procurement and support workflows on the business side.</li></ul>",
        work: "<ul><li>Test failures on purpose: I confirmed automatic recovery in 3 failure scenarios.</li><li>Document every fix: I wrote up the root cause of 15+ issues in my projects.</li><li>Use least privilege and encryption by default.</li><li>Write notes so another person can repeat my work.</li></ul>",
        next: "<ul><li>Roles: Cloud Support, Cloud Operations, System Engineer, Technical Support, Business Operations and MIS.</li><li>Availability: <strong>immediate joiner</strong>, based in Delhi, open to relocation or remote work.</li><li>Best way to reach me: email or LinkedIn from the Contact section.</li></ul>"
    };
    const pane = document.getElementById("about-pane");
    if (pane) {
        const show = k => { pane.innerHTML = PANES[k]; };
        document.querySelectorAll(".about-tab").forEach(t => t.addEventListener("click", () => {
            document.querySelectorAll(".about-tab").forEach(x => { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
            t.classList.add("active"); t.setAttribute("aria-selected", "true"); show(t.dataset.pane);
        }));
        show("background");
    }
    const counters = document.querySelectorAll("[data-count]");
    const run = el => {
        const end = +el.dataset.count, suf = el.dataset.suffix || "", reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) { el.textContent = end + suf; return; }
        const t0 = performance.now(), dur = 1400;
        (function step(t) {
            const p = Math.min((t - t0) / dur, 1);
            el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
            if (p < 1) requestAnimationFrame(step);
        })(t0);
    };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.4 });
    counters.forEach(c => io.observe(c));
    document.querySelectorAll(".exp-head").forEach(h => h.addEventListener("click", () => {
        const open = h.getAttribute("aria-expanded") === "true";
        h.setAttribute("aria-expanded", String(!open));
        document.getElementById(h.getAttribute("aria-controls")).hidden = open;
    }));
})();


/* =========================
HERO 3D SCENE (Three.js): cloud-network solid with orbiting nodes
========================= */
(function initHero3D() {
    const canvas = document.getElementById("hero-3d");
    if (!canvas || typeof THREE === "undefined") return;
    const home = document.getElementById("home");
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9;

    const group = new THREE.Group();
    scene.add(group);
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.4, 1), new THREE.MeshBasicMaterial({ color: 0x2fd9c4, wireframe: true, transparent: true, opacity: 0.22 }));
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.1, 0.28, 120, 16), new THREE.MeshBasicMaterial({ color: 0x9b8cff, wireframe: true, transparent: true, opacity: 0.25 }));
    group.add(shell, knot);

    const orbit = new THREE.Group();
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xf2a65a });
    for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const n = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), nodeMat);
        n.position.set(Math.cos(a) * 3.0, Math.sin(a * 2) * 0.5, Math.sin(a) * 3.0);
        orbit.add(n);
    }
    group.add(orbit);

    let mx = 0, my = 0, scrollY = 0, visible = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function resize() {
        const w = home.clientWidth, h = home.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        const wide = w > 900;
        group.position.x = wide ? 2.7 : 0;
        group.position.y = wide ? 0 : -1.5;
        group.scale.setScalar(wide ? 0.78 : 0.6);
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", e => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; });
    window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(home);

    const clock = new THREE.Clock();
    function frame() {
        requestAnimationFrame(frame);
        if (!visible) return;
        const t = clock.getElapsedTime();
        shell.rotation.y = t * 0.15 + mx * 1.2;
        shell.rotation.x = t * 0.08 + my * 1.2;
        knot.rotation.y = -t * 0.3;
        knot.rotation.x = t * 0.2;
        orbit.rotation.y = t * 0.4;
        group.position.z = -scrollY * 0.004;
        renderer.render(scene, camera);
    }
    if (reduce) { renderer.render(scene, camera); } else { frame(); }
})();
