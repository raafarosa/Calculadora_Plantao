# 🏥 Calculadora de Plantão

Uma ferramenta web moderna e eficiente para profissionais que precisam gerenciar e calcular ganhos de plantões extras. O projeto calcula automaticamente horas líquidas, adicionais de 50%, 100% (domingos e feriados) e adicional noturno com fator de redução.

![Versão](https://img.shields.io/badge/version-2.0.0-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)

## ✨ Funcionalidades

- **Cálculo Automático:** Baseado no salário bruto e jornada de 220h.
- **Detecção de Feriados:** Lista atualizada de feriados federais para cálculo de 100%.
- **Adicional Noturno:** Cálculo preciso para o período das 22h às 05h, incluindo o fator de redução noturna (52,5 minutos).
- **Gestão de Pausas:** Desconto automático do período de intervalo/descanso.
- **Modo Escuro (Dark Mode):** Interface adaptável com switch animado e salvamento de preferência no navegador.
- **Salário Bruto Estimado:** Visualização do fechamento mensal somando o salário base aos ganhos do plantão.
- **PWA (Progressive Web App):** Pode ser instalado no Android ou iOS e utilizado como um aplicativo nativo.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web puras (Vanilla) para garantir máxima performance e leveza:

- **HTML5:** Estruturação semântica.
- **CSS3:** Estilização moderna com variáveis (CSS Variables) e animações de transição.
- **JavaScript:** Lógica de cálculo de datas e manipulação de DOM.
- **Service Workers:** Para suporte offline e instalação PWA.

## 🛠️ Instalação e Uso Local

1. Clone este repositório:
   ```bash
   git clone [https://github.com/seu-usuario/calculadora-plantao-pro.git](https://github.com/seu-usuario/calculadora-plantao-pro.git)
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd calculadora-plantao-pro
   ```
3. Abra o arquivo `index.html` em seu navegador ou utilize a extensão **Live Server** no VS Code.

## 📱 Como instalar como App

### No Android (Chrome)
1. Abra o site no Chrome.
2. Toque nos três pontos no canto superior direito.
3. Selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.

### No iOS (Safari)
1. Abra o site no Safari.
2. Toque no botão de **Compartilhar**.
3. Role para baixo e selecione **"Adicionar à Tela de Início"**.

## 📝 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.

---
Desenvolvido para facilitar a vida de quem dedica seu tempo aos plantões! 🚀

### Dicas para o seu Repositório:
1. **Nome do Repositório:** Sugiro `calculadora-plantao-pro` ou `gerenciador-de-plantao`.
2. **GitHub Pages:** Como você está usando apenas HTML/CSS/JS, vá em **Settings > Pages** no seu GitHub e ative o deploy para que o seu site fique online gratuitamente!
3. **Ícone:** Certifique-se de que o arquivo `icone.ico` esteja na pasta raiz para que ele apareça no navegador e no celular.