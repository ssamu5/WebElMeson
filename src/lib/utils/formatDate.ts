const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAYS_ES = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
];

export function formatDateEs(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `${DAYS_ES[date.getDay()]} ${day} de ${MONTHS_ES[month - 1]}`;
}

export function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split("-").map(Number);
  return `${MONTHS_ES[month - 1]} ${year}`;
}

export function todayString(): string {
  return new Date().toISOString().split("T")[0];
}
