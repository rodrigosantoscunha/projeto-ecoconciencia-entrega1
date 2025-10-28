/*
========================================================================
 Arquivo Principal de Scripts - EcoConsciência
------------------------------------------------------------------------
 Este arquivo contém todas as funcionalidades JavaScript do site.
 O código é inicializado após o carregamento completo do DOM
 usando um "ouvinte" principal.

 Funcionalidades:
 1. Menu Mobile (Hambúrguer) - Inclui ARIA para acessibilidade
 2. Máscaras de Formulário (iMask)
 3. Validação do Formulário de Cadastro (Entrega III)
 4. Roteamento SPA (Single Page Application) (Entrega III)
========================================================================
*/

/**
 * 1. INICIALIZAÇÃO GERAL
 * Adiciona um "ouvinte" que espera o HTML ser todo carregado
 * para então disparar todas as nossas funções de inicialização.
 */
document.addEventListener('DOMContentLoaded', () => {
    initMenuMobile();
    initFormMasks();
    initFormValidation();
    initSPARouting();
});

/*
========================================================================
 FUNCIONALIDADE 1: Menu Mobile (Hambúrguer)
 - Controla a abertura e fechamento do menu em telas pequenas.
 - Atualiza atributos ARIA para acessibilidade (Entrega IV).
========================================================================
*/
function initMenuMobile() {
    // Seleciona os botões e o menu (o <nav> deve ter id="main-navigation" no HTML)
    const menuToggle = document.querySelector('.menu-toggle'); // Botão Hambúrguer
    const menuClose = document.querySelector('.menu-close');   // Botão 'X'
    const mainNav = document.querySelector('#main-navigation'); // O Menu <nav>

    // Verifica se os elementos essenciais existem
    if (menuToggle && mainNav) {
        // --- Ação de Abrir o Menu ---
        menuToggle.addEventListener('click', () => {
            mainNav.classList.add('menu-open');
            // Informa ao leitor de tela que o menu está expandido
            menuToggle.setAttribute('aria-expanded', 'true');
        });
    }

    // Função auxiliar para fechar o menu (evita repetição)
    function closeMenu() {
        if (mainNav && menuToggle && mainNav.classList.contains('menu-open')) {
            mainNav.classList.remove('menu-open');
            // Informa ao leitor de tela que o menu está fechado
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // --- Ação de Fechar com o Botão 'X' ---
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    // --- Ação de Fechar ao Clicar em um Link (dentro do menu) ---
    if (mainNav) {
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            // Adiciona ouvinte a cada link DENTRO do <nav>
            link.addEventListener('click', closeMenu);
        });
    }

    // --- Ação de Fechar com a Tecla ESC ---
    document.addEventListener('keydown', (event) => {
        // Verifica se a tecla pressionada foi Escape E se o menu está aberto
        if (event.key === 'Escape' && mainNav && mainNav.classList.contains('menu-open')) {
            closeMenu();
        }
    });
}


/*
========================================================================
 FUNCIONALIDADE 2: Máscaras de Formulário (iMask)
 - Aplica máscaras de formatação nos campos de CPF, Telefone e CEP.
========================================================================
*/
function initFormMasks() {
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');

    // Só aplica a máscara se o campo existir na página atual
    if (cpfInput) {
        IMask(cpfInput, { mask: '000.000.000-00' });
    }
    if (telefoneInput) {
        IMask(telefoneInput, { mask: '(00) 00000-0000' });
    }
    if (cepInput) {
        IMask(cepInput, { mask: '00000-000' });
    }
}

/*
========================================================================
 FUNCIONALIDADE 3: Validação do Formulário de Cadastro (Entrega III)
 - Verifica os dados do formulário de cadastro antes do envio.
========================================================================
*/
function initFormValidation() {
    const formCadastro = document.getElementById('form-cadastro');

    // Só roda esta função se estivermos na página de cadastro
    if (!formCadastro) {
        return;
    }

    // Seleciona os campos que precisam de validação
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const cpfInput = document.getElementById('cpf'); // Reutiliza a variável das máscaras
    const telefoneInput = document.getElementById('telefone'); // Reutiliza a variável das máscaras
    const nascimento = document.getElementById('nascimento');
    const endereco = document.getElementById('endereco');
    const cepInput = document.getElementById('cep'); // Reutiliza a variável das máscaras
    const cidade = document.getElementById('cidade');
    const estado = document.getElementById('estado');
    const senha = document.getElementById('senha');
    const confirmaSenha = document.getElementById('confirma-senha');

    // Adiciona o "ouvinte" de envio do formulário
    formCadastro.addEventListener('submit', function(event) {
        
        // 1. Previne o envio padrão (recarregar a página)
        event.preventDefault(); 
        
        // 2. Limpa todos os erros antigos
        clearErrors();

        let hasError = false; // Variável de controle

        // --- Início das Verificações ---

        // Verificação: Nome
        if (nome.value.trim() === '') {
            showError(nome, 'Por favor, preencha seu nome completo.');
            hasError = true;
        }
        
        // Verificação: Email
        if (email.value.trim() === '') {
            showError(email, 'O campo e-mail é obrigatório.');
            hasError = true;
        } else if (!isValidEmail(email.value)) { // Adiciona validação de formato de email
             showError(email, 'Por favor, digite um e-mail válido.');
             hasError = true;
        }

        // Verificação: Senha (mínimo 8 caracteres)
        if (senha.value.length < 8) {
            showError(senha, 'A senha deve ter no mínimo 8 caracteres.');
            hasError = true;
        }

        // Verificação: Confirmação de Senha
        if (confirmaSenha.value === '') {
             showError(confirmaSenha, 'Confirme sua senha.');
             hasError = true;
        } else if (confirmaSenha.value !== senha.value) {
            showError(confirmaSenha, 'As senhas não conferem.');
            hasError = true;
        }
        
        // Verificação: CPF
        if (cpfInput.value.trim() === '') {
            showError(cpfInput, 'O campo CPF é obrigatório.');
            hasError = true;
        } else if (cpfInput.value.length < 14) { // Verifica se a máscara foi preenchida
             showError(cpfInput, 'CPF incompleto. Verifique os números.');
             hasError = true;
        }

        // Verificação: Telefone (opcional, mas bom ter)
        if (telefoneInput.value.trim() === '') {
            showError(telefoneInput, 'O campo Telefone é obrigatório.');
            hasError = true;
        } else if (telefoneInput.value.length < 15) { // Verifica se a máscara foi preenchida
             showError(telefoneInput, 'Telefone incompleto.');
             hasError = true;
        }

        // Verificação: Nascimento
        if (nascimento.value === '') {
            showError(nascimento, 'Data de nascimento é obrigatória.');
            hasError = true;
        }

        // Verificação: CEP
        if (cepInput.value.trim() === '') {
            showError(cepInput, 'O campo CEP é obrigatório.');
            hasError = true;
        } else if (cepInput.value.length < 9) { // Verifica se a máscara foi preenchida
             showError(cepInput, 'CEP incompleto.');
             hasError = true;
        }

        // Verificação: Endereço
        if (endereco.value.trim() === '') {
            showError(endereco, 'Endereço é obrigatório.');
            hasError = true;
        }

         // Verificação: Cidade
         if (cidade.value.trim() === '') {
            showError(cidade, 'Cidade é obrigatória.');
            hasError = true;
        }
        
        // Verificação: Estado
        if (estado.value === '') {
            showError(estado, 'Selecione um estado.');
            hasError = true;
        }

        // --- Fim das Verificações ---

        // 5. DECISÃO FINAL
        if (!hasError) {
            // Se não houver erros, exibe sucesso!
            alert('Cadastro realizado com sucesso! (Em um projeto real, aqui enviaria os dados para o servidor)');
            // formCadastro.submit(); // Descomente esta linha se quiser enviar o formulário de verdade
            // formCadastro.reset(); // Opcional: Limpa o formulário após o sucesso
        }
    });
}

/**
 * Função Auxiliar da Validação: showError
 * Exibe uma mensagem de erro abaixo do campo (input) e adiciona ARIA.
 */
function showError(input, message) {
    input.classList.add('input-error');
    // Adiciona ARIA para leitores de tela saberem que o campo é inválido
    input.setAttribute('aria-invalid', 'true'); 
    
    // Cria o elemento <small> para exibir a mensagem
    const errorElement = document.createElement('small');
    errorElement.className = 'error-message'; 
    errorElement.textContent = message;
    // Adiciona um ID único para a mensagem de erro (necessário para aria-describedby)
    const errorId = input.id + '-error';
    errorElement.id = errorId; 
    
    // Associa a mensagem de erro ao input via ARIA
    input.setAttribute('aria-describedby', errorId);

    // Insere a mensagem de erro logo após o campo (input)
    input.parentNode.appendChild(errorElement);
}

/**
 * Função Auxiliar da Validação: clearErrors
 * Remove todas as mensagens de erro e atributos ARIA relacionados a erros.
 */
function clearErrors() {
    const errorInputs = document.querySelectorAll('.input-error');
    errorInputs.forEach(input => {
        input.classList.remove('input-error');
        // Remove os atributos ARIA relacionados ao erro
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
    });

    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
}

/**
 * Função Auxiliar da Validação: isValidEmail
 * Verifica se uma string parece ser um formato de email válido.
 */
function isValidEmail(email) {
    // Expressão regular simples para validação de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


/*
========================================================================
 FUNCIONALIDADE 4: Roteamento SPA (Single Page Application) (Entrega III)
 - Carrega o conteúdo das páginas dinamicamente sem recarregar.
========================================================================
*/
function initSPARouting() {
    // Seleciona todos os links da navegação principal E outros links internos
    // que não devem causar recarregamento completo (ex: links em cards)
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="."], a[href^="#"]'); 
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');

            // 1. Verifica se é um link interno válido para SPA
            // Ignora links externos, links para a mesma página (#) ou links com target="_blank"
            if (href && !href.startsWith('#') && !href.startsWith('http') && link.getAttribute('target') !== '_blank') {
                
                // 2. Previne o recarregamento padrão da página
                event.preventDefault(); 
                
                // 3. Chama nossa função para carregar a página
                loadPage(href);
                
                // 4. Atualiza a URL na barra do navegador
                history.pushState(null, '', href);
            }
            // Se for um link de âncora (#) na mesma página, deixa o navegador rolar
            else if (href && href.startsWith('#')) {
               // Deixa o comportamento padrão acontecer
            }
        });
    });

    // 5. Ouve o evento de "voltar/avançar" do navegador
    window.addEventListener('popstate', () => {
        // Pega o caminho atual (ex: "/sobre.html") e carrega a página correspondente
        const currentPath = location.pathname + location.search + location.hash;
        loadPage(currentPath);
    });
}

/**
 * Função Auxiliar da SPA: loadPage
 * Busca o HTML da nova página e o injeta no container principal.
 */
async function loadPage(url) {
    try {
        // 1. Busca o arquivo HTML (ex: "sobre.html")
        // Adiciona um parâmetro para evitar cache em alguns navegadores (opcional)
        const response = await fetch(url + '?t=' + Date.now()); 
        
        // 2. Verifica se a requisição foi bem-sucedida (ex: 404)
        if (!response.ok) {
            // Se a página não for encontrada, navega da forma tradicional
            console.warn(`Página não encontrada (${response.status}): ${url}. Redirecionando...`);
            location.href = url;
            return;
        }

        // 3. Pega o conteúdo da página como texto
        const pageHtml = await response.text();
        
        // 4. Converte o texto HTML em um documento DOM "virtual"
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageHtml, 'text/html');

        // 5. Extrai o <main> e o <title> da página buscada
        // Tenta pegar #app-content primeiro (para o index), senão pega #main-content
        const newContent = doc.querySelector('#app-content') || doc.querySelector('#main-content');
        const newTitle = doc.querySelector('title');
        
        // 6. Seleciona o container da nossa SPA (pode ser #app-content ou #main-content na página atual)
        const appContent = document.getElementById('app-content') || document.getElementById('main-content');

        if (newContent && appContent) {
            // 7. MANIPULAÇÃO DO DOM:
            // Substitui o conteúdo antigo pelo novo
            appContent.innerHTML = newContent.innerHTML;
            
            // Atualiza o título da página na aba do navegador
            document.title = newTitle ? newTitle.textContent : 'EcoConsciência';
            
            // Rola a página para o topo
            window.scrollTo(0, 0);

            // Re-inicializa máscaras e validações se a nova página tiver formulários
            // (Isso garante que funcionem após a navegação SPA)
            initFormMasks(); 
            initFormValidation();

        } else {
            console.warn(`Container de conteúdo (#app-content ou #main-content) não encontrado na página atual ou na página carregada: ${url}. Redirecionando...`);
            location.href = url; // Fallback para carregamento normal
        }
        
    } catch (error) {
        console.error('Erro ao carregar a página via SPA:', error);
        location.href = url; // Fallback para carregamento normal em caso de erro
    }
}