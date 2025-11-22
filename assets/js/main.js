
(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

// Início - Mapa
class MapFallback {
  constructor() {
    this.mapElement = document.getElementById('googleMap');
    this.fallbackElement = document.getElementById('mapaFallback');
    this.loadingElement = document.getElementById('mapaLoading');
    this.statusElement = document.getElementById('mapaStatus');
    this.checkConnection();
  }

  // Verifica a conexão com a internet
  async checkConnection() {
    try {
      // Tenta fazer uma requisição para um serviço online
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });

      // Se chegou aqui, tem internet - carrega o mapa
      this.loadGoogleMap();

    } catch (error) {
      // Se falhou, não tem internet - mostra a imagem
      this.showFallbackImage();
    }
  }

  // Carrega o mapa do Google
  loadGoogleMap() {
    // Esconde o loading
    this.loadingElement.style.display = 'none';

    // Mostra o mapa
    this.mapElement.style.display = 'block';

    // Atualiza o status
    this.statusElement.innerHTML = '<small><i class="bi bi-wifi text-success me-1"></i><span class="mapa-status">Mapa online carregado</span></small>';

    // Adiciona um fallback caso o mapa falhe durante o carregamento
    this.mapElement.onload = () => {
      console.log('Mapa carregado com sucesso!');
    };

    this.mapElement.onerror = () => {
      console.log('Erro ao carregar mapa!');
      this.showFallbackImage();
    };
  }

  // Mostrar a imagem
  showFallbackImage() {
    // Esconder o loading e o mapa
    this.loadingElement.style.display = 'none';
    this.mapElement.style.display = 'none';

    // Mostrar a imagem
    this.fallbackElement.style.display = 'block';

    // Atualizar o status
    this.statusElement.innerHTML = '<small><i class="bi bi-wifi-off text-warning me-1"></i><span class="mapa-status">Modo offline - Imagem estática</span></small>';

    console.log('Usando imagem do mapa (sem internet)');
  }
}

// Inicializar quando a página carrega
document.addEventListener('DOMContentLoaded', function () {
  new MapFallback();
});

// Monitora mudanças na conexão
window.addEventListener('online', function () {
  console.log('Conexão restaurada');
});

window.addEventListener('offline', function () {
  console.log('Sem conexão com a internet');
});
// Fim do Mapa

// Página Software
// Sistema de cards clicáveis
let currentActiveCard = null;

function toggleContent(type) {
  const content = document.getElementById(`${type}-content`);
  const card = event.currentTarget;

  // Fecha o conteúdo atual se estiver aberto
  if (currentActiveCard && currentActiveCard !== card) {
    const currentType = currentActiveCard.getAttribute('onclick').match(/'([^']+)'/)[1];
    const currentContent = document.getElementById(`${currentType}-content`);

    currentActiveCard.classList.remove('active');
    currentContent.classList.remove('active');
  }

  // Alterna o conteúdo clicado
  if (card.classList.contains('active')) {
    card.classList.remove('active');
    content.classList.remove('active');
    currentActiveCard = null;
  } else {
    card.classList.add('active');
    content.classList.add('active');
    currentActiveCard = card;

    // Scroll suave para o conteúdo
    content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Fecha o conteúdo ao clicar fora (opcional)
document.addEventListener('click', function (event) {
  if (!event.target.closest('.software-card') && !event.target.closest('.software-content')) {
    document.querySelectorAll('.software-card.active').forEach(card => {
      card.classList.remove('active');
    });
    document.querySelectorAll('.software-content.active').forEach(content => {
      content.classList.remove('active');
    });
    currentActiveCard = null;
  }
});
// Fim da Página Software

// Sistema de Pop-Ups
let popupInterval;
let currentPopup = 0;
const popups = ['popup1', 'popup2', 'popup3'];
const popupPositions = [
  { top: '10%', left: '5%' },
  { top: '20%', right: '5%' },
  { bottom: '10%', left: '5%' }
];

function showPopup(popupId) {
  const popup = document.getElementById(popupId);
  const overlay = document.getElementById('popupOverlay');

  // Posiciona o popup
  const position = popupPositions[popups.indexOf(popupId)];
  Object.keys(position).forEach(key => {
    popup.style[key] = position[key];
  });

  // Mostra o popup e overlay
  popup.classList.add('visible');
  overlay.classList.add('visible');

  // Fecha automaticamente após 8 segundos
  setTimeout(() => {
    closePopup(popupId);
  }, 8000);
}

function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  const overlay = document.getElementById('popupOverlay');

  popup.classList.remove('visible');

  // Verifica se há outros popups abertos
  const anyPopupVisible = Array.from(document.querySelectorAll('.ad-popup')).some(popup =>
    popup.classList.contains('visible')
  );

  if (!anyPopupVisible) {
    overlay.classList.remove('visible');
  }
}

function startPopupCycle() {
  // Mostra o primeiro popup após 3 segundos
  setTimeout(() => {
    showPopup(popups[0]);
    currentPopup = 1;

    // Configura o intervalo para os próximos popups
    popupInterval = setInterval(() => {
      showPopup(popups[currentPopup]);
      currentPopup = (currentPopup + 1) % popups.length;
    }, 10000); // Mostra um novo popup a cada 10 segundos
  }, 3000);
}

// Inicia o ciclo de pop-ups quando a página carrega
document.addEventListener('DOMContentLoaded', startPopupCycle);

// Fecha todos os pop-ups ao clicar no overlay
document.getElementById('popupOverlay').addEventListener('click', function () {
  document.querySelectorAll('.ad-popup.visible').forEach(popup => {
    popup.classList.remove('visible');
  });
  this.classList.remove('visible');
});
// Fim do Sistema de Pop-Ups