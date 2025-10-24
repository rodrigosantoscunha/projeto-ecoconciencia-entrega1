document.addEventListener('DOMContentLoaded', function() {
    
    // Máscara para o campo de CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        IMask(cpfInput, {
            mask: '000.000.000-00'
        });
    }

    // Máscara para o campo de Telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        IMask(telefoneInput, {
            mask: '(00) 00000-0000'
        });
    }

    // Máscara para o campo de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        IMask(cepInput, {
            mask: '00000-000'
        });
    }

});

/* --- FUNCIONALIDADE DO MENU HAMBÚRGUER --- */

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mainNav = document.querySelector('.main-nav');

    // Verifica se os elementos existem antes de adicionar ouvintes
    if (menuToggle && mainNav) {
        // Abre o menu ao clicar no hambúrguer
        menuToggle.addEventListener('click', function() {
            mainNav.classList.add('menu-open');
        });
    }

    if (menuClose && mainNav) {
        // Fecha o menu ao clicar no 'X'
        menuClose.addEventListener('click', function() {
            mainNav.classList.remove('menu-open');
        });
    }

    // Opcional: Fechar o menu se clicar fora dele (em telas menores)
    // (Esta parte pode ser adicionada depois se necessário)

});