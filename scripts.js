/*
========================================================================
 Arquivo Principal de Scripts - EcoConsciência
------------------------------------------------------------------------
 Funcionalidades:
 1. Menu Mobile (Hambúrguer) - Inclui ARIA
 2. Acessibilidade do Dropdown (Teclado) - Entrega IV (ESC Corrigido v2)
 3. Máscaras de Formulário (iMask)
 4. Validação do Formulário de Cadastro (Entrega III + ARIA)
 5. Roteamento SPA (Single Page Application) (Entrega III)
 6. Modo Escuro (Dark Mode) - Entrega IV
========================================================================
*/

/**
 * 1. INICIALIZAÇÃO GERAL
 */
document.addEventListener('DOMContentLoaded', () => {
    initMenuMobile();
    initDropdownAccessibility();
    initFormMasks();
    initFormValidation();
    initSPARouting();
    initDarkMode(); // <-- Chamada da nova função
});

/*
========================================================================
 FUNCIONALIDADE 1: Menu Mobile (Hambúrguer)
========================================================================
*/
function initMenuMobile() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mainNav = document.querySelector('#main-navigation');

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', () => {
        mainNav.classList.add('menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
    });

    function closeMenu() {
        if (mainNav.classList.contains('menu-open')) {
            mainNav.classList.remove('menu-open');
            if(menuToggle) {
                 menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Listener global para ESC fechar o menu mobile TAMBÉM
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mainNav.classList.contains('menu-open')) {
             const dropdownToggle = document.getElementById('projetos-menu-label');
             const isDropdownExpanded = dropdownToggle?.getAttribute('aria-expanded') === 'true';
             if (!isDropdownExpanded) {
                 closeMenu();
                 if (menuToggle) menuToggle.focus();
             }
        }
    });
}


/*
========================================================================
 FUNCIONALIDADE 2: Acessibilidade do Dropdown (Teclado) - Entrega IV
========================================================================
*/
function initDropdownAccessibility() {
    const dropdownToggle = document.getElementById('projetos-menu-label');
    const dropdownMenu = document.getElementById('projetos-submenu');

    if (!dropdownToggle || !dropdownMenu) {
        return;
    }

    function openMenu() {
        dropdownToggle.setAttribute('aria-expanded', 'true');
        dropdownMenu.classList.add('dropdown-visible');
    }

    function closeMenu() {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.remove('dropdown-visible');
    }

    dropdownToggle.addEventListener('click', (event) => {
        event.preventDefault();
        const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
            dropdownMenu.querySelector('a')?.focus();
        }
    });

    dropdownToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
            event.preventDefault();
            const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
            if (isExpanded && event.key !== 'ArrowDown') {
                 closeMenu();
            } else {
                openMenu();
                dropdownMenu.querySelector('a')?.focus();
            }
        }
        // ESC é tratado globalmente
    });

    dropdownMenu.addEventListener('keydown', (event) => {
        const items = Array.from(dropdownMenu.querySelectorAll('a'));
        const currentIndex = items.indexOf(document.activeElement);

        if (event.key === 'ArrowUp') {
             event.preventDefault();
             if (currentIndex > 0) {
                 items[currentIndex - 1].focus();
             } else {
                 closeMenu();
                 dropdownToggle.focus();
             }
        } else if (event.key === 'ArrowDown') {
             event.preventDefault();
             if (currentIndex < items.length - 1) {
                 items[currentIndex + 1].focus();
             } else {
                 items[0].focus();
             }
        }
         // ESC é tratado globalmente
         // TAB é tratado pelo focusin
    });

    // Listener GLOBAL para ESC fechar o dropdown (MAIS ROBUSTO)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const isDropdownExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
            if (isDropdownExpanded) {
                event.preventDefault();
                event.stopPropagation();
                closeMenu();
                dropdownToggle.focus();
            }
        }
    });


    // Fecha o menu se clicar FORA dele
    document.addEventListener('click', (event) => {
        if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            if (dropdownToggle.getAttribute('aria-expanded') === 'true') {
                 closeMenu();
            }
        }
    });

     // Fecha o menu se o FOCO sair dele
     document.addEventListener('focusin', () => {
         setTimeout(() => {
             if (!dropdownToggle.contains(document.activeElement) && !dropdownMenu.contains(document.activeElement)) {
                 if (dropdownToggle.getAttribute('aria-expanded') === 'true') {
                    closeMenu();
                 }
             }
         }, 10);
     });
}


/*
========================================================================
 FUNCIONALIDADE 3: Máscaras de Formulário (iMask)
========================================================================
*/
function initFormMasks() {
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');
    if (cpfInput) IMask(cpfInput, { mask: '000.000.000-00' });
    if (telefoneInput) IMask(telefoneInput, { mask: '(00) 00000-0000' });
    if (cepInput) IMask(cepInput, { mask: '00000-000' });
}

/*
========================================================================
 FUNCIONALIDADE 4: Validação do Formulário de Cadastro
========================================================================
*/
function initFormValidation() {
    const formCadastro = document.getElementById('form-cadastro');
    if (!formCadastro) return;
    const fields = {
        nome: document.getElementById('nome'), email: document.getElementById('email'),
        cpfInput: document.getElementById('cpf'), telefoneInput: document.getElementById('telefone'),
        nascimento: document.getElementById('nascimento'), senha: document.getElementById('senha'),
        confirmaSenha: document.getElementById('confirma-senha'), cepInput: document.getElementById('cep'),
        endereco: document.getElementById('endereco'), cidade: document.getElementById('cidade'),
        estado: document.getElementById('estado')
    };

    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault(); clearErrors(); let hasError = false;
        if (!fields.nome || fields.nome.value.trim() === '') { showError(fields.nome, 'Nome completo obrigatório.'); hasError = true; }
        if (!fields.email || fields.email.value.trim() === '') { showError(fields.email, 'E-mail obrigatório.'); hasError = true; }
        else if (!isValidEmail(fields.email.value)) { showError(fields.email, 'E-mail inválido.'); hasError = true; }
        if (!fields.cpfInput || fields.cpfInput.value.trim() === '') { showError(fields.cpfInput, 'CPF obrigatório.'); hasError = true; }
        else if (fields.cpfInput.value.length < 14) { showError(fields.cpfInput, 'CPF incompleto.'); hasError = true; }
        if (!fields.telefoneInput || fields.telefoneInput.value.trim() === '') { showError(fields.telefoneInput, 'Telefone obrigatório.'); hasError = true; }
        else if (fields.telefoneInput.value.length < 15) { showError(fields.telefoneInput, 'Telefone incompleto.'); hasError = true; }
        if (!fields.nascimento || fields.nascimento.value === '') { showError(fields.nascimento, 'Data de nascimento obrigatória.'); hasError = true; }
        if (!fields.senha || fields.senha.value.length < 8) { showError(fields.senha, 'Senha deve ter no mínimo 8 caracteres.'); hasError = true; }
        if (!fields.confirmaSenha || fields.confirmaSenha.value === '') { showError(fields.confirmaSenha, 'Confirme sua senha.'); hasError = true; }
        else if (fields.confirmaSenha.value !== fields.senha.value) { showError(fields.confirmaSenha, 'As senhas não conferem.'); hasError = true; }
        if (!fields.cepInput || fields.cepInput.value.trim() === '') { showError(fields.cepInput, 'CEP obrigatório.'); hasError = true; }
        else if (fields.cepInput.value.length < 9) { showError(fields.cepInput, 'CEP incompleto.'); hasError = true; }
        if (!fields.endereco || fields.endereco.value.trim() === '') { showError(fields.endereco, 'Endereço obrigatório.'); hasError = true; }
        if (!fields.cidade || fields.cidade.value.trim() === '') { showError(fields.cidade, 'Cidade obrigatória.'); hasError = true; }
        if (!fields.estado || fields.estado.value === '') { showError(fields.estado, 'Selecione um estado.'); hasError = true; }
        if (!hasError) { alert('Cadastro realizado com sucesso!'); }
    });
}

function showError(input, message) {
    if (!input || !input.parentNode) return; // Segurança extra
    input.classList.add('input-error'); input.setAttribute('aria-invalid', 'true');
    const errorId = input.id + '-error'; input.setAttribute('aria-describedby', errorId);
    const oldError = input.parentNode.querySelector('#' + errorId); if(oldError) oldError.remove();
    const errorElement = document.createElement('small'); errorElement.className = 'error-message';
    errorElement.id = errorId; errorElement.textContent = message; input.parentNode.appendChild(errorElement);
}

function clearErrors() {
    document.querySelectorAll('.input-error').forEach(input => {
        input.classList.remove('input-error'); input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby');
    });
    document.querySelectorAll('.error-message').forEach(message => message.remove());
}

function isValidEmail(email) { const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return regex.test(email); }

/*
========================================================================
 FUNCIONALIDADE 5: Roteamento SPA (Single Page Application)
========================================================================
*/
function initSPARouting() {
    // Delegação de eventos no body para capturar cliques em links internos dinamicamente carregados
    document.body.addEventListener('click', (event) => {
        // Encontra o link clicado, mesmo que o clique seja num elemento filho (ex: <i> dentro de <a>)
        const link = event.target.closest('a');

        if (link) {
            const href = link.getAttribute('href');
            // Verifica se é um link interno válido para SPA
            if (href && !href.startsWith('#') && !href.startsWith('http') && link.getAttribute('target') !== '_blank') {
                event.preventDefault(); // Impede navegação padrão
                const currentUrl = location.pathname + location.search + location.hash;
                const targetUrl = new URL(href, location.origin).pathname + new URL(href, location.origin).search + new URL(href, location.origin).hash;

                if (targetUrl !== currentUrl) {
                     loadPage(href);
                     history.pushState(null, '', href);
                } else {
                    window.scrollTo(0, 0); // Rola para o topo se clicar no link da página atual
                }
            }
            // Deixa links de âncora (#) e externos funcionarem normalmente
        }
    });

    // Ouve o evento de "voltar/avançar" do navegador
    window.addEventListener('popstate', () => {
        const currentPath = location.pathname + location.search + location.hash;
        // Evita carregar a página inicial se o estado for nulo (pode acontecer em alguns casos)
        if (currentPath !== '/') {
             loadPage(currentPath);
        } else {
             // Opcional: Tratamento específico para voltar à página inicial,
             // talvez recarregar para garantir estado inicial limpo?
             loadPage(currentPath); // Ou location.reload();
        }
    });
}


async function loadPage(url) {
    try {
        const response = await fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now()); // Cache bust
        if (!response.ok) { console.warn(`Página não encontrada (${response.status}): ${url}. Redirecionando...`); location.href = url; return; }
        const pageHtml = await response.text();
        const parser = new DOMParser(); const doc = parser.parseFromString(pageHtml, 'text/html');
        const newContent = doc.querySelector('#app-content') || doc.querySelector('#main-content');
        const newTitle = doc.querySelector('title');
        const appContent = document.getElementById('app-content') || document.getElementById('main-content');

        if (newContent && appContent) {
            appContent.innerHTML = newContent.innerHTML;
            document.title = newTitle ? newTitle.textContent : 'EcoConsciência';
            window.scrollTo(0, 0);
            // Re-inicializa JS que pode ser necessário para o novo conteúdo
            initFormMasks();
            initFormValidation();
            // initDropdownAccessibility(); // Não precisa, pois está no header
            // initMenuMobile(); // Não precisa, pois está no header
            // initDarkMode(); // Não precisa, pois o botão está no footer e a classe no body
        } else { console.warn(`Container de conteúdo não encontrado: ${url}. Redirecionando...`); location.href = url; }
    } catch (error) { console.error('Erro ao carregar página via SPA:', error); location.href = url; }
}

/*
========================================================================
 FUNCIONALIDADE 6: Modo Escuro (Dark Mode) - Entrega IV
========================================================================
*/
function initDarkMode() {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;
    const icon = themeToggleButton ? themeToggleButton.querySelector('i') : null;

    if (!themeToggleButton || !icon) { return; }

    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
            themeToggleButton.setAttribute('aria-label', 'Alternar para tema claro');
        } else {
            body.classList.remove('dark-mode');
            icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
            themeToggleButton.setAttribute('aria-label', 'Alternar para tema escuro');
        }
    }

    let currentThemeIsDark = localStorage.getItem('theme') === 'dark';

    // Aplica preferência do SO no carregamento inicial, se não houver nada salvo
     if (localStorage.getItem('theme') === null) {
         currentThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
         // Salva a preferência inicial baseada no SO para consistência
         // localStorage.setItem('theme', currentThemeIsDark ? 'dark' : 'light');
     }

    applyTheme(currentThemeIsDark); // Aplica o tema inicial

    themeToggleButton.addEventListener('click', () => {
        currentThemeIsDark = !currentThemeIsDark;
        applyTheme(currentThemeIsDark);
        localStorage.setItem('theme', currentThemeIsDark ? 'dark' : 'light');
    });

    // Ouve mudanças de preferência do Sistema Operacional
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        // Só aplica se o usuário NÃO tiver definido uma preferência manualmente no site
        if (localStorage.getItem('theme') === null) {
             currentThemeIsDark = event.matches;
             applyTheme(currentThemeIsDark);
        }
    });
}