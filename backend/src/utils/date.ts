export function getCurrentDate() {
  let date: any = new Date();
  date = date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split(" ");
  let fullHours = date[1].substring(0, 5);

  return date[0]+" às "+fullHours;
}