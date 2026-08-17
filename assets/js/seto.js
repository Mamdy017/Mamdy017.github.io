/**
 * SETO SUPPLY PARTNERS — LOGISTICS & MARITIME DASHBOARD LOGIC
 * Real-time ship tracking, interactive data views, modal handling, theme toggling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Data Store
  const vesselsData = {
    "fuelbreak": {
      name: "Fuelbreak #6",
      type: "Pétrolier Class-A",
      status: "En mer",
      statusClass: "sea",
      origin: "Rotterdam",
      originCode: "RTM",
      originFlag: "https://flagcdn.com/w40/nl.png",
      destination: "Dakar",
      destinationCode: "SEN",
      destinationFlag: "https://flagcdn.com/w40/sn.png",
      duration: "1 mois",
      eta: "20 Juin (2j)",
      progress: 30,
      cargo: "Pétrole Brut",
      speed: "14.8 nœuds",
      totalCapacity: "12 000 MT",
      reserved: "62%",
      free: "38%",
      allocationsOpen: true,
      svgHullColor: "#e63946",
      svgContainerType: "tanker"
    },
    "speedway": {
      name: "Speedway #4523",
      type: "Cargo Vraquier",
      status: "En mer",
      statusClass: "sea",
      origin: "Marseille",
      originCode: "MRS",
      originFlag: "https://flagcdn.com/w40/fr.png",
      destination: "Abidjan",
      destinationCode: "ABJ",
      destinationFlag: "https://flagcdn.com/w40/ci.png",
      duration: "18 jours",
      eta: "23 Juin (5j)",
      progress: 58,
      cargo: "Blé Vrac",
      speed: "16.2 nœuds",
      totalCapacity: "28 500 MT",
      reserved: "85%",
      free: "15%",
      allocationsOpen: true,
      svgHullColor: "#2a9d8f",
      svgContainerType: "bulk"
    },
    "kwiktrip": {
      name: "Kwik Trip #1111",
      type: "Porte-conteneurs",
      status: "En port (retard)",
      statusClass: "port",
      origin: "Marseille",
      originCode: "MRS",
      originFlag: "https://flagcdn.com/w40/fr.png",
      destination: "Dakar",
      destinationCode: "SEN",
      destinationFlag: "https://flagcdn.com/w40/sn.png",
      duration: "12 jours",
      eta: "11 Juin (En port)",
      progress: 92,
      cargo: "Conteneurs Dry",
      speed: "0.0 nœuds",
      totalCapacity: "8 400 MT",
      reserved: "100%",
      free: "0%",
      allocationsOpen: false,
      svgHullColor: "#f4a261",
      svgContainerType: "container"
    }
  };

  let currentVesselKey = "fuelbreak";

  // Sidebar Toggle
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const icon = toggleBtn.querySelector('i');
      if (sidebar.classList.contains('collapsed')) {
        icon.className = 'fas fa-chevron-right';
      } else {
        icon.className = 'fas fa-chevron-left';
      }
    });
  }

  // View Section Navigation
  const navItems = document.querySelectorAll('.nav-item');
  const viewSections = document.querySelectorAll('.view-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      if (!targetView) return;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      viewSections.forEach(sec => {
        if (sec.id === `view-${targetView}`) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });
    });
  });

  // Vessel Selector Card Click
  const vesselCards = document.querySelectorAll('.vessel-card');
  vesselCards.forEach(card => {
    card.addEventListener('click', () => {
      const vesselKey = card.getAttribute('data-vessel');
      if (vesselsData[vesselKey]) {
        vesselCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currentVesselKey = vesselKey;
        updateVesselDisplay(vesselsData[vesselKey]);
      }
    });
  });

  function updateVesselDisplay(data) {
    // Route codes & cities
    document.getElementById('display-origin-code').textContent = data.originCode;
    document.getElementById('display-origin-city').textContent = data.origin;
    document.getElementById('display-dest-code').textContent = data.destinationCode;
    document.getElementById('display-dest-city').textContent = data.destination;
    
    // Flags
    document.getElementById('display-origin-flag').src = data.originFlag;
    document.getElementById('display-dest-flag').src = data.destinationFlag;

    // Route duration & specs
    document.getElementById('display-duration').textContent = data.duration;
    document.getElementById('display-speed').textContent = data.speed;
    document.getElementById('display-cargo').textContent = data.cargo;
    document.getElementById('display-capacity').textContent = data.totalCapacity;
    document.getElementById('display-reserved').textContent = data.reserved;
    document.getElementById('display-free').textContent = data.free;

    // Origin / Dest mini details
    document.getElementById('display-route-origin').textContent = data.origin;
    document.getElementById('display-route-dest').textContent = data.destination;
    document.getElementById('display-origin-prog').textContent = `${data.progress}%`;

    // Progress bar & vessel node
    const fill = document.getElementById('route-progress-fill');
    const node = document.getElementById('route-progress-node');
    if (fill && node) {
      fill.style.width = `${data.progress}%`;
      node.style.left = `${data.progress}%`;
    }

    // Allocations badge
    const badge = document.getElementById('display-alloc-badge');
    if (badge) {
      if (data.allocationsOpen) {
        badge.style.display = 'flex';
        badge.innerHTML = '<span class="live-dot-orange"></span> ALLOCATIONS OUVERTES';
      } else {
        badge.style.display = 'flex';
        badge.innerHTML = '<span style="width:6px;height:6px;background:#ef4444;border-radius:50%"></span> ALLOCATIONS FERMÉES';
      }
    }
  }

  // Vessel Search Filtering
  const vesselSearchInput = document.getElementById('vesselSearchInput');
  if (vesselSearchInput) {
    vesselSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      vesselCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Modal Dialog (+ Nouveau Programme)
  const btnNewProgram = document.getElementById('btnNewProgram');
  const modalOverlay = document.getElementById('modalNewProgram');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const formNewProgram = document.getElementById('formNewProgram');

  if (btnNewProgram && modalOverlay) {
    btnNewProgram.addEventListener('click', () => {
      modalOverlay.classList.add('active');
    });

    const closeModal = () => modalOverlay.classList.remove('active');

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    if (formNewProgram) {
      formNewProgram.addEventListener('submit', (e) => {
        e.preventDefault();
        const shipName = document.getElementById('inputShipName').value;
        const cargoType = document.getElementById('inputCargoType').value;
        const volume = document.getElementById('inputVolume').value;

        showToast(`Programme "${shipName}" (${volume} MT - ${cargoType}) créé avec succès !`);
        closeModal();
        formNewProgram.reset();
      });
    }
  }

  // Theme Toggle (Dark / Light)
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      
      const icon = btnThemeToggle.querySelector('i');
      if (newTheme === 'dark') {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    });
  }

  // Toast Notification System
  function showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--emerald-500)"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Interactive Revenue Chart Data Points Hover
  const chartPoints = document.querySelectorAll('.chart-data-point');
  const chartTooltip = document.getElementById('chartTooltip');

  chartPoints.forEach(pt => {
    pt.addEventListener('mouseenter', (e) => {
      const val = pt.getAttribute('data-val');
      const date = pt.getAttribute('data-date');
      if (chartTooltip) {
        chartTooltip.innerHTML = `<strong>${date}</strong>: ${val}`;
        chartTooltip.style.display = 'block';
        chartTooltip.style.left = `${e.layerX || e.offsetX}px`;
        chartTooltip.style.top = `${(e.layerY || e.offsetY) - 30}px`;
      }
    });

    pt.addEventListener('mouseleave', () => {
      if (chartTooltip) chartTooltip.style.display = 'none';
    });
  });
});
