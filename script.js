function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    if (sidebar.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
}

function scrollToSection(id) {
    if (id === 'inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function navegar(id) {
    toggleMenu();
    scrollToSection(id);
}

function abrirLink(url) {
    window.open(url, '_blank');
}

window.addEventListener('scroll', reveal);

function reveal() {
    var reveals = document.querySelectorAll('.reveal');

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 50;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
reveal();

(function initDeviceParallax() {
    var panel = document.getElementById('heroPanel');
    var device = document.getElementById('device2d');
    if (!panel || !device) return;
    var laptop = device.querySelector('.laptop-2d');
    var phone = device.querySelector('.phone-2d');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !laptop || !phone) return;

    panel.addEventListener('mousemove', function (e) {
        var rect = panel.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        laptop.style.transform = 'translate(' + (px * -10) + 'px,' + (py * -8) + 'px)';
        phone.style.transform = 'translate(' + (px * 16) + 'px,' + (py * -14) + 'px)';
    });

    panel.addEventListener('mouseleave', function () {
        laptop.style.transform = '';
        phone.style.transform = '';
    });
})();

(function initPortfolio() {
    var grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    var proyectos = {
        floreria: { nombre: 'Florería', archivos: ['Floreria1', 'Floreria2', 'Floreria3'] },
        yates: { nombre: 'Yates', archivos: ['Yates1', 'Yates2', 'Yates3', 'Yates4', 'Yates5'] },
        imprenta: { nombre: 'Imprenta', archivos: ['Imprenta1', 'Imprenta2', 'Imprenta3', 'Imprenta4', 'Imprenta5', 'Imprenta6'] },
        Bazar: { nombre: 'Bazar', archivos: ['Bazar1', 'Bazar2', 'Bazar3', 'Bazar4', 'Bazar5', 'Bazar6', 'Bazar7'] },
    };
    var orden = ['floreria', 'yates', 'imprenta', 'Bazar'];

    grid.innerHTML = orden.map(function (categoria) {
        var p = proyectos[categoria];
        return '' +
            '<figure class="portfolio-item reveal active" data-categoria="' + categoria + '">' +
                '<img src="img/' + p.archivos[0] + '.png" alt="Proyecto ' + p.nombre + '" loading="lazy">' +
                '<span class="portfolio-count">' + p.archivos.length + ' fotos</span>' +
                '<figcaption class="portfolio-overlay">' +
                    '<span class="portfolio-name">' + p.nombre + '</span>' +
                '</figcaption>' +
            '</figure>';
    }).join('');

    // ---- Lightbox ----
    var lightbox = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightboxImg');
    var lbCaption = document.getElementById('lightboxCaption');
    var lbClose = document.getElementById('lightboxClose');
    var lbPrev = document.getElementById('lightboxPrev');
    var lbNext = document.getElementById('lightboxNext');
    var activeCategoria = null;
    var activeIndex = 0;

    function render() {
        var p = proyectos[activeCategoria];
        lbImg.src = 'img/' + p.archivos[activeIndex] + '.png';
        lbImg.alt = 'Proyecto ' + p.nombre + ' ' + (activeIndex + 1);
        lbCaption.textContent = p.nombre + ' — N.' + String(activeIndex + 1).padStart(2, '0') + ' de ' + p.archivos.length;
    }

    function openLightbox(categoria) {
        activeCategoria = categoria;
        activeIndex = 0;
        render();
        lightbox.classList.add('active');
        document.body.classList.add('loading');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('loading');
    }

    function step(delta) {
        if (!activeCategoria) return;
        var total = proyectos[activeCategoria].archivos.length;
        activeIndex = (activeIndex + delta + total) % total;
        render();
    }

    grid.addEventListener('click', function (e) {
        var item = e.target.closest('.portfolio-item');
        if (!item) return;
        openLightbox(item.getAttribute('data-categoria'));
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', function () { step(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { step(1); });
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }
    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
    });
})();

/* ===== Pantalla de carga: icono -> logo completo -> contenido ===== */
(function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;

    var icon = document.getElementById('loaderIcon');
    var word = document.getElementById('loaderWord');
    var bar = document.getElementById('loaderBar');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var t = reduceMotion
        ? { iconIn: 30, wordIn: 150, barFill: 150, hide: 350, remove: 550 }
        : { iconIn: 80, wordIn: 700, barFill: 750, hide: 1750, remove: 2450 };

    function finishLoad() {
        loader.classList.add('hide');
        document.body.classList.remove('loading');
        reveal();
    }

    requestAnimationFrame(function () {
        setTimeout(function () { icon.classList.add('in'); }, t.iconIn);
        setTimeout(function () {
            word.classList.add('show');
            bar.classList.add('fill');
        }, t.wordIn);
        setTimeout(finishLoad, t.hide);
        setTimeout(function () {
            loader.style.display = 'none';
            loader.setAttribute('aria-hidden', 'true');
        }, t.remove);
    });

    // Salvaguarda: si algo bloquea la animación, nunca dejar la página oculta.
    setTimeout(finishLoad, 4000);
})();
