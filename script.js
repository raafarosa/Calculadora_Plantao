window.FERIADOS_FEDERAIS = window.FERIADOS_FEDERAIS || ["01-01", "04-21", "05-01", "09-07", "10-12", "11-02", "11-15", "11-20", "12-25"];
let historicoPlantoes = [];
let meuGrafico = null; // Variável para controle do gráfico

document.addEventListener('DOMContentLoaded', () => {
    // Lógica do Tema
    const toggleSwitch = document.querySelector('#checkbox');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        if (toggleSwitch) toggleSwitch.checked = true;
    }
    toggleSwitch?.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        document.body.classList.toggle('dark', e.target.checked);
        localStorage.setItem('theme', theme);
    });

    // Lógica da Pausa
    const pauseSwitch = document.getElementById('semPausa');
    pauseSwitch?.addEventListener('change', (e) => {
        const container = document.getElementById('container-pausa');
        if (e.target.checked) {
            container.style.opacity = "0.3";
            container.style.pointerEvents = "none";
        } else {
            container.style.opacity = "1";
            container.style.pointerEvents = "auto";
        }
    });

    document.getElementById('fim').value = new Date().toISOString().substring(0, 16);
});

function converterParaNumero(valor) {
    if (typeof valor === 'number') return valor;
    let texto = valor.replace(/[R$\s]/g, '');
    if (texto.includes(',') && texto.includes('.')) {
        texto = texto.replace(/\./g, '').replace(',', '.');
    } else if (texto.includes(',')) {
        texto = texto.replace(',', '.');
    }
    const num = parseFloat(texto);
    return isNaN(num) ? 0 : num;
}

function calcularPlantao() {
    const salario = parseFloat(document.getElementById('salarioBruto').value);
    const nome = document.getElementById('nomePlantao').value || "Plantão Avulso";
    const inicio = new Date(document.getElementById('inicio').value);
    const fim = new Date(document.getElementById('fim').value);
    const semPausa = document.getElementById('semPausa').checked;

    if (!salario || isNaN(inicio) || isNaN(fim)) return alert("Preencha os dados.");

    const valorHoraBase = salario / 220;
    let ganho50 = 0, ganho100 = 0, adicionalNoturno = 0, minutosEfetivos = 0;
    let tempo = new Date(inicio);

    // Lógica de pausa
    const pIni = semPausa ? null : new Date(document.getElementById('pausaInicio').value);
    const pFim = semPausa ? null : new Date(document.getElementById('pausaFim').value);

    while (tempo < fim) {
        const estaNaPausa = (pIni && pFim && tempo >= pIni && tempo < pFim);
        if (!estaNaPausa) {
            const isDouble = (tempo.getDay() === 0 || window.FERIADOS_FEDERAIS.includes(tempo.toISOString().substring(5, 10)));
            const valorMin = (valorHoraBase * (isDouble ? 2.0 : 1.5)) / 60;
            if (isDouble) ganho100 += valorMin; else ganho50 += valorMin;
            if (tempo.getHours() >= 22 || tempo.getHours() < 5) adicionalNoturno += ((valorHoraBase * 0.20) / 60) * 1.1428;
            minutosEfetivos++;
        }
        tempo.setMinutes(tempo.getMinutes() + 1);
    }

    const extras = ganho50 + ganho100 + adicionalNoturno;
    const horasLqd = (minutosEfetivos / 60).toFixed(2);
    const totalTxt = `R$ ${extras.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;

    document.getElementById('resHoraBase').innerText = `R$ ${valorHoraBase.toFixed(2)}`;
    document.getElementById('resTotalHoras').innerText = horasLqd;
    document.getElementById('res50').innerText = `R$ ${ganho50.toFixed(2)}`;
    document.getElementById('res100').innerText = `R$ ${ganho100.toFixed(2)}`;
    document.getElementById('resNoturno').innerText = `R$ ${adicionalNoturno.toFixed(2)}`;
    document.getElementById('resTotal').innerText = totalTxt;
    document.getElementById('resBrutoEstimado').innerHTML = `<span>Salário Bruto Estimado:</span> <strong>R$ ${(salario + extras).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</strong>`;

    document.getElementById('resultado').style.display = 'block';
    adicionarAoHistorico(nome, inicio.toLocaleDateString('pt-BR'), horasLqd, totalTxt);
}

function adicionarAoHistorico(nome, data, horas, total) {
    const id = btoa(nome + data + horas + total);
    if (historicoPlantoes.some(p => p.id === id)) return;
    historicoPlantoes.push({ id, nome, data, horas, total });
    renderizarTabela();
}

function renderizarTabela() {
    const tbody = document.querySelector('#tabela-historico tbody');
    tbody.innerHTML = "";
    let sTotal = 0, sHoras = 0;

    historicoPlantoes.forEach(p => {
        const h = parseFloat(p.horas.replace(',', '.'));
        const v = converterParaNumero(p.total);
        sTotal += v; sHoras += h;
        tbody.innerHTML += `<tr><td>${p.nome}</td><td>${p.data}</td><td>${p.horas}h</td><td>${p.total}</td></tr>`;
    });

    if (historicoPlantoes.length > 0) {
        document.getElementById('dashboard-lateral').style.display = 'block';
        document.getElementById('res-acumulado-texto').innerHTML = `<strong>Acumulado: R$ ${sTotal.toLocaleString('pt-BR')}</strong>`;
        atualizarDashboard(sTotal, sHoras);
    }
}

function atualizarDashboard(totalGeral, horasGerais) {
    const media = horasGerais > 0 ? totalGeral / horasGerais : 0;
    document.getElementById('dash-media-hora').innerText = `R$ ${media.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;
    document.getElementById('dash-qtd-plantoes').innerText = historicoPlantoes.length;

    const dadosAgrupados = {};
    historicoPlantoes.forEach(p => {
        const valor = converterParaNumero(p.total);
        dadosAgrupados[p.nome] = (dadosAgrupados[p.nome] || 0) + valor;
    });

    const ctx = document.getElementById('chartGanhos').getContext('2d');
    if (meuGrafico) meuGrafico.destroy();

    meuGrafico = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(dadosAgrupados),
            datasets: [{
                data: Object.values(dadosAgrupados),
                backgroundColor: ['#1a73e8', '#34a853', '#fabc05', '#ea4335', '#a142f4']
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
}

function importarCSV(input) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const linhas = e.target.result.split(/\r?\n/).slice(1);
        linhas.forEach(l => {
            const c = l.split(';');
            if (c.length >= 4) adicionarAoHistorico(c[0], c[1], c[2], c[3].trim());
        });
    };
    reader.readAsText(input.files[0]);
}

function exportarParaCSV() {
    let csv = "Nome;Data;Horas;Total\n" + historicoPlantoes.map(p => `${p.nome};${p.data};${p.horas};${p.total}`).join('\n');
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio.csv";
    link.click();
}

function limparCampos() {
    location.reload();
}