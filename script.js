const FERIADOS_FEDERAIS = [
  "01-01", "04-21", "05-01", "09-07", "10-12", "11-02", "11-15", "11-20", "12-25"
];

// Preenche apenas os campos de FIM ao carregar a página
window.onload = function () {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  const hora = String(agora.getHours()).padStart(2, '0');
  const minuto = String(agora.getMinutes()).padStart(2, '0');

  const dataHoraAtual = `${ano}-${mes}-${dia}T${hora}:${minuto}`;

  document.getElementById('fim').value = dataHoraAtual;
  document.getElementById('pausaFim').value = dataHoraAtual;
};

function calcularPlantao() {
  const salario = parseFloat(document.getElementById('salarioBruto').value);
  const inicioPlantao = new Date(document.getElementById('inicio').value);
  const fimPlantao = new Date(document.getElementById('fim').value);

  const pIniStr = document.getElementById('pausaInicio').value;
  const pFimStr = document.getElementById('pausaFim').value;
  const inicioPausa = pIniStr ? new Date(pIniStr) : null;
  const fimPausa = pFimStr ? new Date(pFimStr) : null;

  if (!salario || isNaN(inicioPlantao.getTime()) || isNaN(fimPlantao.getTime())) {
    return alert("Preencha o salário e as datas de início/fim do plantão.");
  }

  if (fimPlantao <= inicioPlantao) {
    return alert("O fim do plantão deve ser após o início.");
  }

  // Valor da Hora Base (Salário / 220h)
  const valorHoraBase = salario / 220;

  let ganho50 = 0;
  let ganho100 = 0;
  let adicionalNoturno = 0;
  let minutosEfetivos = 0;

  let tempoAtual = new Date(inicioPlantao);

  while (tempoAtual < fimPlantao) {
    let estaNaPausa = false;
    if (inicioPausa && fimPausa) {
      if (tempoAtual >= inicioPausa && tempoAtual < fimPausa) {
        estaNaPausa = true;
      }
    }

    if (!estaNaPausa) {
      let diaSemana = tempoAtual.getDay();
      let mesDia = tempoAtual.toISOString().substring(5, 10);
      let hora = tempoAtual.getHours();

      // Lógica de Domingos e Feriados
      let isDouble = (diaSemana === 0 || FERIADOS_FEDERAIS.includes(mesDia));
      let multiplicador = isDouble ? 2.0 : 1.5;

      let valorMinutoComExtra = (valorHoraBase * multiplicador) / 60;

      if (isDouble) {
        ganho100 += valorMinutoComExtra;
      } else {
        ganho50 += valorMinutoComExtra;
      }

      // Adicional Noturno (22h às 05h) + Fator de Redução Noturna
      if (hora >= 22 || hora < 5) {
        let valorAdicionalMinuto = (valorHoraBase * 0.20) / 60;
        adicionalNoturno += valorAdicionalMinuto * 1.1428;
      }

      minutosEfetivos++;
    }
    tempoAtual.setMinutes(tempoAtual.getMinutes() + 1);
  }

  // Exibição dos Resultados
  document.getElementById('resHoraBase').innerText = `R$ ${valorHoraBase.toFixed(2)}`;
  document.getElementById('resTotalHoras').innerText = (minutosEfetivos / 60).toFixed(2);
  document.getElementById('res50').innerText = `R$ ${ganho50.toFixed(2)}`;
  document.getElementById('res100').innerText = `R$ ${ganho100.toFixed(2)}`;
  document.getElementById('resNoturno').innerText = `R$ ${adicionalNoturno.toFixed(2)}`;
  document.getElementById('resTotal').innerText = `R$ ${(ganho50 + ganho100 + adicionalNoturno).toFixed(2)}`;

  document.getElementById('resultado').style.display = 'block';
}

// Registro do Service Worker para permitir instalação como PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registrado!', reg))
      .catch(err => console.log('Erro ao registrar Service Worker', err));
  });
}