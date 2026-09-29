import {normalizeTerm} from '@/anatomy/text';

const RED_FLAGS = [
  'chest pain', 'pain in my chest', 'cant breathe', 'cannot breathe', 'difficulty breathing',
  'shortness of breath', 'severe pain', 'numb arm', 'numbness', 'paralysis', 'stroke',
  'fainting', 'fainted', 'unconscious', 'heavy bleeding', 'bleeding a lot', 'suicidal',
  'heart attack', 'seizure', 'coughing blood',
  'nyeri dada', 'sakit dada', 'sesak napas', 'sulit bernapas', 'tidak bisa bernapas',
  'susah napas', 'nyeri hebat', 'mati rasa', 'kesemutan berat', 'stroke', 'pingsan',
  'tidak sadarkan diri', 'perdarahan hebat', 'pendarahan hebat', 'serangan jantung',
  'kejang', 'batuk darah', 'bunuh diri',
];

export interface SafetyCheck {
  flagged: boolean;
  message: string;
}

const WARNING_EN =
  'This sounds like something a clinician should assess. Ask Your Body can explain the anatomy involved, but it cannot diagnose or rule out a medical condition. If your symptoms are severe or getting worse, seek medical care now.';
const WARNING_ID =
  'Ini terdengar seperti hal yang perlu diperiksa tenaga medis. Ask Your Body dapat menjelaskan anatomi yang terlibat, tetapi tidak dapat mendiagnosis atau menyingkirkan kondisi medis. Jika keluhan berat atau memburuk, segera cari bantuan medis.';

/** Screens the question for red-flag phrasing so the answer stays educational. */
export function screenQuestion(query: string, language: 'en' | 'id'): SafetyCheck {
  const normalized = ` ${normalizeTerm(query)} `;
  const flagged = RED_FLAGS.some((flag) => normalized.includes(` ${normalizeTerm(flag)} `));
  return {flagged, message: language === 'id' ? WARNING_ID : WARNING_EN};
}
