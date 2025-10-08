// ============================
// Portfolio + EmailJS + Firebase JS
// ============================

// ===== Projects Array =====
const projects = [
  {
    name: "Personal Portfolio Website",
    description: "A responsive web portfolio with animations and contact form.",
    image: "Picture/Generated Image September 05, 2025 - 6_15PM (1) (1).jpeg",
    link: "#",
    category: "Web"
  },
  {
    name: "AI Chatbot Assistant",
    description: "An AI-powered chatbot built with NLP and Python.",
    image: "https://via.placeholder.com/400x250?text=AI+Chatbot",
    link: "#",
    category: "AI"
  },
  {
    name: "Python Data Dashboard",
    description: "Interactive analytics dashboard using Python and Power BI.",
    image: "Picture/Screenshot 2025-05-27 195300.png",
    link: "Picture/Screenshot 2025-05-27 195300.png",
    category: "Python"
  },
  {
    name: "E-commerce Web App",
    description: "Modern shopping site built with HTML, CSS, JS.",
    image: "https://via.placeholder.com/400x250?text=E-commerce+App",
    link: "#",
    category: "Web"
  }
];

// ===== DOM Elements =====
const portfolioContainer = document.getElementById("project-container") || document.querySelector(".project-container");
const filterButtons = document.querySelectorAll(".filter-btn");
const contactForm = document.getElementById("contactForm");
const firebaseForm = document.getElementById("messageForm");
const status = document.getElementById("status");

// ===== Initialize EmailJS =====
if (typeof emailjs !== "undefined") {
  emailjs.init("3kj4At1wxfNEL5x2z"); // Replace with your public key
} else {
  console.error("⚠️ EmailJS SDK not loaded!");
}

// ===== Render Portfolio Projects =====
function renderProjects(filter = "all") {
  if (!portfolioContainer) return;
  portfolioContainer.innerHTML = "";
  const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);

  filtered.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card fade-in";
    card.innerHTML = `
      <img data-src="${project.image}" alt="${project.name}" class="lazy" loading="lazy">
      <div class="content">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank">View Project →</a>
      </div>
    `;
    portfolioContainer.appendChild(card);
  });

  initLazyLoad();
}

// ===== Lazy Load Images =====
function initLazyLoad() {
  const lazyImgs = document.querySelectorAll("img.lazy");
  if ("IntersectionObserver" in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    }, { rootMargin: "0px 0px 100px 0px" });
    lazyImgs.forEach(img => imgObserver.observe(img));
  } else {
    lazyImgs.forEach(img => { if (img.dataset.src) img.src = img.dataset.src; });
  }
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== Fade-in Animation on Scroll =====
const fadeObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".fade-in, .section, .skill-bar").forEach(el => {
  if (el) fadeObserver.observe(el);
});

// ===== Contact Form EmailJS =====
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    emailjs.sendForm('service_golam@740', '__ejs-test-mail-service__', contactForm)
      .then(() => {
        alert("✅ Message sent successfully!");
        contactForm.reset();
      })
      .catch(err => {
        console.error(err);
        alert("❌ Failed to send message. Check console.");
      });
  });
}

// ===== Firebase Initialization (ES6 Imports for Module) =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMUIzGWCgNcTGZ5ze5AsGb65uMOjnPMz4",
  authDomain: "n8ncread.firebaseapp.com",
  projectId: "n8ncread",
  storageBucket: "n8ncread.appspot.com",
  messagingSenderId: "25158596041",
  appId: "1:25158596041:web:95d991e89a91a82853a418",
  measurementId: "G-DH6CQRSGLL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== Firebase Form Submission =====
if (firebaseForm) {
  firebaseForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = firebaseForm.name.value;
    const email = firebaseForm.email.value;
    const subject = firebaseForm.subject.value;
    const message = firebaseForm.message.value;

    try {
      await addDoc(collection(db, "messages"), {
        name, email, subject, message, timestamp: new Date()
      });
      if (status) {
        status.textContent = "✅ Message sent successfully!";
        status.style.color = "green";
      }
      firebaseForm.reset();
    } catch (err) {
      console.error(err);
      if (status) {
        status.textContent = "❌ Failed to send message!";
        status.style.color = "red";
      }
    }
  });
}

// ===== Initialize Page =====
document.addEventListener("DOMContentLoaded", () => {
  renderProjects("all");
  initLazyLoad();
});