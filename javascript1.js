/* --- CONSTANTS & SELECTORS --- */
const navLinks = document.querySelectorAll('header nav a');
const logoLink = document.querySelector('.Logo');
const sections = document.querySelectorAll('section');
const header = document.querySelector('header');
const barsBox = document.querySelector('.bars-box');
const menuIcon = document.getElementById('menu-icon');
const navMenu = document.getElementById('nav-menu');
const scriptURL = 'https://script.google.com/macros/s/AKfycbx4qijButyGj5k9X77oUaYQIw1sKi76E15N3WyFdH0eFhRH68RO7xiljbEDJ4LlLa8Y/exec';

/* --- 1. CORE ANIMATIONS --- */
const activePage = () => {
    barsBox.classList.remove('active');
    header.classList.remove('active');

    setTimeout(() => {
        barsBox.classList.add('active');
        header.classList.add('active');
    }, 100);
};

/* --- 2. VISITOR ENTRY LOGIC --- */
/* --- 2. VISITOR ENTRY LOGIC WITH ANIMATED ENTRY BUTTON PIPELINE --- */
const visitorModal = document.getElementById('visitor-modal');
const visitorForm = document.getElementById('visitor-form');
const exploreBtn = document.getElementById('explore-btn');

// Timeline Properties Configuration Mapping System
const runButtonStates = {
  'hover': {
    '--figure-duration': '100', '--transform-figure': 'translateX(1.5px)', '--walking-duration': '100',
    '--transform-arm1': 'rotate(-5deg)', '--transform-wrist1': 'rotate(-15deg)', '--transform-arm2': 'rotate(5deg)',
    '--transform-wrist2': 'rotate(6deg)', '--transform-leg1': 'rotate(-10deg)', '--transform-calf1': 'rotate(5deg)',
    '--transform-leg2': 'rotate(20deg)', '--transform-calf2': 'rotate(-20deg)'
  },
  'walking1': {
    '--figure-duration': '300', '--transform-figure': 'translateX(11px)', '--walking-duration': '300',
    '--transform-arm1': 'translateX(-4px) translateY(-2px) rotate(120deg)', '--transform-wrist1': 'rotate(-5deg)',
    '--transform-arm2': 'translateX(4px) rotate(-110deg)', '--transform-wrist2': 'rotate(-5deg)',
    '--transform-leg1': 'translateX(-3px) rotate(80deg)', '--transform-calf1': 'rotate(-30deg)',
    '--transform-leg2': 'translateX(4px) rotate(-60deg)', '--transform-calf2': 'rotate(20deg)'
  },
  'walking2': {
    '--figure-duration': '400', '--transform-figure': 'translateX(17px)', '--walking-duration': '300',
    '--transform-arm1': 'rotate(60deg)', '--transform-wrist1': 'rotate(-15deg)', '--transform-arm2': 'rotate(-45deg)',
    '--transform-wrist2': 'rotate(6deg)', '--transform-leg1': 'rotate(-5deg)', '--transform-calf1': 'rotate(10deg)',
    '--transform-leg2': 'rotate(10deg)', '--transform-calf2': 'rotate(-20deg)'
  },
  'falling1': { '--figure-duration': '1600', '--walking-duration': '400', '--transform-arm1': 'rotate(-60deg)', '--transform-wrist1': 'none', '--transform-arm2': 'rotate(30deg)', '--transform-wrist2': 'rotate(120deg)', '--transform-leg1': 'rotate(-30deg)', '--transform-calf1': 'rotate(-20deg)', '--transform-leg2': 'rotate(20deg)' },
  'falling2': { '--walking-duration': '300', '--transform-arm1': 'rotate(-100deg)', '--transform-arm2': 'rotate(-60deg)', '--transform-wrist2': 'rotate(60deg)', '--transform-leg1': 'rotate(80deg)', '--transform-calf1': 'rotate(20deg)', '--transform-leg2': 'rotate(-60deg)' },
  'falling3': { '--walking-duration': '500', '--transform-arm1': 'rotate(-30deg)', '--transform-wrist1': 'rotate(40deg)', '--transform-arm2': 'rotate(50deg)', '--transform-wrist2': 'none', '--transform-leg1': 'rotate(-30deg)', '--transform-leg2': 'rotate(20deg)', '--transform-calf2': 'none' }
};

const assignAnimationState = (state) => {
  if (runButtonStates[state] && exploreBtn) {
    for (let rule in runButtonStates[state]) {
      exploreBtn.style.setProperty(rule, runButtonStates[state][rule]);
    }
  }
};

// Bind UI event indicators for hover transitions
if (exploreBtn) {
  exploreBtn.addEventListener('mouseenter', () => assignAnimationState('hover'));
  exploreBtn.addEventListener('mouseleave', () => {
    exploreBtn.removeAttribute('style');
  });
}

const initSite = () => {
    sections.forEach(section => section.classList.remove('active'));
    if (sections[0]) sections[0].classList.add('active');
    activePage();
};

if (!sessionStorage.getItem('visitorEntered')) {
    if (visitorModal) {
        visitorModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
} else {
    if (visitorModal) visitorModal.style.display = 'none';
    initSite();
}

if (visitorForm) {
    visitorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('visitor-name').value;
        const email = document.getElementById('visitor-email').value;

        const formData = new FormData();
        formData.append('fullname', name);
        formData.append('email', email);
        formData.append('subject', 'VISITOR_LOG');
        formData.append('message', 'User accessed the home page');

        // Prevent button clicks and start the interactive timeline sequence
        exploreBtn.style.pointerEvents = 'none';
        exploreBtn.classList.add('clicked');
        assignAnimationState('walking1');

        setTimeout(() => {
          exploreBtn.classList.add('door-slammed');
          assignAnimationState('walking2');

          setTimeout(() => {
            exploreBtn.classList.add('falling');
            assignAnimationState('falling1');

            setTimeout(() => {
              assignAnimationState('falling2');

              setTimeout(() => {
                assignAnimationState('falling3');

                // Send the network payload as the runner disappears down below
                fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' })
                .finally(() => {
                    sessionStorage.setItem('visitorEntered', 'true');
                    
                    // Fade out modal box smoothly
                    visitorModal.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    visitorModal.style.opacity = '0';
                    
                    setTimeout(() => {
                      visitorModal.style.display = 'none';
                      document.body.style.overflow = 'auto';
                      initSite();
                    }, 400);
                });

              }, 300);
            }, 400);
          }, 400);
        }, 100);
    });
}

/* --- 3. NAVIGATION LOGIC --- */
navLinks.forEach((link, idx) => {
    link.addEventListener('click', () => {
        if (!link.classList.contains('active')) {
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            sections.forEach(section => section.classList.remove('active'));

            // Close mobile navigation menu upon clicking a menu choice
            if (navMenu) navMenu.classList.remove('active');
            if (menuIcon) menuIcon.classList.remove('bx-x');

            activePage();

            setTimeout(() => {
                if (sections[idx]) sections[idx].classList.add('active');
            }, 300);
        }
    });
});

logoLink.addEventListener('click', () => {
    if (!navLinks[0].classList.contains('active')) {
        activePage();
        navLinks.forEach(nav => nav.classList.remove('active'));
        navLinks[0].classList.add('active');
        sections.forEach(section => section.classList.remove('active'));
        setTimeout(() => { sections[0].classList.add('active'); }, 600);
    }
});

/* --- 4. PORTFOLIO CAROUSEL --- */
const arrowRight = document.querySelector('.Portfolio-box .navigation .arrow-right');
const arrowLeft = document.querySelector('.Portfolio-box .navigation .arrow-left');
let portfolioIndex = 0;
const PortfolioDetails = document.querySelectorAll('.Portfolio-detail');

const activePortfolio = () => {
    const imgSlide = document.querySelector('.Portfolio-carousel .img-slide');
    if (imgSlide) {
        imgSlide.style.transform = `translateX(-${portfolioIndex * 100}%)`;
        PortfolioDetails.forEach(detail => detail.classList.remove('active'));
        if (PortfolioDetails[portfolioIndex]) PortfolioDetails[portfolioIndex].classList.add('active');
        
        if (arrowLeft) arrowLeft.classList.toggle('disabled', portfolioIndex === 0);
        if (arrowRight) arrowRight.classList.toggle('disabled', portfolioIndex === PortfolioDetails.length - 1);
    }
};

if (arrowRight) arrowRight.addEventListener('click', () => {
    if (portfolioIndex < PortfolioDetails.length - 1) { portfolioIndex++; activePortfolio(); }
});
if (arrowLeft) arrowLeft.addEventListener('click', () => {
    if (portfolioIndex > 0) { portfolioIndex--; activePortfolio(); }
});

/* --- 5. RESUME TABS --- */
const resumeBtns = document.querySelectorAll('.resume-btn');
const resumeDetails = document.querySelectorAll('.resume-detail');

resumeBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        resumeBtns.forEach(b => b.classList.remove('active'));
        resumeDetails.forEach(detail => detail.classList.remove('active'));
        btn.classList.add('active');
        if (resumeDetails[idx]) resumeDetails[idx].classList.add('active');
    });
});

/* --- 6. CONTACT FORM --- */
const contactForm = document.querySelector('.contact-box form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const contactBtn = contactForm.querySelector('.btn');
        contactBtn.textContent = 'Sending...';

        fetch(scriptURL, { method: 'POST', body: new FormData(contactForm), mode: 'no-cors' })
        .then(() => {
            contactBtn.textContent = 'Message Sent! ✓';
            setTimeout(() => {
                contactForm.reset();
                contactBtn.textContent = 'Send Message';
                logoLink.click();
            }, 2000);
        });
    });
}

/* --- 7. MISC (CERTIFICATES & MENU) --- */
const modal = document.getElementById("cert-modal");
document.querySelectorAll(".cert-clickable").forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById("modal-img").src = card.getAttribute("data-cert");
        document.getElementById("modal-desc").textContent = card.getAttribute("data-msg");
        if (modal) {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    });
});

const closeModalElement = document.querySelector(".close-modal");
if (closeModalElement) {
    closeModalElement.onclick = () => {
        if (modal) modal.style.display = "none";
        document.body.style.overflow = "auto";
    };
}

// Fixed Mobile Hamburger Action Layout
if (menuIcon) {
    menuIcon.onclick = () => {
        if (navMenu) navMenu.classList.toggle('active');
        menuIcon.classList.toggle('bx-x');
    };
}

/* --- 8. EXPERTISE POPUPS --- */
const popup = document.getElementById("service-popup");
const openBox = document.getElementById("data-analyst-box");
const closeBtn = document.querySelector(".close-popup");

if (openBox && popup) {
    openBox.addEventListener("click", function() {
        popup.style.display = "block";
        document.body.style.overflow = "hidden";
    });
}

if (closeBtn && popup) {
    closeBtn.addEventListener("click", function(e) {
        e.stopPropagation(); // Avoid triggering unexpected parent triggers
        popup.style.display = "none";
        document.body.style.overflow = "auto";
    });
}

const webPopup = document.getElementById("web-popup");
const webBox = document.getElementById("web-dev-box");
const closeWebBtn = document.querySelector(".close-web-popup");

if (webBox && webPopup) {
    webBox.addEventListener("click", function() {
        webPopup.style.display = "block";
        document.body.style.overflow = "hidden";
    });
}

if (closeWebBtn && webPopup) {
    closeWebBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        webPopup.style.display = "none";
        document.body.style.overflow = "auto";
    });
}

// Universal Overlay Window Layer Click Handler
window.addEventListener("click", function(e) {
    if (e.target === popup) {
        popup.style.display = "none";
        document.body.style.overflow = "auto";
    }
    if (e.target === webPopup) {
        webPopup.style.display = "none";
        document.body.style.overflow = "auto";
    }
    if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
});

// Accordions
document.querySelectorAll(".project-header").forEach(header => {
    header.addEventListener("click", (e) => {
        e.stopPropagation();
        const project = header.parentElement;
        document.querySelectorAll(".project").forEach(p => {
            if (p !== project) p.classList.remove("active");
        });
        project.classList.toggle("active");
    });
});

// Setup Initial State
activePortfolio();
if (window.gsap) {
    gsap.from(".box", { x: -100, opacity: 0, duration: 1 });
}




/* --- 9. FOOTER LINKS INTEGRATION SYSTEM --- */
document.querySelectorAll('.footer-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIndex = parseInt(link.getAttribute('data-index'));
        
        if (!isNaN(targetIndex) && navLinks[targetIndex]) {
            // Trigger a simulated click on the primary header navigation element
            navLinks[targetIndex].click();
            
            // Instantly bring window back to header layout viewport level smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});