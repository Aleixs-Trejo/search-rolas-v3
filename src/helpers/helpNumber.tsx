const formatSeconds = (value: string | number): string => {
  const seconds = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
}

const formatNumber = (value: string | number): string => {
  const counts = [1e12, 1e9, 1e6, 1e3];
  const units = ["T", "B", "M", "K"];

  // Asegúrate de convertir el valor a número
  const num = typeof value === "string" ? parseFloat(value) : value;

  // Verifica si el valor es un número válido
  if (isNaN(num)) return "0";

  // Busca el formato adecuado
  for (let i = 0; i < counts.length; i++) {
    if (num >= counts[i]) {
      return (num / counts[i]).toFixed(2) + units[i];
    }
  }

  // Si no aplica formato, devuelve el número original
  return num.toString();
};

export { formatSeconds, formatNumber };