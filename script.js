const FERIADOS_FEDERAIS = ["01-01", "04-21", "05-01", "09-07", "10-12", "11-02", "11-15", "11-20", "12-25"];

// --- Lógica de Inicialização (Executa assim que a página carrega) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica do Switch de Tema
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        if(toggleSwitch) toggleSwitch.checked = true;
    }

    if(toggleSwitch) {
        toggleSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 2. Preenchimento automático dos campos de FIM
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');

    const dataHoraAtual = `${ano}-${mes}-${dia}T${hora}:${minuto}`;
    
    if(document.getElementById('fim')) document.getElementById('fim').value = dataHoraAtual;
    if(document.getElementById('pausaFim')) document.getElementById('pausaFim').value = dataHoraAtual;
});

// --- Função Principal de Cálculo ---
function calcularPlantao() {
    const salario = parseFloat(document.getElementById('salarioBruto').value);
    const inicioPlantao = new Date(document.getElementById('inicio').value);
    const fimPlantao = new Date(document.getElementById('fim').value);
    
    const pIniStr = document.getElementById('pausaInicio').value;
    const pFimStr = document.getElementById('pausaFim').value;
    const inicioPausa = pIniStr ? new Date(pIniStr) : null;
    const fimPausa = pFimStr ? new Date(pFimStr) : null;

    if (!salario || isNaN(inicioPlantao.getTime()) || isNaN(fimPlantao.getTime())) {
        return alert("Preencha o salário e as datas de início/fim.");
    }

    if (fimPlantao <= inicioPlantao) return alert("O fim deve ser após o início.");

    const valorHoraBase = salario / 220;
    let ganho50 = 0, ganho100 = 0, adicionalNoturno = 0, minutosEfetivos = 0;
    let tempoAtual = new Date(inicioPlantao);

    while (tempoAtual < fimPlantao) {
        let estaNaPausa = (inicioPausa && fimPausa && tempoAtual >= inicioPausa && tempoAtual < fimPausa);
        if (!estaNaPausa) {
            let diaSemana = tempoAtual.getDay(); 
            let mesDia = tempoAtual.toISOString().substring(5, 10);
            let hora = tempoAtual.getHours();
            
            let isDouble = (diaSemana === 0 || FERIADOS_FEDERAIS.includes(mesDia));
            let multiplicador = isDouble ? 2.0 : 1.5;
            let valorMinutoComExtra = (valorHoraBase * multiplicador) / 60;
            
            if (isDouble) ganho100 += valorMinutoComExtra;
            else ganho50 += valorMinutoComExtra;

            if (hora >= 22 || hora < 5) {
                let valorAdicionalMinuto = (valorHoraBase * 0.20) / 60;
                adicionalNoturno += valorAdicionalMinuto * 1.1428;
            }
            minutosEfetivos++;
        }
        tempoAtual.setMinutes(tempoAtual.getMinutes() + 1);
    }

    // --- Lógica do Novo Campo ---
    const totalExtras = ganho50 + ganho100 + adicionalNoturno;
    const brutoEstimado = salario + totalExtras;

    // Exibição dos resultados no HTML
    document.getElementById('resHoraBase').innerText = `R$ ${valorHoraBase.toFixed(2)}`;
    document.getElementById('resTotalHoras').innerText = (minutosEfetivos / 60).toFixed(2);
    document.getElementById('res50').innerText = `R$ ${ganho50.toFixed(2)}`;
    document.getElementById('res100').innerText = `R$ ${ganho100.toFixed(2)}`;
    document.getElementById('resNoturno').innerText = `R$ ${adicionalNoturno.toFixed(2)}`;
    document.getElementById('resTotal').innerText = `R$ ${totalExtras.toFixed(2)}`;
    
    // Atualiza o novo campo de Salário Bruto Estimado
    if(document.getElementById('resBrutoEstimado')) {
        document.getElementById('resBrutoEstimado').innerText = `R$ ${brutoEstimado.toFixed(2)}`;
    }
    
    document.getElementById('resultado').style.display = 'block';
}

// --- Registro do Service Worker (PWA) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}