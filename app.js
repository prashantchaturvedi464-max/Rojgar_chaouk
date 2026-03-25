// Initial Mock Data (Minimum 10 workers registered)
const initialWorkers = [
    { id: 1, name: "Ramesh Kumar", phone: "9876543210", skill: "Mason", experience: 8, wage: 700, verified: true },
    { id: 2, name: "Suresh Singh", phone: "9876543211", skill: "Painter", experience: 5, wage: 500, verified: true },
    { id: 3, name: "Abdul Rehman", phone: "9876543212", skill: "Plumber", experience: 10, wage: 800, verified: true },
    { id: 4, name: "Vikash Paswan", phone: "9876543213", skill: "Helper", experience: 2, wage: 400, verified: false },
    { id: 5, name: "Dinesh Sharma", phone: "9876543214", skill: "Electrician", experience: 12, wage: 900, verified: true },
    { id: 6, name: "Manoj Das", phone: "9876543215", skill: "Carpenter", experience: 15, wage: 850, verified: true },
    { id: 7, name: "Santosh Yadav", phone: "9876543216", skill: "Mason", experience: 4, wage: 600, verified: false },
    { id: 8, name: "Prakash Tiwari", phone: "9876543217", skill: "Painter", experience: 7, wage: 550, verified: true },
    { id: 9, name: "Lal Babu", phone: "9876543218", skill: "Helper", experience: 1, wage: 350, verified: false },
    { id: 10, name: "Gopal Krishna", phone: "9876543219", skill: "Plumber", experience: 6, wage: 750, verified: true }
];

// App State
let workers = [];
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const workersGrid = document.getElementById('workersGrid');
const searchInput = document.getElementById('searchInput');
const filterChips = document.querySelectorAll('.chip');
const regModal = document.getElementById('regModal');
const openRegModalBtn = document.getElementById('openRegModal');
const closeRegModalBtn = document.getElementById('closeRegModal');
const tabBtns = document.querySelectorAll('.tab-btn');
const workerFields = document.getElementById('workerFields');
const ownerFields = document.getElementById('ownerFields');
const userRoleInput = document.getElementById('userRole');
const registrationForm = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');

// Initialize App
function init() {
    // Load workers from localStorage or use initial mock data
    const storedWorkers = localStorage.getItem('rozgar_workers');
    if (storedWorkers) {
        workers = JSON.parse(storedWorkers);
    } else {
        workers = [...initialWorkers];
        saveWorkers();
    }
    
    renderWorkers();
    setupEventListeners();
}

// Save to localStorage
function saveWorkers() {
    localStorage.setItem('rozgar_workers', JSON.stringify(workers));
}

// Get icon for skill
function getSkillIcon(skill) {
    const icons = {
        'Mason': 'fa-trowel-bricks',
        'Painter': 'fa-paint-roller',
        'Plumber': 'fa-wrench',
        'Electrician': 'fa-bolt',
        'Carpenter': 'fa-hammer',
        'Helper': 'fa-hands-holding-circle'
    };
    return icons[skill] || 'fa-user-gear';
}

// Render Worker Cards
function renderWorkers() {
    workersGrid.innerHTML = '';
    
    const filteredWorkers = workers.filter(worker => {
        const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              worker.skill.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = currentFilter === 'all' || worker.skill === currentFilter;
        return matchesSearch && matchesFilter;
    });

    if (filteredWorkers.length === 0) {
        workersGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No workers found matching your criteria</h3>
            </div>
        `;
        return;
    }

    filteredWorkers.forEach((worker, index) => {
        const initials = worker.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const delay = (index % 10) * 0.1; // Staggered animation
        
        const card = document.createElement('div');
        card.className = 'worker-card';
        card.style.animationDelay = `${delay}s`;
        
        card.innerHTML = `
            <div class="card-header">
                ${worker.verified ? `<div class="verification-badge"><i class="fas fa-check-circle"></i> Verified</div>` : ''}
                <div class="avatar">${initials}</div>
                <h3 class="worker-name">${worker.name}</h3>
                <div class="worker-skill">
                    <i class="fas ${getSkillIcon(worker.skill)}"></i> ${worker.skill}
                </div>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <span class="info-label">Experience</span>
                    <span class="info-value">${worker.experience} Years</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Contact</span>
                    <span class="info-value">••••••${worker.phone.substring(6)}</span>
                </div>
            </div>
            <div class="card-footer">
                <div class="wage">₹${worker.wage} <span>/ day</span></div>
                <button class="btn btn-primary" onclick="alert('Contact details revealed after employer login. Sign up to contact ${worker.name}.')">Hire</button>
            </div>
        `;
        
        workersGrid.appendChild(card);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderWorkers();
    });

    // Filtering
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            renderWorkers();
        });
    });

    // Modal Control
    openRegModalBtn.addEventListener('click', () => {
        regModal.classList.add('active');
    });

    // Add multiple trigger buttons if handling dynamic IDs
    document.querySelectorAll('[onclick="document.getElementById(\'openRegModal\').click()"]').forEach(btn => {
        btn.onclick = null; // Clear inline handler
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            regModal.classList.add('active');
            
            // Auto switch tabs based on button clicked
            if(btn.innerText.includes('Worker')) {
                document.querySelector('[data-tab="worker"]').click();
            } else if (btn.innerText.includes('Employer')) {
                document.querySelector('[data-tab="owner"]').click();
            }
        });
    });

    closeRegModalBtn.addEventListener('click', closeAndResetModal);

    regModal.addEventListener('click', (e) => {
        if (e.target === regModal) closeAndResetModal();
    });

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const role = btn.dataset.tab;
            userRoleInput.value = role;
            
            if (role === 'worker') {
                workerFields.classList.remove('hidden');
                ownerFields.classList.add('hidden');
                // Make worker fields required
                document.getElementById('skill').required = true;
                document.getElementById('experience').required = true;
                document.getElementById('wage').required = true;
                // Remove owner required
                document.getElementById('location').required = false;
            } else {
                workerFields.classList.add('hidden');
                ownerFields.classList.remove('hidden');
                // Remove worker fields required
                document.getElementById('skill').required = false;
                document.getElementById('experience').required = false;
                document.getElementById('wage').required = false;
                // Make owner required
                document.getElementById('location').required = true;
            }
        });
    });

    // Form Submission
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const role = userRoleInput.value;
        const name = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        
        if (role === 'worker') {
            const skill = document.getElementById('skill').value;
            const exp = document.getElementById('experience').value;
            const wage = document.getElementById('wage').value;
            
            const newWorker = {
                id: Date.now(),
                name: name,
                phone: phone,
                skill: skill,
                experience: parseInt(exp) || 0,
                wage: parseInt(wage) || 500,
                verified: false // New registrations need verification
            };
            
            workers.unshift(newWorker); // Add to beginning
            saveWorkers();
            renderWorkers();
        } else {
            // Employer registration logic (mock)
            console.log("Employer registered:", { name, phone });
        }
        
        // Show success message
        registrationForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
        document.querySelector('.role-tabs').classList.add('hidden');
        
        setTimeout(() => {
            closeAndResetModal();
        }, 2000);
    });
}

function closeAndResetModal() {
    regModal.classList.remove('active');
    setTimeout(() => {
        registrationForm.reset();
        registrationForm.classList.remove('hidden');
        successMessage.classList.add('hidden');
        document.querySelector('.role-tabs').classList.remove('hidden');
        document.querySelector('[data-tab="worker"]').click(); // Reset to worker tab
    }, 300);
}

// Start app
document.addEventListener('DOMContentLoaded', init);
