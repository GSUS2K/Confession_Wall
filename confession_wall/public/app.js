const API = ''

let currentFilter = 'all';

const state = {
    user: null,
    confessions: [],
    modalMode: null,
    activeId: null
}

const dom = {
    authArea: document.getElementById('authArea'),
    hero: document.getElementById('hero'),
    app: document.getElementById('app'),
    confessionText: document.getElementById('confessionText'),
    secretCode: document.getElementById('secretCode'),
    charCount: document.getElementById('charCount'),
    postError: document.getElementById('postError'),
    submitBtn: document.getElementById('submitBtn'),
    feed: document.getElementById('feed'),
    feedCount: document.getElementById('feedCount'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modalTitle'),
    modalEditFields: document.getElementById('modalEditFields'),
    editText: document.getElementById('editText'),
    modalCode: document.getElementById('modalCode'),
    modalError: document.getElementById('modalError'),
    modalConfirmBtn: document.getElementById('modalConfirmBtn'),
    toast: document.getElementById('toast')
}

async function init(){
    await checkAuth();
    await loadConfessions();
    attachListeners();
    easterEggs();
}

async function  checkAuth() {
    try{
        const res = await apiFetch('/auth/me')
        const data = await res.json();

        if(data.loggedIn){
            state.user = data.user;
            renderAuthUI(true);
            showApp()
        }
        else{
            renderAuthUI(false)
            showHero();
        }
    }
    catch{
        renderAuthUI(false)
        showHero()
    //     document.body.innerHTML = `
    //   <div style="
    //     display: flex;
    //     flex-direction: column;
    //     align-items: center;
    //     justify-content: center;
    //     height: 100vh;
    //     gap: 16px;
    //     font-family: var(--font-body);
    //     color: var(--text-dim);
    //     text-align: center;
    //   ">
    //     <p style="font-size: 3rem">🔌</p>
    //     <h2 style="font-family: var(--font-title); color: var(--text)">Server is offline</h2>
    //     <p>The confession wall is currently down. Try again later.</p>
    //     <button onclick="location.reload()" style="
    //       margin-top: 8px;
    //       background: var(--neon);
    //       border: none;
    //       border-radius: 8px;
    //       color: #fff;
    //       padding: 10px 24px;
    //       font-family: var(--font-body);
    //       font-size: 0.9rem;
    //       cursor: pointer;
    //     ">Try Again</button>
    //   </div>
    // `;
    }
}

function showApp()
{
    dom.hero.style.display = "none";
    dom.app.style.display = 'grid';
}

function showHero()
{
    dom.hero.style.display = "flex";
    dom.app.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', init);

function renderAuthUI(loggedIn){
    if(loggedIn && state.user){
        dom.authArea.innerHTML=`
        <div class="user-chip">
        <img src="${state.user.avatar}" alt="" onerror="this.style.display='none'">
        <span>${state.user.displayName}</span>
        </div>
        <button class="btn-logout" onclick="logout()">Sign out</button>
        <a href="https://github.com/GSUS2K" target="_blank" class="github-link">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        GitHub
        </a>
        `;
    // } else{
    //     dom.authArea.innerHTML = `
    //     <button class="btn-google" onclick="loginWithGoogle()">
    //     <img src="https://www.google.com/favicon.ico" width="18" height="18" />
    //     Sign In
    //     </button>
    //     `
    // }
    } else{
        dom.authArea.innerHTML = `
         <a href="https://github.com/GSUS2K" target="_blank" class="github-link">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        GitHub
        </a>
        `
    }
}

function loginWithGoogle(){
    window.location.href = '/auth/google';
}

async function logout() {
    try{
        await apiFetch('/auth/logout', {method: 'POST'})
    }
    catch {}
    state.user = null;
    renderAuthUI(false)
    showHero()
    showToast('Signed out successfully!', 'success')
}

async function loadConfessions(){
    dom.feed.innerHTML = `<p style = "color:var(--text-dim); text-align: center; padding: 40px">Loading...</p>`;
    try{
        const res = await apiFetch('/confessions')
        const data = await res.json()

        if(data.success){
            state.confessions = data.data;
            renderFeed();
        }
    }
    catch{
        dom.feed.innerHTML = `<p style="color: var(--error); text-align: center; padding: 40px">Failed to load. Is the server running?</p>`;
    }
}

function renderFeed(){
     const myConfessions = JSON.parse(localStorage.getItem('myConfessions') || '[]');
    //   console.log('myConfessions:', myConfessions);
//   console.log('currentFilter:', currentFilter);
//   console.log('all confessions ids:', state.confessions.map(c => c._id));
  
    let confessions = state.confessions;
    // if (currentFilter === 'mine') {
    //     confessions = confessions.filter(c => myConfessions.includes(c._id));
    //     // console.log('filtered:', confessions);
    // }

    if (currentFilter === 'mine') {
    confessions = confessions.filter(c => c.isOwner);
    }

    dom.feed.textContent = `(${state.confessions.length})`;

    if(!state.confessions.length){
        dom.feed.innerHTML = `<p style="color:var(--text-dim); text-align: center; padding: 40px">No confessions yet. Be the first! 👀</p>`;
        return;
    }

    dom.feed.innerHTML = '';
    confessions.forEach((c, i)=>{
        const card = createCard(c);
        card.style.animationDelay = `${i*60}ms`;
        dom.feed.appendChild(card);
    })
    const reacted = JSON.parse(localStorage.getItem('reacted') || '{}');
Object.keys(reacted).forEach(key => {
  const [id, type] = key.split(':');
  const card = dom.feed.querySelector(`[data-id="${id}"]`);
  if (card) {
    const btn = card.querySelector(`[onclick="react('${id}', '${type}')"]`);
    if (btn) btn.classList.add('reacted');
  }
})
}

function createCard(c){
    const div = document.createElement('div');
    div.className='card';
    div.dataset.id = c._id;

if(c.reactions.like>=10 || c.reactions.love>=10 || c.reactions.laugh>=10 || c.reactions.cry>=10) div.classList.add('hot');

// const isLoggedIn = !!state.user;

const myConfessions = JSON.parse(localStorage.getItem('myConfessions') || '[]');
// const isMine = myConfessions.includes(c._id);
const isMine = c.isOwner;

const edited = c.updatedAt ? `<span class="card-edited">edited</span>`: '';
const time = formatDate(c.createdAt);

div.innerHTML=`
<p class = "card-text">${escHtml(c.text)}</p>
<div class="card-meta">${time} ${edited}</div>
<div class="card-reactions">
<button class="react-btn" onclick="react('${c._id}', 'like')">
<span class="emoji">👍</span>
<span id="like-${c._id}">${c.reactions.like}</span>
</button>
<button class="react-btn" onclick="react('${c._id}', 'love')">
<span class="emoji">❤️</span>
<span id="love-${c._id}">${c.reactions.love}</span>
</button>
<button class="react-btn" onclick="react('${c._id}', 'laugh')">
<span class="emoji">😆</span>
<span id="laugh-${c._id}">${c.reactions.laugh}</span>
</button>
<button class="react-btn" onclick="react('${c._id}', 'cry')">
<span class="emoji">😭</span>
<span id="cry-${c._id}">${c.reactions.cry || 0}</span>
</button>
${isMine ? `
    <div class="card-actions">
    <button class="action-btn" onclick="openEditModal('${c._id}')">𝌡 Edit</button>
    <button class="action-btn delete" onclick="openDeleteModal('${c._id}')">🚮 Delete</button>
    </div>
    `:''}
    </div>
`;

return div;

}

async function submitConfession() {
    hideError(dom.postError);

    const text = dom.confessionText.value.trim();
    const secretCode = dom.secretCode.value;

    if(text.length<5) return showError(dom.postError, 'Confession must be at least 5 characters to be posted!')
    if(secretCode.length<4) return showError(dom.postError, 'Secret code must be at least 4 characters!')

    dom.submitBtn.disabled = true;
    dom.submitBtn.textContent = 'Posting...'

    try{
        const res = await apiFetch('/confessions', {
            method:'POST',
            body: JSON.stringify({text, secretCode})
        })
        const data = await res.json()

        if(!res.ok){
            showError(dom.postError, data.error || 'Failed to post!')
            return;
        }

        const myConfessions = JSON.parse(localStorage.getItem('myConfessions') || '[]');
        myConfessions.push(data.data._id);
        localStorage.setItem('myConfessions', JSON.stringify(myConfessions));
        
        state.confessions.unshift(data.data);
        renderFeed()

        dom.confessionText.value = '';
        dom.secretCode.value = '';
        dom.charCount.textContent = '0/1000';
        const messages = [
        'The wall knows your secret 👀',
        'Spilled! 🫗',
        'No take backs 😈',
        'The internet never forgets 💀',
        'Confession posted! 🕯',
        'We all saw that 😳',
        'Bold move 😅',
        'Said what you said 💅',
        ];

        const random = messages[Math.floor(Math.random() * messages.length)];
        showToast(random, 'success');
        // showToast('Confession posted! 💣', 'success');
    }
    catch{
        showError(dom.postError, 'Network error. Check if the server is running?')
    }
    finally{
        dom.submitBtn.disabled =false;
        dom.submitBtn.textContent='Confess Anonymously';
    }
}

// const reacted = {}
const reacted = JSON.parse(localStorage.getItem('reacted') || '{}');

async function react(id, type){
    const key = `${id}:${type}`;
    if(reacted[key]) return showToast('Already reacted! 😾', 'warning');

    try{
        const res = await apiFetch(`/confessions/${id}/react`,{
            method: 'POST',
            body: JSON.stringify({type})
        })
        const data = await res.json()

        if(res.ok){
            reacted[key]=true;
            localStorage.setItem('reacted', JSON.stringify(reacted));

            const countEl = document.getElementById(`${type}-${id}`);
            if(countEl) countEl.textContent = data.reactions[type];

            const card = dom.feed.querySelector(`[data-id="${id}"]`);
            if(card){
                const btn = card.querySelector(`[onclick="react('${id}','${type}')"]`);
                // console.log('adding reacted to btn:', btn);

                if (btn) btn.classList.add('reacted');
            } 

            if(type=== 'like'&& data.reactions.like>=10){
            const card = dom.feed.querySelector(`[data-id="${id}"]`);
            if(card) card.classList.add('hot')
            }
        
            const idx = state.confessions.findIndex(c=>c._id === id);
            if(idx!== -1) state.confessions[idx].reactions =data.reactions;
        }
    }
    catch{
        showToast('Failed to react!', 'error');
    }
}

function openEditModal(id){
    const confession = state.confessions.find(c=>c._id ===id);
    if(!confession) return;

    state.modalMode = 'edit';
    state.activeId = id;

    dom.modalTitle.textContent = '✏️ Edit Confession';
    dom.modalEditFields.style.display = 'block';
    dom.editText.value = confession.text;
    dom.modalCode.value = '';
    hideError(dom.modalError);
    dom.modalConfirmBtn.textContent='Save Changes';
    dom.modalConfirmBtn.onclick=confirmEdit;

    openModal()
}

function openDeleteModal(id){
    state.modalMode = 'delete';
    state.activeId = id;

    dom.modalTitle.textContent='🗑️ Delete Confession'
    dom.modalEditFields.style.display='none'
    dom.modalCode.value=''
    hideError(dom.modalError)
    dom.modalConfirmBtn.textContent='Delete Forever'
    dom.modalConfirmBtn.onclick=confirmDelete;

    openModal()
}

function openModal(){
    dom.modalBackdrop.style.display='block';
    dom.modal.style.display='flex'
    dom.modalCode.focus();
    document.addEventListener('keydown',handleEsc);
}

function closeModal(){
    dom.modalBackdrop.style.display='none';
    dom.modal.style.display='none'
    document.removeEventListener('keydown',handleEsc)
    state.modalMode=null;
    state.activeId=null;
}

function handleEsc(e){
    if(e.key==='Escape') closeModal();
}

async function confirmEdit() {
    hideError(dom.modalError)
    const text = dom.editText.value.trim()
    const secretCode = dom.modalCode.value;

    if(text.length<5) return showError(dom.modalError, 'Confession must be at least 5 characters to be posted!')
    if(secretCode.length<4) return showError(dom.modalError, 'Secret code must be at least 4 characters!')

    dom.modalConfirmBtn.disabled=true;
    dom.modalConfirmBtn.textContent='Saving...'

    try{
        const res = await apiFetch(`/confessions/${state.activeId}`,{
            method: 'PUT',
            body: JSON.stringify({text,secretCode})
        })
        const data = await res.json()

        if(!res.ok) return showError(dom.modalError, data.error || 'Failed to update!')

        const idx = state.confessions.findIndex(c=>c._id === state.activeId)
        if(idx!==-1) state.confessions[idx]=data.data;
        renderFeed();
        closeModal()
        showToast('Confession updated! ✏️','success')    
    }
    catch{
        showError(dom.modalError, 'Network error!')
    }
    finally{
        dom.modalConfirmBtn.disabled=false;
        dom.modalConfirmBtn.textContent='Save Changes'
    }
}

async function confirmDelete() {
    hideError(dom.modalError)
    const secretCode=dom.modalCode.value;

    if(secretCode.length<4) return showError(dom.modalError, 'Secret code must be at least 4 characters!')

        dom.modalConfirmBtn.disabled=true;
        dom.modalConfirmBtn.textContent='Deleting...'

        try{
            const res= await apiFetch(`/confessions/${state.activeId}`,{
                method: 'DELETE',
                body: JSON.stringify({secretCode})
            })
            const data = await res.json()

            if(!res.ok) return showError(dom.modalError, data.error || 'Failed to delete!')
            
            state.confessions = state.confessions.filter(c=>c._id!== state.activeId)
            renderFeed()
            closeModal()
            showToast('Confession deleted! 🗑️','success')
        }
        catch{
            showError(dom.modalError,'Network error!')
        }
        finally{
            dom.modalConfirmBtn.disabled=false;
            dom.modalConfirmBtn.textContent='Delete Forever'
        }
}

function filterFeed(type) {
  currentFilter = type;

  document.getElementById('filterAll').classList.toggle('active', type === 'all');
  document.getElementById('filterMine').classList.toggle('active', type === 'mine');

  renderFeed();
}

async function apiFetch(path, options = {}) {
    return fetch(`${API}${path}`,{
        credentials:'include',
        headers:{
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...(options.headers || {})
        },
        ...options
    })
}

function escHtml(str) {
    return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDate(dateStr){
    const d = new Date(dateStr);
    const now = new Date()
    const diff = (now-d)/1000;

    if(diff<60) return 'just now';
    if(diff<3600) return `${Math.floor(diff/60)}m ago`
    if(diff<86400) return `${Math.floor(diff/3600)}h ago`
    if(diff<604800) return `${Math.floor(diff/86400)}d ago`
    return d.toLocaleDateString('en-US',{month:'short',day:'numeric'})
}

function showError(el,msg){
    el.textContent=msg;
    el.classList.add('visible')
}

function hideError(el){
    el.textContent=''
    el.classList.remove('visible');
}

let toastTimer;
function showToast(msg, type='')
{
    // dom.toast.textContent=msg;
    // dom.toast.className=`toast ${type}`
    // dom.toast.classList.add('show')
    // toastTimer=setTimeout(() => {
    //     dom.toast.classList.remove('show')
    // }, 3000);

    clearTimeout(toastTimer);
  dom.toast.innerHTML = `
    <span>${msg}</span>
    <div class="toast-progress"></div>
  `;
  dom.toast.className = `toast ${type}`;
  dom.toast.classList.add('show');
  toastTimer = setTimeout(() => dom.toast.classList.remove('show'), 3000);
}

function attachListeners(){
    dom.confessionText.addEventListener('input', ()=>{
        dom.charCount.textContent=`${dom.confessionText.value.length}/1000`
    })

    dom.modalCode.addEventListener('keydown',(e)=>{
        if(e.key==='Enter') dom.modalConfirmBtn.click();
    })

    dom.secretCode.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
    submitConfession();
     }
    });

    dom.confessionText.addEventListener('input',()=>{
        if(dom.confessionText.value.toLowerCase().includes('confess')){
            dom.submitBtn.style.background = `linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff)`
            dom.submitBtn.style.backgroundSize = '300%'
        }
        else{
            dom.submitBtn.style.background='';
            dom.submitBtn.style.backgroundSize = ''
        }
    })
}

function easterEggs(){

    let idleTimer;
const ghost = document.createElement('div');
ghost.textContent = '👻';
ghost.style.cssText = `
  position: fixed;
  font-size: 1.5rem;
  pointer-events: none;
  z-index: 9999;
  transition: left 0.1s ease, top 0.1s ease;
  display: none;
`;
document.body.appendChild(ghost);

document.addEventListener('mousemove', (e) => {
  clearTimeout(idleTimer);
//   ghost.style.display = 'none';
    ghost.style.left = e.clientX - 10 + 'px';
    ghost.style.top  = e.clientY - 10 + 'px';

  idleTimer = setTimeout(() => {
    ghost.style.display = 'block';
    document.body.style.cursor = 'none';
    
    const style = document.createElement('style');
    style.id = 'ghost-cursor-style';
    style.textContent = '* { cursor: none !important; }';
    document.head.appendChild(style);
  }, 60000);

//   ghost.style.left = e.clientX + 10 + 'px';
//   ghost.style.top  = e.clientY + 10 + 'px';
});

    let logoClicks = 0;
    // let randomHex = ""
    //         const arr = ['a','b','c','d','e','f',1,2,3,4,5,6,7,8,9,0];

    //         for(let i=0; i<6; i++)
    //         {
    //             const index = Math.floor(Math.random()*arr.length);
    //             randomHex += arr[index];
    //         }
    const colors = ['#7c3aed', '#ff6b6b', '#ffd93d', '#4d96ff', '#ff6bff']
    document.getElementById('logo').addEventListener('click',()=>{
        logoClicks++;
        if(logoClicks>=5){
            logoClicks=0;
            const color = colors[Math.floor(Math.random()* colors.length)]
            document.documentElement.style.setProperty('--neon', color)
            document.documentElement.style.setProperty('--neon-glow', color+'55')
            document.documentElement.style.setProperty('--neon-soft', color+'22')
            showToast('🎨 Theme changed!','success')
        }
    })

const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
let konamiIndex = 0;
document.addEventListener('keydown',(e)=>{
    if(e.key===konami[konamiIndex]){
        konamiIndex++;
        if(konamiIndex===konami.length){
            konamiIndex=0;
            launchConfetti();
            showToast('🎉 KONAMI CODE ACTIVATED!','success')
        }
    }
    else{
        konamiIndex=0;
    }
})
}

function launchConfetti(){
    const colors = ['#7c3aed', '#ff6b6b', '#ffd93d', '#4d96ff', '#ff6bff']
    for(let i=0; i<100; i++)
    {
        const confetti = document.createElement('div')
        confetti.style.cssText=`
        position:fixed;
        width: ${Math.random()*10 + 5}px;
        height: ${Math.random()*10 +5}px;
        background: ${colors[Math.floor(Math.random()*colors.length)]};
        left: ${Math.random()*100}vw;
        top: -20px;
        border-radius: ${Math.random()>0.5?'50%':'0'};
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${Math.random()*2+1}s ease forwards;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => {
            confetti.remove()
        }, 3000);
    }
}
