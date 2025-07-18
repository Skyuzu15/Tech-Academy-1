// Função para mostrar seções
        function showSection(sectionId) {
            // Esconder todas as seções
            var sections = document.querySelectorAll('.content-section');
            for (var i = 0; i < sections.length; i++) {
                sections[i].classList.remove('active');
            }
            
            // Remover classe active de todos os links
            var links = document.querySelectorAll('.nav-link');
            for (var i = 0; i < links.length; i++) {
                links[i].classList.remove('active');
            }
            
            // Mostrar seção selecionada
            document.getElementById(sectionId).classList.add('active');
            
            // Adicionar classe active ao link clicado
            event.target.classList.add('active');
        }

        // Função para demonstração
        function mostrarDemo(tipo) {
            var mensagens = {
                'jogos': 'Carregando catálogo de jogos...\n\n🎮 Aqui você encontraria:\n- Lista de jogos disponíveis\n- Sistema de categorias\n- Avaliações dos usuários\n- Jogos mais populares',
                'perfil': 'Acessando perfil do usuário...\n\n👤 Funcionalidades do perfil:\n- Dados pessoais\n- Histórico de jogos\n- Pontuação total\n- Configurações',
                'ranking': 'Carregando rankings...\n\n🏆 Sistema de ranking:\n- Ranking geral\n- Melhores jogadores\n- Pontuação semanal\n- Conquistas'
            };
            
            alert(mensagens[tipo]);
        }

        // Função para enviar mensagem
        function enviarMensagem() {
            var nome = document.getElementById('nome').value;
            var email = document.getElementById('email').value;
            var assunto = document.getElementById('assunto').value;
            var mensagem = document.getElementById('mensagem').value;
            
            // Validar se todos os campos estão preenchidos
            if (!nome || !email || !assunto || !mensagem) {
                alert('Por favor, preencha todos os campos!');
                return;
            }
            
            // Validar email básico
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido!');
                return;
            }
            
            alert('Mensagem enviada com sucesso!\n\nObrigado pelo contato, ' + nome + '!\nResponderemos em breve no e-mail: ' + email);
            
            // Limpar formulário
            document.getElementById('nome').value = '';
            document.getElementById('email').value = '';
            document.getElementById('assunto').value = '';
            document.getElementById('mensagem').value = '';
        }

        // Função para adicionar efeito aos cards (executada quando a página carrega)
        document.addEventListener('DOMContentLoaded', function() {
            var cards = document.querySelectorAll('.card, .team-member, .stat-card');
            
            for (var i = 0; i < cards.length; i++) {
                cards[i].addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                cards[i].addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            }
        });