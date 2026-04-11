const FERIADOS_FEDERAIS = [
    "01-01", "04-21", "05-01", "09-07", "10-12", "11-02", "11-15", "11-20", "12-25"
];

// Lógica de Autocompletar Ano ao sair do campo (Blur)
document.querySelectorAll('.data-automatica').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value) {
            let dataValor = this.value;
            const anoAtual = new Date().getFullYear(); 

            // Se o navegador preencher com ano base 0001 ou 2000, força para o ano atual (2026)
            if (dataValor.startsWith('0001') || dataValor.startsWith('2000')) {
                this.value = dataValor.replace(/^(\d{4})/, anoAtual);
            }
        }
    });
});

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
            
            let isDouble = (diaSemana === 0 || FERIADOS_FEDERAIS.includes(mesDia));
            let multiplicador = isDouble ? 2.0 : 1.5;

            let valorMinutoComExtra = (valorHoraBase * multiplicador) / 60;
            
            if (isDouble) {
                ganho100 += valorMinutoComExtra;
            } else {
                ganho50 += valorMinutoComExtra;
            }

            // Adicional Noturno CLT (22h às 05h) + Fator de Redução Noturna (1.1428)
            if (hora >= 22 || hora < 5) {
                let valorAdicionalMinuto = (valorHoraBase * 0.20) / 60;
                adicionalNoturno += valorAdicionalMinuto * 1.1428;
            }
            
            minutosEfetivos++;
        }
        tempoAtual.setMinutes(tempoAtual.getMinutes() + 1);
    }

    // Exibição dos Resultados
    document.getElementById('resTotalHoras').innerText = (minutosEfetivos / 60).toFixed(2);
    document.getElementById('res50').innerText = `R$ ${ganho50.toFixed(2)}`;
    document.getElementById('res100').innerText = `R$ ${ganho100.toFixed(2)}`;
    document.getElementById('resNoturno').innerText = `R$ ${adicionalNoturno.toFixed(2)}`;
    document.getElementById('resTotal').innerText = `R$ ${(ganho50 + ganho100 + adicionalNoturno).toFixed(2)}`;
    
    document.getElementById('resultado').style.display = 'block';
}