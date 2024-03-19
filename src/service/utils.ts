import {Parcela} from "../types/Inscrito";

export const calcIdade = (dtNasc?: string) => {
    if (!dtNasc) {
        return '';
    }

    let [dia_aniversario, mes_aniversario, ano_aniversario] = dtNasc.split('/');
    let d = new Date,
        ano_atual = d.getFullYear(),
        mes_atual = d.getMonth() + 1,
        dia_atual = d.getDate(),

        nano_aniversario = +ano_aniversario,
        nmes_aniversario = +mes_aniversario,
        ndia_aniversario = +dia_aniversario,

        quantos_anos = ano_atual - nano_aniversario;

    if (mes_atual < nmes_aniversario || mes_atual == nmes_aniversario && dia_atual < ndia_aniversario) {
        quantos_anos--;
    }

    return quantos_anos < 0 ? 0 : quantos_anos;
}

export const calcParcelas = (parcelas?: Parcela[]) => {
    if (!parcelas) {
        return 0;
    }

    return parcelas.reduce((pt, p) => pt + Number.parseInt(p.quantidade), 0);
}

export const getFormatDate = (date: string) => {
    let reference = new Date(Date.parse(date));
    let now = new Date();

    let period = Math.floor(now.getTime() - reference.getTime());
    if (period < 1000 * 60 * 60 * 24 * 7) { // segundo * minuto * hora * dia * semana
        return [
            reference.toLocaleString('pt-BR', {weekday: "short"}),
            "às",
            reference.toLocaleString('pt-BR', {timeStyle: "short"})
        ].join(' ');
    } else {
        return [
            reference.toLocaleString('pt-BR', {dateStyle: "short"}),
            reference.toLocaleString('pt-BR', {timeStyle: "short"})
        ].join(' ');
    }
}