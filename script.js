const FERIADOS_FEDERAIS = ["01-01", "04-21", "05-01", "09-07", "10-12", "11-02", "11-15", "11-20", "12-25"];

let historicoPlantoes = [];

document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        if (toggleSwitch) toggleSwitch.checked = true;
    }
    toggleSwitch?.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        document.body.classList.toggle('dark', e.target.checked);
        localStorage.setItem('theme', theme);
    });

    const pauseSwitch = document.getElementById('semPausa');
    pauseSwitch?.addEventListener('change', (e) => {
        const container = document.getElementById('container-pausa');
        if (e.target.checked) {
            container.style.opacity = "0.3";
            container.style.pointerEvents = "none";
            document.getElementById('pausaInicio').value = "";
            document.getElementById('pausaFim').value = "";
        } else {
            container.style.opacity = "1";
            container.style.pointerEvents = "auto";
        }
    });

    const agora = new Date().toISOString().substring(0, 16);
    if (document.getElementById('fim')) document.getElementById('fim').value = agora;
});

// FUNÇÃO DE LIMPEZA DEFINITIVA
function converterParaNumero(valor) {
    if (typeof valor === 'number') return valor;

    // Remove R$, espaços e qualquer caractere que não seja número, ponto ou vírgula
    let texto = valor.replace(/[R$\s]/g, '');

    // Se o valor tem vírgula e ponto (ex: 1.200,50), removemos o ponto e trocamos a vírgula
    if (texto.includes(',') && texto.includes('.')) {
        texto = texto.replace(/\./g, '').replace(',', '.');
    }
    // Se tem apenas vírgula (ex: 559,91), trocamos por ponto
    else if (texto.includes(',')) {
        texto = texto.replace(',', '.');
    }
    // Se tem apenas ponto e ele parece ser decimal (ex: 521.73), mantemos o ponto

    const num = parseFloat(texto);
    return isNaN(num) ? 0 : num;
}

function calcularPlantao() {
    const salario = parseFloat(document.getElementById('salarioBruto').value);
    const nome = document.getElementById('nomePlantao').value || "Plantão Avulso";
    const inicioPlantao = new Date(document.getElementById('inicio').value);
    const fimPlantao = new Date(document.getElementById('fim').value);

    const semPausa = document.getElementById('semPausa').checked;
    const pIniStr = document.getElementById('pausaInicio').value;
    const pFimStr = document.getElementById('pausaFim').value;
    const inicioPausa = (!semPausa && pIniStr) ? new Date(pIniStr) : null;
    const fimPausa = (!semPausa && pFimStr) ? new Date(pFimStr) : null;

    if (!salario || isNaN(inicioPlantao.getTime()) || isNaN(fimPlantao.getTime())) {
        return alert("Preencha o salário e as datas.");
    }

    const valorHoraBase = salario / 220;
    let ganho50 = 0, ganho100 = 0, adicionalNoturno = 0, minutosEfetivos = 0;
    let tempoAtual = new Date(inicioPlantao);

    while (tempoAtual < fimPlantao) {
        const estaNaPausa = (inicioPausa && fimPausa && tempoAtual >= inicioPausa && tempoAtual < fimPausa);
        if (!estaNaPausa) {
            const diaSemana = tempoAtual.getDay();
            const mesDia = tempoAtual.toISOString().substring(5, 10);
            const hora = tempoAtual.getHours();
            const isDouble = (diaSemana === 0 || FERIADOS_FEDERAIS.includes(mesDia));
            const valorMinuto = (valorHoraBase * (isDouble ? 2.0 : 1.5)) / 60;

            if (isDouble) ganho100 += valorMinuto; else ganho50 += valorMinuto;
            if (hora >= 22 || hora < 5) adicionalNoturno += ((valorHoraBase * 0.20) / 60) * 1.1428;
            minutosEfetivos++;
        }
        tempoAtual.setMinutes(tempoAtual.getMinutes() + 1);
    }

    const totalExtras = ganho50 + ganho100 + adicionalNoturno;
    const horasLiquidas = (minutosEfetivos / 60).toFixed(2);
    const totalFormatado = `R$ ${totalExtras.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    document.getElementById('resHoraBase').innerText = `R$ ${valorHoraBase.toFixed(2)}`;
    document.getElementById('resTotalHoras').innerText = horasLiquidas;
    document.getElementById('res50').innerText = `R$ ${ganho50.toFixed(2)}`;
    document.getElementById('res100').innerText = `R$ ${ganho100.toFixed(2)}`;
    document.getElementById('resNoturno').innerText = `R$ ${adicionalNoturno.toFixed(2)}`;
    document.getElementById('resTotal').innerText = totalFormatado;
    const salarioBrutoTotal = (salario + totalExtras);
    document.getElementById('resBrutoEstimado').innerHTML = `<strong>R$ ${salarioBrutoTotal.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</strong>`;
    document.getElementById('resultado').style.display = 'block';

    adicionarAoHistorico(nome, inicioPlantao.toLocaleDateString('pt-BR'), horasLiquidas, totalFormatado);
}

function adicionarAoHistorico(nome, data, horas, total) {
    const idUnico = nome + data + horas + total;
    if (historicoPlantoes.some(p => p.id === idUnico)) return;
    historicoPlantoes.push({ id: idUnico, nome, data, horas, total });
    renderizarTabela();
}

function renderizarTabela() {
    const tbody = document.querySelector('#tabela-historico tbody');
    tbody.innerHTML = "";
    let sTotal = 0, sHoras = 0;

    historicoPlantoes.forEach(p => {
        const hNum = parseFloat(p.horas.toString().replace(',', '.'));
        const vNum = converterParaNumero(p.total);

        sHoras += hNum;
        sTotal += vNum;

        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${p.nome}</td><td>${p.data}</td><td>${hNum.toFixed(2)}h</td><td>${p.total}</td>`;
        tbody.appendChild(tr);
    });

    if (historicoPlantoes.length > 0) {
        document.getElementById('res-acumulado-texto').innerHTML = `
            <strong>📊 Resumo Consolidado</strong><br>
            Total: <strong>${sHoras.toFixed(2)}h</strong> acumuladas e <strong style="color:var(--color-success)">R$ ${sTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.
        `;
        document.getElementById('painel-acumulado').style.display = 'block';
    }
}

function importarCSV(input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const linhas = e.target.result.split(/\r?\n/).slice(1);
        linhas.forEach(l => {
            const c = l.split(';');
            if (c.length >= 4) {
                const nome = c[0], data = c[1], horas = c[2], total = c[3];
                if (nome && data && horas && total) {
                    adicionarAoHistorico(nome, data, horas, total.trim());
                }
            }
        });
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
    reader.readAsText(input.files[0]);
}

function exportarParaCSV() {
    if (historicoPlantoes.length === 0) return alert("Não há dados.");
    let csvContent = "Nome;Data;Horas;Total\n";
    historicoPlantoes.forEach(p => {
        csvContent += `${p.nome};${p.data};${p.horas};${p.total}\n`;
    });
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_plantoes.csv`;
    link.click();
}

function limparCampos() {
    ['salarioBruto', 'nomePlantao', 'inicio', 'fim', 'pausaInicio', 'pausaFim'].forEach(id => {
        if (document.getElementById(id)) document.getElementById(id).value = "";
    });
    document.getElementById('semPausa').checked = false;
    document.getElementById('container-pausa').style.opacity = "1";
    document.getElementById('container-pausa').style.pointerEvents = "auto";
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('painel-acumulado').style.display = 'none';
    historicoPlantoes = [];
    document.querySelector('#tabela-historico tbody').innerHTML = "";
}