// Initialize Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Navbar Loader and Mobile Menu Logic
async function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    try {
        const response = await fetch('navbar.html');
        if (!response.ok) throw new Error('Navbar not found');
        const html = await response.text();
        placeholder.innerHTML = html;

        // Re-initialize Lucide custom icons specifically for the navbar
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            // Also re-init specifically for banner icons if any
        }

        // Initialize Banner Countdown (since banner is now in navbar)
        startCountdown();

        // Attach Mobile Menu Events AFTER loading the navbar
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
        }

        // Initialize Navbar Scroll Effect (Shadow + Hide/Show)
        const navbarElement = document.getElementById('navbar');
        if (navbarElement) {
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Shadow effect logic
                if (scrollTop > 50) {
                    navbarElement.classList.add('shadow-lg');
                } else {
                    navbarElement.classList.remove('shadow-lg');
                }

                // Hide/Show logic
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling Down & past 100px
                    navbarElement.classList.add('hidden-nav');
                } else {
                    // Scrolling Up
                    navbarElement.classList.remove('hidden-nav');
                }

                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            });

            // Initial check in case page is reloaded scrolled down
            if (window.pageYOffset > 50) {
                navbarElement.classList.add('shadow-lg');
            }
        }

    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

// Call loadNavbar when DOM is ready
document.addEventListener('DOMContentLoaded', loadNavbar);

// Close Mobile Menu when clicking outside (Global listener, works even after dynamic load if we target IDs correctly)
document.addEventListener('click', function (event) {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBtn = document.querySelector('.mobile-menu-btn');

    // Safety check if elements exist
    if (!mobileMenu || !mobileBtn) return;

    const isClickInsideMenu = mobileMenu.contains(event.target);
    const isClickOnButton = mobileBtn.contains(event.target);

    // Also check if we are clicking on the toggle icon inside the button
    const isClickOnIcon = mobileBtn.contains(event.target) || event.target.closest('.mobile-menu-btn');

    if (mobileMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnButton && !isClickOnIcon) {
        mobileMenu.classList.remove('active');
    }
});

// Hero Image Hover Effect
const heroImage = document.querySelector('.image-container img');
if (heroImage) {
    heroImage.addEventListener('mouseover', function () {
        this.style.opacity = '1';
        this.style.transform = 'scale(1.05)';
    });
    heroImage.addEventListener('mouseout', function () {
        this.style.opacity = '0.8';
        this.style.transform = 'scale(1)';
    });
}

// Custom 3D Carousel Logic
const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");
const leftArrow = document.querySelector(".nav-arrow.left");
const rightArrow = document.querySelector(".nav-arrow.right");
let currentIndex = 0;
let isAnimating = false;

function updateCarousel(newIndex) {
    if (cards.length === 0) return; // Guard clause if carousel doesn't exist
    if (isAnimating) return;
    isAnimating = true;

    currentIndex = (newIndex + cards.length) % cards.length;

    cards.forEach((card, i) => {
        const offset = (i - currentIndex + cards.length) % cards.length;

        card.classList.remove(
            "center",
            "left-1",
            "left-2",
            "right-1",
            "right-2",
            "hidden"
        );

        if (offset === 0) {
            card.classList.add("center");
        } else if (offset === 1) {
            card.classList.add("right-1");
        } else if (offset === 2) {
            card.classList.add("right-2");
        } else if (offset === cards.length - 1) {
            card.classList.add("left-1");
        } else if (offset === cards.length - 2) {
            card.classList.add("left-2");
        } else {
            card.classList.add("hidden");
        }
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
    });

    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

if (leftArrow && rightArrow) {
    leftArrow.addEventListener("click", () => {
        updateCarousel(currentIndex - 1);
    });

    rightArrow.addEventListener("click", () => {
        updateCarousel(currentIndex + 1);
    });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            updateCarousel(i);
        });
    });

    cards.forEach((card, i) => {
        card.addEventListener("click", () => {
            updateCarousel(i);
        });
    });

    // Initial call
    updateCarousel(0);
}

let countdownInterval; // Store interval ID globally to allow restarts

// 22-Hour Countdown Timer with localStorage (Multi-instance support)
function startCountdown() {
    // Clear any existing interval to prevent duplicates
    if (countdownInterval) clearInterval(countdownInterval);

    // Select all sets of timer elements (supports multiple countdowns on page)
    // We re-query the DOM here to ensure we catch any dynamic elements (like the banner)
    const hoursElements = document.querySelectorAll('.timer-hours');
    const minutesElements = document.querySelectorAll('.timer-minutes');
    const secondsElements = document.querySelectorAll('.timer-seconds');

    if (hoursElements.length === 0) return;

    const RESET_INTERVAL_MS = 22 * 60 * 60 * 1000; // 22 hours in milliseconds
    const STORAGE_KEY = 'carlos_offer_timer';

    let endTime = localStorage.getItem(STORAGE_KEY);

    // If no stored time or time has passed, set new time
    if (!endTime || new Date().getTime() > parseInt(endTime)) {
        endTime = new Date().getTime() + RESET_INTERVAL_MS;
        localStorage.setItem(STORAGE_KEY, endTime);
    } else {
        endTime = parseInt(endTime);
    }

    function updateTimer() {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            // Timer expired, reset immediately
            endTime = new Date().getTime() + RESET_INTERVAL_MS;
            localStorage.setItem(STORAGE_KEY, endTime);
            updateTimer(); // Recursive call to simple restart
            return;
        }

        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        const hStr = h < 10 ? '0' + h : h;
        const mStr = m < 10 ? '0' + m : m;
        const sStr = s < 10 ? '0' + s : s;

        // Update ALL instances
        hoursElements.forEach(el => el.innerText = hStr);
        minutesElements.forEach(el => el.innerText = mStr);
        secondsElements.forEach(el => el.innerText = sStr);
    }

    countdownInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial run
}

// Start timer when DOM is ready (also called by loadNavbar)
document.addEventListener('DOMContentLoaded', startCountdown);

// Swiper Init (Testimonials)
if (typeof Swiper !== 'undefined' && document.querySelector('.mySwiper')) {
    const swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
}

// Portfolio Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => {
            b.classList.remove('active');
        });

        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hidden');
                // Small animation reset
                item.style.opacity = '0';
                setTimeout(() => item.style.opacity = '1', 50);
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
// Trigger once on load
revealOnScroll();

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
if (navbar) {
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Shadow effect logic
        if (scrollTop > 50) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }

        // Hide/Show logic
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling Down & past 100px
            navbar.classList.add('hidden-nav');
        } else {
            // Scrolling Up
            navbar.classList.remove('hidden-nav');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });
}

// --- TOOLS PAGE LOGIC ---

// Tab Switching
const toolBtns = document.querySelectorAll('.tool-btn');
const toolPanels = document.querySelectorAll('.tool-panel');

if (toolBtns.length > 0) {
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            toolBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            // Hide all panels
            toolPanels.forEach(p => p.classList.remove('active'));

            // Show target panel
            const toolId = btn.getAttribute('data-tool');
            const targetPanel = document.getElementById(`tool-${toolId}`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
}

// Copy to Clipboard Helper
function copyToClipboard(elementId, isText = false) {
    let text;
    if (isText) {
        text = document.getElementById(elementId).innerText;
    } else {
        text = document.getElementById(elementId).value;
    }

    navigator.clipboard.writeText(text).then(() => {
        // Could add a toast notification here
        alert('Copiado al portapapeles');
    });
}

// WhatsApp Generator
function generateWalink() {
    const number = document.getElementById('wa-number').value.replace(/\D/g, '');
    const message = encodeURIComponent(document.getElementById('wa-message').value);

    if (!number) {
        alert('Por favor ingresa un número de teléfono');
        return;
    }

    const link = `https://wa.me/${number}?text=${message}`;

    document.getElementById('wa-output').value = link;
    document.getElementById('wa-preview').href = link;
    document.getElementById('wa-result').classList.remove('hidden');
}

// Clamp Generator
function calculateClamp() {
    const minW = parseFloat(document.getElementById('clamp-min-w').value);
    const maxW = parseFloat(document.getElementById('clamp-max-w').value);
    const minF = parseFloat(document.getElementById('clamp-min-f').value);
    const maxF = parseFloat(document.getElementById('clamp-max-f').value);

    if (!minW || !maxW || !minF || !maxF) {
        alert('Po favor completa todos los campos');
        return;
    }

    // Conver pixels to rem (assuming 1rem = 16px)
    const minFRem = minF / 16;
    const maxFRem = maxF / 16;

    // Formula: y = mx + c
    // slope (m) = (maxF - minF) / (maxW - minW)
    const slope = (maxF - minF) / (maxW - minW);
    const yAxisIntersection = -minW * slope + minF;

    // Convert intersection to rem
    const intersectionRem = yAxisIntersection / 16;

    // Convert slope to VW (slope * 100)
    const slopeVw = slope * 100;

    // Construct clamp string: clamp(MINrem, INTrem + SLOPEvw, MAXrem)
    const clampString = `clamp(${minFRem.toFixed(4)}rem, ${intersectionRem.toFixed(4)}rem + ${slopeVw.toFixed(4)}vw, ${maxFRem.toFixed(4)}rem)`;

    const preview = document.getElementById('clamp-preview-text');
    preview.style.fontSize = clampString;

    // Google Fonts Loading Logic
    const fontName = document.getElementById('clamp-font-family').value.trim();
    const fontWeight = document.getElementById('clamp-font-weight').value;

    if (fontName) {
        loadGoogleFont(fontName);
        preview.style.fontFamily = `'${fontName}', sans-serif`;
    } else {
        preview.style.fontFamily = 'sans-serif';
    }

    preview.style.fontWeight = fontWeight;

    document.getElementById('clamp-output-code').innerText = clampString;
    document.getElementById('clamp-result').classList.remove('hidden');
}

// Helper to load Google Font
function loadGoogleFont(fontName) {
    if (!fontName) return;

    const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
    if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@100..900&display=swap`;
        document.head.appendChild(link);
    }
}

// Add listeners for font settings
const fontInput = document.getElementById('clamp-font-family');
const weightSelect = document.getElementById('clamp-font-weight');

if (fontInput) {
    fontInput.addEventListener('change', () => {
        const fontName = fontInput.value.trim();
        const preview = document.getElementById('clamp-preview-text');

        if (fontName) {
            loadGoogleFont(fontName);
            preview.style.fontFamily = `'${fontName}', sans-serif`;
        }
    });
}

if (weightSelect) {
    weightSelect.addEventListener('change', () => {
        document.getElementById('clamp-preview-text').style.fontWeight = weightSelect.value;
    });
}

// Aspect Ratio Calculator
function calculateAspectRatio() {
    const w = parseInt(document.getElementById('ratio-w').value);
    const h = parseInt(document.getElementById('ratio-h').value);

    if (!w || !h) {
        alert('Ingresa ancho y alto');
        return;
    }

    function gcd(a, b) {
        return b == 0 ? a : gcd(b, a % b);
    }

    const divisor = gcd(w, h);
    const ratioW = w / divisor;
    const ratioH = h / divisor;

    document.getElementById('ratio-display').innerText = `${ratioW}:${ratioH}`;
    document.getElementById('ratio-result').classList.remove('hidden');
}

// Lorem Ipsum Generator
function generateLorem() {
    const paragraphsCount = parseInt(document.getElementById('lorem-paragraphs').value);
    const linesPerParagraph = parseInt(document.getElementById('lorem-lines').value);

    const words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

    let result = "";

    for (let i = 0; i < paragraphsCount; i++) {
        let paragraph = "";
        // Estimate: 1 line approx 10-15 words. User asks for "lines", so let's aim for ~12 words per line.
        const wordCount = linesPerParagraph * 12;

        for (let j = 0; j < wordCount; j++) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            paragraph += (j === 0 ? randomWord.charAt(0).toUpperCase() + randomWord.slice(1) : randomWord) + " ";
        }

        result += paragraph.trim() + ".\n\n";
    }

    document.getElementById('lorem-output').value = result.trim();
    document.getElementById('lorem-result').classList.remove('hidden');
}

// Disable Right Click on Images
document.addEventListener('contextmenu', event => {
    if (event.target.tagName === 'IMG') {
        event.preventDefault();
    }
});

// --- WhatsApp Contact Form Logic (CallMeBot) ---

const CALLMEBOT_PHONE = '+51990473216';
const CALLMEBOT_API_KEY = 'YOUR_API_KEY'; // <--- CAMBIA ESTO POR TU API KEY REAL

async function sendToWhatsapp(event) {
    event.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Check placeholders if user forgot to change them
    if (CALLMEBOT_API_KEY === 'YOUR_API_KEY') {
        alert('ERROR: Falta configurar la API Key en script.js. Busca la línea que dice CALLMEBOT_API_KEY y pon tu clave.');
        return;
    }

    if (!name || !email || !phone || !message) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML; // Use innerHTML to preserve icon if any

    btn.innerText = 'Enviando...';
    btn.disabled = true;

    // Construct Message
    const text = `Nuevo Contacto Web:
Nombre: ${name}
Email: ${email}
Celular: ${phone}
Mensaje: ${message}`;

    const encodedText = encodeURIComponent(text);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encodedText}&apikey=${CALLMEBOT_API_KEY}`;

    try {
        await fetch(url, { mode: 'no-cors' });

        // Since 'no-cors' is opaque, we simulate success after a short delay
        alert('¡Mensaje enviado correctamente a WhatsApp!');
        event.target.reset();

    } catch (error) {
        console.error('Error sending message:', error);
        alert('Hubo un error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
