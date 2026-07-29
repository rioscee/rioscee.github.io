// --- DATOS DE PRODUCTOS (FÁCILMENTE EDITABLES) ---
const products = [
    {
        id: 1,
        title: "MasterFunnel Pro",
        category: "funnels",
        categoryLabel: "Embudos",
        price: "97.00",
        commission: "67.90",
        image: "images/product_masterfunnel.png",
        hotmartLink: "https://go.hotmart.com/placeholder-masterfunnel",
        materialLink: "https://carlosr2026.com/material-masterfunnel",
        description: "Pack completo de plantillas de embudos de alta conversión para lanzamientos y ventas en automático. Incluye soporte y actualizaciones semanales."
    },
    {
        id: 2,
        title: "Copywriting Magnético",
        category: "ebooks",
        categoryLabel: "Ebooks",
        price: "27.00",
        commission: "18.90",
        image: "images/product_copywriting.png",
        hotmartLink: "https://go.hotmart.com/placeholder-copywriting",
        materialLink: "https://carlosr2026.com/material-copywriting",
        description: "Guía paso a paso y plantillas de texto persuasivo listas para copiar y pegar. Vende cualquier producto o servicio con palabras mágicas."
    },
    {
        id: 3,
        title: "Automatizaciones Make",
        category: "automatizaciones",
        categoryLabel: "Automatizaciones",
        price: "147.00",
        commission: "102.90",
        image: "images/product_make.png",
        hotmartLink: "https://go.hotmart.com/placeholder-make",
        materialLink: "https://carlosr2026.com/material-make",
        description: "Planos y flujos listos para importar a Make.com. Automatiza la prospección, el seguimiento por WhatsApp y la entrega del producto sin código."
    },
    {
        id: 4,
        title: "Landing Page Express",
        category: "funnels",
        categoryLabel: "Embudos",
        price: "47.00",
        commission: "32.90",
        image: "images/product_landing.png",
        hotmartLink: "https://go.hotmart.com/placeholder-landing",
        materialLink: "https://carlosr2026.com/material-landing",
        description: "Colección de plantillas HTML y CSS súper ligeras optimizadas para dispositivos móviles. Diseñadas bajo la regla de carga ultrarrápida."
    },
    {
        id: 5,
        title: "SaaS Launcher",
        category: "cursos",
        categoryLabel: "Cursos",
        price: "297.00",
        commission: "207.90",
        image: "images/product_saas.png",
        hotmartLink: "https://go.hotmart.com/placeholder-saas",
        materialLink: "https://carlosr2026.com/material-saas",
        description: "Entrenamiento completo para crear, empaquetar y vender tu propio software de suscripción mensual utilizando tecnologías low-code."
    },
    {
        id: 6,
        title: "Email Marketing Automático",
        category: "ebooks",
        categoryLabel: "Ebooks",
        price: "17.00",
        commission: "11.90",
        image: "images/product_email.png",
        hotmartLink: "https://go.hotmart.com/placeholder-email",
        materialLink: "https://carlosr2026.com/material-email",
        description: "Secuencias de correo de 7 días diseñadas para calentar leads fríos y convertirlos en compradores recurrentes de forma automática."
    },
    {
        id: 7,
        title: "Ad-Creatives Pro",
        category: "funnels",
        categoryLabel: "Embudos",
        price: "37.00",
        commission: "25.90",
        image: "images/product_creatives.png",
        hotmartLink: "https://go.hotmart.com/placeholder-creatives",
        materialLink: "https://carlosr2026.com/material-creatives",
        description: "Plantillas editables de Canva y Figma para crear creativos de anuncios de alto CTR para campañas de Meta Ads, TikTok y Google."
    },
    {
        id: 8,
        title: "SEO para Emprendedores",
        category: "cursos",
        categoryLabel: "Cursos",
        price: "197.00",
        commission: "137.90",
        image: "images/product_seo.png",
        hotmartLink: "https://go.hotmart.com/placeholder-seo",
        materialLink: "https://carlosr2026.com/material-seo",
        description: "Aprende el sistema orgánico para posicionar tus landings en las primeras posiciones de Google sin necesidad de invertir en publicidad."
    }
];

// --- VARIABLES DE ESTADO ---
let activeCategory = "all";

// --- RENDERIZADO DE PRODUCTOS ---
function renderProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        return activeCategory === "all" || product.category === activeCategory;
    });

    // Limpiar grid
    grid.innerHTML = "";

    // Si no hay resultados
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-results reveal-card active">
                <div class="no-results-icon">
                    <i data-lucide="search-slash"></i>
                </div>
                <h3 class="no-results-text">No se encontraron productos</h3>
                <p>Prueba buscando con palabras clave diferentes o selecciona otra categoría.</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    // Inyectar elementos
    filteredProducts.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card reveal-card";
        card.setAttribute("data-id", product.id);
        card.setAttribute("onclick", "this.classList.toggle('flipped')");
        
        card.innerHTML = `
            <div class="card-inner">
                <!-- CARA FRONTAL (FRONT) -->
                <div class="card-front">
                    <div class="card-badges">
                        <span class="card-badge card-badge-hotmart">
                            <i data-lucide="flame" style="width: 14px; height: 14px;"></i> Hotmart
                        </span>
                        <span class="card-badge card-badge-commission">
                            ${Math.round((parseFloat(product.commission) / parseFloat(product.price)) * 100)}% Comisión
                        </span>
                    </div>
                    <img src="${product.image}" alt="Portada del producto ${product.title}" loading="lazy" style="aspect-ratio: 4/5;">
                    <div class="front-info-overlay">
                        <span class="card-category">${product.categoryLabel}</span>
                        <h3 class="front-title">${product.title}</h3>
                        <div class="flip-indicator">
                            <i data-lucide="help-circle" style="width: 14px; height: 14px;"></i> Ver Detalles
                        </div>
                    </div>
                </div>
                
                <!-- CARA TRASERA (BACK) -->
                <div class="card-back">
                    <div class="back-header">
                        <span class="card-category">${product.categoryLabel}</span>
                        <h3 class="card-title">${product.title}</h3>
                    </div>
                    
                    <p class="card-description">${product.description}</p>
                    
                    <div class="card-metrics">
                        <div class="metric-box">
                            <span class="metric-label">Precio</span>
                            <span class="metric-val metric-val-price">$${product.price} USD</span>
                        </div>
                        <div class="metric-box">
                            <span class="metric-label">Tu Comisión</span>
                            <span class="metric-val metric-val-commission">$${product.commission} USD</span>
                        </div>
                    </div>
                    
                    <div class="card-actions" onclick="event.stopPropagation()">
                        <a href="${product.hotmartLink}" target="_blank" rel="noopener noreferrer" class="btn-card btn-card-primary">
                            Afiliarse en Hotmart
                        </a>
                    </div>
                    
                    <div class="flip-back-hint">
                        <i data-lucide="rotate-ccw" style="width: 12px; height: 12px;"></i> Toca para volver
                    </div>
                </div>
            </div>
        `;

        grid.appendChild(card);

        // Retardo secuencial de animación (stagger)
        setTimeout(() => {
            card.classList.add("active");
        }, index * 80);
    });

    // Inicializar íconos Lucide inyectados
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}



// --- CONFIGURACIÓN DE FILTROS ---
function setupFilters() {
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.getAttribute("data-category");
            renderProducts();
        });
    });
}

// --- EFECTOS DE REVELADO DE SCROLL ---
function setupRevealOnScroll() {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}

// --- CARGA DE DOCUMENTO ---
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    setupFilters();
    setupRevealOnScroll();
});
