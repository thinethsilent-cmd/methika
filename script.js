// --- ACCOUNT DATABASE (LOCAL STORAGE INTEGRATED) ---
const STORAGE_KEY = "hexstore_accounts";

// Real defaults provided by the user (directly in the root folder)
const defaultAccounts = [
    {
        id: 1,
        title: "ꕥS28  ꕥLv.69  ꕥPrime Lv.6  ꕥSingapore server",
        category: "legendary",
        price: 19500,
        oldPrice: 25000,
        level: 69,
        likes: "Prime Lv.6",
        rank: "Singapore server",
        image: "acc_19500.png",
        highlights: [
            "Season 28 Veteran Bundle",
            "Level 69 Highly Optimized Profile",
            "Prime Level 6 Premium Privilege",
            "Singapore Server Premium Ping Connection",
            "Exclusive Weapon & Vault Collections"
        ]
    },
    {
        id: 2,
        title: "ꕥS28  ꕥLv.67  ꕥPrime Lv.3  ꕥSingapore server",
        category: "legendary",
        price: 5000,
        oldPrice: 7500,
        level: 67,
        likes: "Prime Lv.3",
        rank: "Singapore server",
        image: "acc_5000.png",
        highlights: [
            "Season 28 Veteran Upgrade",
            "Level 67 Top-tier Layout",
            "Prime Level 3 Upgraded Bundle",
            "Singapore Region Fast server connection",
            "Legendary budget gun skins and outfits"
        ]
    }
];

let accounts = [];

// --- DOM ELEMENTS ---
const accountsGrid = document.getElementById("accountsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const sortFilter = document.getElementById("sortFilter");

// Modals
const detailsModal = document.getElementById("detailsModal");
const purchaseModal = document.getElementById("purchaseModal");
const closeDetailsModal = document.getElementById("closeDetailsModal");
const closePurchaseModal = document.getElementById("closePurchaseModal");

// Modal Details Injections
const modalMainImg = document.getElementById("modalMainImg");
const modalTag = document.getElementById("modalTag");
const modalTitle = document.getElementById("modalTitle");
const modalOldPrice = document.getElementById("modalOldPrice");
const modalCurrentPrice = document.getElementById("modalCurrentPrice");
const modalLevel = document.getElementById("modalLevel");
const modalLikes = document.getElementById("modalLikes");
const modalRank = document.getElementById("modalRank");
const modalFeaturesList = document.getElementById("modalFeaturesList");
const buyNowBtn = document.getElementById("buyNowBtn");

// Modal Purchase Injections
const purchaseAccountTitle = document.getElementById("purchaseAccountTitle");
const purchaseAccountPrice = document.getElementById("purchaseAccountPrice");
const whatsappBtnLink = document.querySelector(".whatsapp-btn");

// Mobile menu toggle
const mobileToggle = document.getElementById("mobileToggle");
const navMenu = document.getElementById("navMenu");

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    loadAccountsData();
    setupEventListeners();
    handleHeaderScroll();
    initGiveawayPortal();
});

// Load from local storage or defaults
function loadAccountsData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        accounts = JSON.parse(raw);
    } else {
        accounts = defaultAccounts;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAccounts));
    }
    renderAccounts(accounts);
}

// --- RENDER ACCOUNTS ---
function renderAccounts(data) {
    accountsGrid.innerHTML = "";
    if (data.length === 0) {
        accountsGrid.innerHTML = `
            <div class="no-results text-center" style="grid-column: 1/-1; padding: 50px 20px;">
                <i class="fa-solid fa-face-frown" style="font-size: 48px; color: var(--text-dark); margin-bottom: 15px;"></i>
                <h3>No Accounts Match Your Filter</h3>
                <p class="text-gray" style="margin-top: 10px;">Try adjusting your filters or search terms to find accounts.</p>
            </div>
        `;
        return;
    }

    data.forEach(account => {
        const card = document.createElement("div");
        card.className = "account-card";
        
        let tagClass = "tag-legendary";
        if (account.category === "veteran") tagClass = "tag-veteran";
        if (account.category === "budget") tagClass = "tag-budget";

        card.innerHTML = `
            <div class="card-media-wrapper">
                <img src="${account.image}" alt="${account.title}" class="card-img" onerror="this.src='https://via.placeholder.com/350x220'">
                <span class="card-tag ${tagClass}">${account.category}</span>
                <span class="card-level-badge">LVL ${account.level}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${account.title}</h3>
                <div class="card-stats">
                    <div class="stat-box">
                        <span class="stat-box-val">${account.likes}</span>
                        <span class="stat-box-lbl">Sub-stat</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-box-val" style="font-size: 11px;">${account.rank}</span>
                        <span class="stat-box-lbl">Server</span>
                    </div>
                </div>
                <ul class="card-highlights">
                    ${account.highlights.slice(0, 3).map(h => `<li><i class="fa-solid fa-circle-check"></i> ${h}</li>`).join("")}
                </ul>
                <div class="card-footer">
                    <div class="card-price">
                        <span class="price-original">Rs. ${account.oldPrice.toLocaleString()}</span>
                        <span class="price-val">Rs. ${account.price.toLocaleString()}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-card-icon" onclick="openDetails(${account.id})" title="View Details">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-card-buy" onclick="initiatePurchase(${account.id})">Buy</button>
                    </div>
                </div>
            </div>
        `;
        accountsGrid.appendChild(card);
    });
}

// --- FILTER & SORT LOGIC ---
function filterAndSort() {
    let filtered = [...accounts];

    // Search query filter
    const query = searchInput.value.toLowerCase().trim();
    if (query !== "") {
        filtered = filtered.filter(acc => 
            acc.title.toLowerCase().includes(query) || 
            acc.highlights.some(h => h.toLowerCase().includes(query)) ||
            acc.rank.toLowerCase().includes(query)
        );
    }

    // Category filter
    const category = categoryFilter.value;
    if (category !== "all") {
        filtered = filtered.filter(acc => acc.category === category);
    }

    // Price filter
    const maxPrice = priceFilter.value;
    if (maxPrice !== "all") {
        filtered = filtered.filter(acc => acc.price <= parseInt(maxPrice));
    }

    // Sorting
    const sortBy = sortFilter.value;
    if (sortBy === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "level") {
        filtered.sort((a, b) => b.level - a.level);
    } // "featured" matches primary database order

    renderAccounts(filtered);
}

// --- SETUP EVENT LISTENERS ---
function setupEventListeners() {
    searchInput.addEventListener("input", filterAndSort);
    categoryFilter.addEventListener("change", filterAndSort);
    priceFilter.addEventListener("change", filterAndSort);
    sortFilter.addEventListener("change", filterAndSort);

    // Modal close events
    closeDetailsModal.addEventListener("click", () => {
        detailsModal.style.display = "none";
    });

    closePurchaseModal.addEventListener("click", () => {
        purchaseModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === detailsModal) {
            detailsModal.style.display = "none";
        }
        if (e.target === purchaseModal) {
            purchaseModal.style.display = "none";
        }
    });

    // Mobile menu toggle logic
    mobileToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        const isOpen = navMenu.classList.contains("open");
        mobileToggle.innerHTML = isOpen ? `<i class="fa-solid fa-xmark"></i>` : `<i class="fa-solid fa-bars"></i>`;
    });

    // Close menu when clicking link
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            mobileToggle.innerHTML = `<i class="fa-solid fa-bars"></i>`;
            
            // Set active class
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // FAQ Accordion click event
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(q => {
        q.addEventListener("click", () => {
            const faqItem = q.parentElement;
            faqItem.classList.toggle("active");
        });
    });
}

// --- HEADER SCROLL EFFECT ---
function handleHeaderScroll() {
    const header = document.querySelector(".main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

// --- MODAL UTILITIES ---
function openDetails(id) {
    const account = accounts.find(acc => acc.id === id);
    if (!account) return;

    modalMainImg.src = account.image;
    modalMainImg.alt = account.title;
    modalTag.innerText = account.category;
    modalTag.className = `modal-tag tag-${account.category}`;
    modalTitle.innerText = account.title;
    modalOldPrice.innerText = `Rs. ${account.oldPrice.toLocaleString()}`;
    modalCurrentPrice.innerText = `Rs. ${account.price.toLocaleString()}`;
    
    modalLevel.innerText = account.level;
    modalLikes.innerText = account.likes;
    modalRank.innerText = account.rank;

    // Highlights list
    modalFeaturesList.innerHTML = account.highlights.map(h => 
        `<li><i class="fa-solid fa-circle-check"></i> ${h}</li>`
    ).join("");

    // Hook up Buy Now button
    buyNowBtn.onclick = () => {
        detailsModal.style.display = "none";
        initiatePurchase(account.id);
    };

    detailsModal.style.display = "flex";
}

// Dynamically generate localStorage and defaults
function initiatePurchase(id) {
    const account = accounts.find(acc => acc.id === id);
    if (!account) return;

    purchaseAccountTitle.innerText = account.title;
    purchaseAccountPrice.innerText = `Rs. ${account.price.toLocaleString()}`;
    
    // Dynamically format WhatsApp Buy Link directly to their number +94 75 652 1586
    const message = encodeURIComponent(`Hi Methika! I am highly interested in purchasing the Free Fire Account:\n\nTitle: ${account.title}\nPrice: Rs. ${account.price.toLocaleString()}\nID: #${account.id}\n\nPlease guide me through the transaction process!`);
    whatsappBtnLink.href = `https://wa.me/94756521586?text=${message}`;

    purchaseModal.style.display = "flex";
}

// --- SPONSOR SUPPORT & GIVEAWAY SYSTEM ---
const GIVEAWAY_UID_KEY = "giveaway_player_uid";
const GIVEAWAY_PROGRESS_KEY = "giveaway_clicks_progress";
const GIVEAWAY_STATE_KEY = "giveaway_active_state";

let giveawayUid = "";
let giveawayProgress = 0;
let giveawayState = "input"; // input, task, verifying, result

function initGiveawayPortal() {
    // DOM Elements
    const giveawayInputVal = document.getElementById("giveawayUid");
    const giveawayError = document.getElementById("giveawayUidError");
    const btnProceed = document.getElementById("btnProceedGiveaway");
    const btnSponsorAd = document.getElementById("btnSponsorAd");
    const btnRestart = document.getElementById("btnRestartGiveaway");
    const progressDotsContainer = document.getElementById("progressDots");

    if (!giveawayInputVal) return; // Guard clause in case we are on owner.html

    // Load State from LocalStorage
    giveawayUid = localStorage.getItem(GIVEAWAY_UID_KEY) || "";
    giveawayProgress = parseInt(localStorage.getItem(GIVEAWAY_PROGRESS_KEY)) || 0;
    giveawayState = localStorage.getItem(GIVEAWAY_STATE_KEY) || "input";

    // Set UI elements based on loaded state
    if (giveawayUid) {
        giveawayInputVal.value = giveawayUid;
    }
    
    // Setup Dots
    renderProgressDots(progressDotsContainer);

    // Render loaded state
    updateGiveawayStateUI();

    // Event Listeners
    btnProceed.addEventListener("click", () => {
        const val = giveawayInputVal.value.trim();
        // Validate: numeric only, 8 to 12 digits
        if (/^\d{8,12}$/.test(val)) {
            giveawayUid = val;
            giveawayProgress = 0;
            giveawayState = "task";
            localStorage.setItem(GIVEAWAY_UID_KEY, giveawayUid);
            localStorage.setItem(GIVEAWAY_PROGRESS_KEY, giveawayProgress);
            localStorage.setItem(GIVEAWAY_STATE_KEY, giveawayState);
            
            updateGiveawayStateUI();
            giveawayError.classList.remove("active");
        } else {
            giveawayError.classList.add("active");
        }
    });

    btnSponsorAd.addEventListener("click", () => {
        // Open the ad link in a new window/tab
        window.open("https://omg10.com/4/11024182", "_blank");

        // Increment Progress
        giveawayProgress++;
        localStorage.setItem(GIVEAWAY_PROGRESS_KEY, giveawayProgress);

        // Update Dots and Bar
        updateProgressBarAndDots(progressDotsContainer);

        if (giveawayProgress >= 10) {
            giveawayState = "verifying";
            localStorage.setItem(GIVEAWAY_STATE_KEY, giveawayState);
            updateGiveawayStateUI();

            // Run verification spinner for 3 seconds, then show the pending results
            setTimeout(() => {
                giveawayState = "result";
                localStorage.setItem(GIVEAWAY_STATE_KEY, giveawayState);
                updateGiveawayStateUI();
            }, 3000);
        }
    });

    btnRestart.addEventListener("click", () => {
        // Reset everything
        giveawayUid = "";
        giveawayProgress = 0;
        giveawayState = "input";
        
        localStorage.removeItem(GIVEAWAY_UID_KEY);
        localStorage.removeItem(GIVEAWAY_PROGRESS_KEY);
        localStorage.setItem(GIVEAWAY_STATE_KEY, giveawayState);

        giveawayInputVal.value = "";
        giveawayError.classList.remove("active");

        updateGiveawayStateUI();
    });
}

function updateGiveawayStateUI() {
    const states = ["input", "task", "verifying", "result"];
    states.forEach(s => {
        const el = document.getElementById(`giveaway-state-${s}`);
        if (el) {
            if (s === giveawayState) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        }
    });

    // Sub-UI updates
    const displayUid = document.getElementById("displayPlayerUid");
    const resultUid = document.getElementById("resultPlayerUid");
    const progressBarFill = document.getElementById("progressBarFill");
    const progressBarText = document.getElementById("progressBarText");
    const btnProgressCount = document.getElementById("btnProgressCount");
    const whatsappBtn = document.getElementById("giveawayWhatsappBtn");
    const progressDotsContainer = document.getElementById("progressDots");

    if (displayUid) displayUid.innerText = giveawayUid;
    if (resultUid) resultUid.innerText = giveawayUid;

    if (giveawayState === "task") {
        if (btnProgressCount) btnProgressCount.innerText = `${giveawayProgress}/10`;
        if (progressBarText) progressBarText.innerText = `${giveawayProgress} / 10 Clicks`;
        if (progressBarFill) progressBarFill.style.width = `${giveawayProgress * 10}%`;
        renderProgressDots(progressDotsContainer);
    }

    if (giveawayState === "result" && whatsappBtn) {
        const message = encodeURIComponent(`Hi Methika! I supported your store sponsors with 10 page views for the Giveaway.\n\nMy Free Fire UID is: ${giveawayUid}\n\nPlease verify my clicks manually and activate my weekly membership priority!`);
        whatsappBtn.href = `https://wa.me/94756521586?text=${message}`;
    }
}

function renderProgressDots(container) {
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 10; i++) {
        const dot = document.createElement("div");
        dot.className = "progress-dot";
        if (i < giveawayProgress) {
            dot.className += " active";
        } else if (i === giveawayProgress) {
            dot.className += " current";
        }
        container.appendChild(dot);
    }
}

function updateProgressBarAndDots(container) {
    const progressBarFill = document.getElementById("progressBarFill");
    const progressBarText = document.getElementById("progressBarText");
    const btnProgressCount = document.getElementById("btnProgressCount");

    if (btnProgressCount) btnProgressCount.innerText = `${giveawayProgress}/10`;
    if (progressBarText) progressBarText.innerText = `${giveawayProgress} / 10 Clicks`;
    if (progressBarFill) progressBarFill.style.width = `${giveawayProgress * 10}%`;

    renderProgressDots(container);
}
