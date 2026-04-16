# 🏥 Gerenciador de Plantão Pro

Uma solução web completa e inteligente para profissionais que realizam escalas e plantões extras. Muito além de uma calculadora, o **Plantão Pro** agora oferece um ecossistema de gerenciamento com dashboards analíticos, persistência de histórico e visualização de performance financeira.

## ✨ Novas Funcionalidades (v3.0)

  - **📊 Dashboard de Indicadores:** Painel lateral que exibe a média de ganhos por hora e o volume total de plantões realizados.
  - **📈 Gráficos Interativos:** Visualização da distribuição de ganhos por cliente ou projeto (ex: On-call BOFA vs Avulsos) através de gráficos de rosca alimentados pelo **Chart.js**.
  - **💾 Importação e Exportação CSV:** Salve seu histórico localmente e carregue-o novamente em qualquer momento. Seus dados não ficam presos no navegador\!
  - **🗂️ Histórico Consolidado:** Tabela detalhada com somatória automática de horas e valores acumulados.

## 🛠️ Funcionalidades Core

  - **Cálculo Automático:** Baseado no salário bruto e jornada padrão de 220h (Previsto CLT).
  - **Fator de Redução Noturna:** Cálculo preciso para o período das 22h às 05h, aplicando o coeficiente de 52,5 minutos para a hora noturna.
  - **Inteligência de Datas:** Detecção automática de finais de semana e feriados federais (cálculo a 100%).
  - **Gestão de Pausas:** Opção de descontar intervalos ou configurar plantões sem pausa.
  - **Interface Adaptive:** Modo Escuro nativo e layout responsivo que se adapta do desktop ao mobile.
  - **Salário Bruto Estimado:** Projeção do fechamento mensal somando o salário fixo aos ganhos variáveis dos plantões registrados.

## 🚀 Tecnologias Utilizadas

  - **HTML5:** Estrutura semântica para acessibilidade.
  - **CSS3:** Design moderno com Flexbox/Grid e variáveis dinâmicas.
  - **JavaScript (Vanilla):** Lógica de processamento de dados e manipulação de arquivos.
  - **Chart.js:** Biblioteca leve para renderização dos gráficos analíticos.
  - **PWA (Service Workers):** Suporte offline e instalação como aplicativo nativo.
-----