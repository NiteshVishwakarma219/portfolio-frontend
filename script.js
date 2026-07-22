/* =========================
FILE: script.js
========================= */

const API_BASE_URL = "https://portfolio-backend-zlld.onrender.com";

/* =========================
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

    // Create wireframe globe representing Controller Server network
    const globeGeometry = new THREE.SphereGeometry(2, 32, 32);
    const globeMaterial = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeScene.add(globeMesh);

    // Add glowing data point nodes on the globe (representing AWS regions / traffic origins)
    const nodeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    
    for (let i = 0; i < 15; i++) {
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
        globeRenderer.render(globeScene, globeCamera);
    }

    animateGlobe();
}

/* =========================
HEADER SCROLL EFFECT
========================= */
window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (!header) return;

    if (window.scrollY > 50) {
        header.style.background = "rgba(2,5,15,0.95)";
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
    } else {
        header.style.background = "rgba(5,8,22,0.7)";
        header.style.boxShadow = "none";
    }
});

/* =========================
TYPING EFFECT
========================= */
const typingTexts = [
    "Cloud Engineer",
    "DevOps Engineer",
    "Linux Administrator",
    "SRE",
    "System Engineer"
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
SCROLL ANIMATION
========================= */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.2
});

const hiddenElements = document.querySelectorAll(
    ".project-card, .skill-box, .about-card, .timeline-box"
);

hiddenElements.forEach((el) => {
    el.classList.add("hidden");
    observer.observe(el);
});

/* =========================
ADD ANIMATION CLASSES
========================= */
const style = document.createElement("style");
style.innerHTML = `
.hidden{
    opacity:0;
    transform:translateY(40px);
    transition:all 1s ease;
}
.show{
    opacity:1;
    transform:translateY(0);
}
`;
document.head.appendChild(style);

/* =========================
PARALLAX EFFECT
========================= */
document.addEventListener("mousemove", (e) => {
    const circles = document.querySelectorAll(".circle");
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 10;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        circle.style.transform = `translate(${x}px, ${y}px)`;
    });
});

/* =========================
PROJECT HOVER GLOW
========================= */
const cards = document.querySelectorAll(".project-card");
cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `
            radial-gradient(
            circle at ${x}px ${y}px,
            rgba(0,212,255,0.15),
            #0f172a 40%
            )
        `;
    });

    card.addEventListener("mouseleave", () => {
        card.style.background = "#0f172a";
    });
});

/* =========================
BUTTON RIPPLE EFFECT
========================= */
const buttons = document.querySelectorAll(
    ".primary-btn, .secondary-btn, .resume-btn"
);

buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        let ripple = document.createElement("span");
        ripple.classList.add("ripple");
        this.appendChild(ripple);

        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

const rippleStyle = document.createElement("style");
rippleStyle.innerHTML = `
.primary-btn,
.secondary-btn,
.resume-btn{
    position:relative;
    overflow:hidden;
}
.ripple{
    position:absolute;
    width:20px;
    height:20px;
    background:rgba(255,255,255,0.5);
    border-radius:50%;
    transform:scale(0);
    animation:rippleAnim 0.6s linear;
}
@keyframes rippleAnim{
    to{
        transform:scale(15);
        opacity:0;
    }
}
`;
document.head.appendChild(rippleStyle);

/* =========================
AUTO YEAR FOOTER
========================= */
const footerBottom = document.querySelector(".footer-bottom");
const year = new Date().getFullYear();

if (footerBottom) {
    footerBottom.innerHTML = `© ${year} Nitesh Vishwakarma | Cloud • DevOps • Security`;
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
            formStatus.style.color = "var(--light-text)";
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
                    formStatus.style.color = "#ef4444";
                }
            }
        } catch (err) {
            if (formStatus) {
                formStatus.textContent = "Network error — please try again in a moment.";
                formStatus.style.color = "#ef4444";
            }
        }
    });
}