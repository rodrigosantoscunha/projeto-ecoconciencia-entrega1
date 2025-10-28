/*
========================================================================
 Arquivo Principal de Scripts - EcoConsciência
------------------------------------------------------------------------
 Este arquivo contém todas as funcionalidades JavaScript do site.
 O código é inicializado após o carregamento completo do DOM
 usando um "ouvinte" principal.

 Funcionalidades:
 1. Menu Mobile (Hambúrguer)
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
========================================================================
*/
function initMenuMobile() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.add('menu-open');
        });
    }

    if (menuClose && mainNav) {
        menuClose.addEventListener('click', () => {
            mainNav.classList.remove('menu-open');
        });
    }

    // Fecha o menu ao clicar em um link (importante para a SPA)
    if (mainNav) {
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('menu-open')) {
                    mainNav.classList.remove('menu-open');
                }
            });
        });
    }
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
    const cpfInput = document.getElementById('cpf');
    const nascimento = document.getElementById('nascimento');
    const endereco = document.getElementById('endereco');
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
        }

        // Verificação: Senha (mínimo 8 caracteres)
        if (senha.value.length < 8) {
            showError(senha, 'A senha deve ter no mínimo 8 caracteres.');
            hasError = true;
        }

        // Verificação: Confirmação de Senha
        if (confirmaSenha.value !== senha.value) {
            showError(confirmaSenha, 'As senhas não conferem.');
            hasError = true;
        }
        
        // Verificação: CPF
        if (cpfInput.value.trim() === '') {
            showError(cpfInput, 'O campo CPF é obrigatório.');
            hasError = true;
        } else if (cpfInput.value.length < 14) {
             showError(cpfInput, 'CPF incompleto. Verifique os números.');
             hasError = true;
        }

        // Verificação: Campos obrigatórios simples
        if (nascimento.value === '') {
            showError(nascimento, 'Data de nascimento é obrigatória.');
            hasError = true;
        }
        if (endereco.value.trim() === '') {
            showError(endereco, 'Endereço é obrigatório.');
            hasError = true;
        }
         if (cidade.value.trim() === '') {
            showError(cidade, 'Cidade é obrigatória.');
            hasError = true;
        }
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
        }
    });
}

/**
 * Função Auxiliar da Validação: showError
 * Exibe uma mensagem de erro abaixo do campo (input).
 */
function showError(input, message) {
    // Adiciona a classe 'input-error' ao campo para destacá-lo (vermelho)
    input.classList.add('input-error');

    // Cria o elemento <small> para exibir a mensagem
    const errorElement = document.createElement('small');
    errorElement.className = 'error-message'; // Adiciona uma classe para o CSS
    errorElement.textContent = message;

    // Insere a mensagem de erro logo após o campo (input)
    // .parentNode (é o <div class="form-group">)
    input.parentNode.appendChild(errorElement);
}

/**
 * Função Auxiliar da Validação: clearErrors
 * Remove todas as mensagens de erro e classes de destaque.
 */
function clearErrors() {
    // Remove todas as classes 'input-error'
    const errorInputs = document.querySelectorAll('.input-error');
    errorInputs.forEach(input => input.classList.remove('input-error'));

    // Remove todas as mensagens de erro <small>
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
}


/*
========================================================================
 FUNCIONALIDADE 4: Roteamento SPA (Single Page Application) (Entrega III)
 - Carrega o conteúdo das páginas dinamicamente sem recarregar.
========================================================================
*/
function initSPARouting() {
    // Seleciona todos os links da navegação principal
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');

            // 1. Verifica se é um link interno (não âncora, não externo)
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                // 2. Previne o recarregamento padrão da página
                event.preventDefault(); 
                
                // 3. Chama nossa função para carregar a página
                loadPage(href);
                
                // 4. Atualiza a URL na barra do navegador
                history.pushState(null, '', href);
            }
        });
    });

    // 5. Ouve o evento de "voltar/avançar" do navegador
    window.addEventListener('popstate', () => {
        // Carrega a página correspondente ao histórico
        // location.pathname nos dá a URL atual (ex: "/sobre.html")
        loadPage(location.pathname);
    });
}

/**
 * Função Auxiliar da SPA: loadPage
 * Busca o HTML da nova página e o injeta no container principal.
 */
async function loadPage(url) {
    try {
        // 1. Busca o arquivo HTML (ex: "sobre.html")
        const response = await fetch(url);
        
        // 2. Verifica se a requisição foi bem-sucedida (ex: 404)
        if (!response.ok) {
            // Se a página não for encontrada, navega da forma tradicional
            location.href = url;
            return;
        }

        // 3. Pega o conteúdo da página como texto
        const pageHtml = await response.text();
        
        // 4. Converte o texto HTML em um documento DOM "virtual"
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageHtml, 'text/html');

        // 5. Extrai APENAS o <main> e o <title> da página buscada
        const newContent = doc.querySelector('.main-content');
        const newTitle = doc.querySelector('title');
        
        // 6. Seleciona o container da nossa SPA
        const appContent = document.getElementById('app-content');

        if (newContent && appContent) {
            // 7. MANIPULAÇÃO DO DOM:
            // Substitui o conteúdo antigo pelo novo
            appContent.innerHTML = newContent.innerHTML;
            
            // Atualiza o título da página na aba do navegador
            document.title = newTitle ? newTitle.textContent : 'EcoConsciência';
            
            // Rola a página para o topo
            window.scrollTo(0, 0);
        } else {
            // Se não encontrar <main>, apenas recarrega (fallback)
            location.href = url;
        }
        
    } catch (error) {
        console.error('Erro ao carregar a página:', error);
        // Em caso de erro de JS, apenas navega da forma tradicional
        location.href = url;
    }
}