/* =========================
FILE: script.js
========================= */

/* =========================
CHANGE ME AFTER YOU DEPLOY THE BACKEND
========================= */

const API_BASE_URL = "https://portfolio-backend-zlld.onrender.com/";

/* =========================
OPTIONAL 3D BACKGROUND (guarded)
========================= */
// This block only runs if you actually add a
// <div id="three-container"></div> to index.html and include three.js.
// Previously this threw an error on load because the element didn't
// exist, which silently stopped every script below it from running.

const container = document.getElementById("three-container");

if (container && typeof THREE !== "undefined") {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(400, 400);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(0.3, 16, 16);

    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
        new THREE.MeshBasicMaterial({ color: 0x7c3aed }),
        new THREE.MeshBasicMaterial({ color: 0x22c55e })
    ];

    const spheres = [];

    for (let i = 0; i < 20; i++) {

        const mesh = new THREE.Mesh(
            geometry,
            materials[Math.floor(Math.random() * materials.length)]
        );

        mesh.position.x = (Math.random() - 0.5) * 10;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;

        scene.add(mesh);
        spheres.push(mesh);
    }

    camera.position.z = 8;

    function animate() {

        requestAnimationFrame(animate);

        spheres.forEach((s, i) => {
            s.rotation.x += 0.01;
            s.rotation.y += 0.01;

            s.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
        });

        renderer.render(scene, camera);
    }

    animate();
}

/* =========================
HEADER SCROLL EFFECT
========================= */

window.addEventListener("scroll", () => {

    const header = document.querySelector(".header");

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
    "DevOps Enthusiast",
    "SOC Analyst",
    "Linux Administrator",
    "Cloud Security Learner"
];

let textIndex = 0;
let charIndex = 0;

const heroTitle = document.querySelector(".hero-left h2");

function typeEffect() {

    if (charIndex < typingTexts[textIndex].length) {

        heroTitle.innerHTML =
            typingTexts[textIndex].substring(0, charIndex + 1);

        charIndex++;

        setTimeout(typeEffect, 100);

    } else {

        setTimeout(eraseEffect, 1500);
    }
}

function eraseEffect() {

    if (charIndex > 0) {

        heroTitle.innerHTML =
            typingTexts[textIndex].substring(0, charIndex - 1);

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

        circle.style.transform =
            `translate(${x}px, ${y}px)`;
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

        card.style.background =
            `
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

footerBottom.innerHTML =
    `© ${year} Nitesh Vishwakarma | Cloud • DevOps • Security`;

/* =========================
CONTACT FORM -> BACKEND -> MONGODB
========================= */

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {

    contactForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        formStatus.textContent = "Sending...";
        formStatus.style.color = "var(--light-text)";

        try {

            const res = await fetch(`${API_BASE_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await res.json();

            if (res.ok) {
                formStatus.textContent = "Message sent! I'll get back to you soon.";
                formStatus.style.color = "#22c55e";
                contactForm.reset();
            } else {
                formStatus.textContent = data.error || "Something went wrong.";
                formStatus.style.color = "#ef4444";
            }

        } catch (err) {
            formStatus.textContent = "Network error — please try again in a moment.";
            formStatus.style.color = "#ef4444";
        }
    });
}