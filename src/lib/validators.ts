export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '');
  return numbers.length === 11;
}

export function validateDate(date: string): boolean {
  const numbers = date.replace(/\D/g, '');
  if (numbers.length !== 8) return false;

  const day = parseInt(numbers.slice(0, 2), 10);
  const month = parseInt(numbers.slice(2, 4), 10);
  const year = parseInt(numbers.slice(4, 8), 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;

  return true;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateWhatsApp(whatsapp: string): boolean {
  const numbers = whatsapp.replace(/\D/g, '');
  return numbers.length >= 10;
}

export function validateFullName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.split(' ').length >= 2 && trimmed.length > 0;
}

export function validateSalary(salary: string): boolean {
  const numbers = salary.replace(/\D/g, '');
  return numbers.length > 0 && parseInt(numbers, 10) > 0;
}

