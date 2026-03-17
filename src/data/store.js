export const STORE = {
  name:      'Oficina de Marias',
  address:   'Praça Martinho Nobrega, 137',
  area:      'Centro — Vassouras, RJ',
  cep:       'CEP 27700-000',
  phone:     '(24) 99999-0000',
  whatsapp:  '5524999990000',
  email:     'contato@oficinadmarias.com.br',
  coords: {
    latitude:  -22.4039,
    longitude: -43.6628,
  },
};

// Horários de funcionamento (0 = domingo, 6 = sábado)
export const HOURS = [
  { day: 'Segunda',  open: '09:00', close: '18:00', dayIndex: 1 },
  { day: 'Terça',    open: '09:00', close: '18:00', dayIndex: 2 },
  { day: 'Quarta',   open: '09:00', close: '18:00', dayIndex: 3 },
  { day: 'Quinta',   open: '09:00', close: '18:00', dayIndex: 4 },
  { day: 'Sexta',    open: '09:00', close: '18:00', dayIndex: 5 },
  { day: 'Sábado',   open: '09:00', close: '14:00', dayIndex: 6 },
  { day: 'Domingo',  open: null,    close: null,     dayIndex: 0 },
];

export function isOpenNow() {
  const now      = new Date();
  const dayIndex = now.getDay();
  const current  = now.getHours() * 60 + now.getMinutes();
  const today    = HOURS.find((h) => h.dayIndex === dayIndex);
  if (!today || !today.open) return false;
  const [oH, oM] = today.open.split(':').map(Number);
  const [cH, cM] = today.close.split(':').map(Number);
  return current >= oH * 60 + oM && current < cH * 60 + cM;
}
