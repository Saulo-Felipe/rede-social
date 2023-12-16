"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDate = void 0;
function getCurrentDate() {
    let date = new Date();
    date = date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(" ");
    let fullHours = date[1].substring(0, 5);
    return date[0] + " às " + fullHours;
}
exports.getCurrentDate = getCurrentDate;
