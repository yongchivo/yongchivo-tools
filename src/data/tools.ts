import type { Lang } from '../i18n/ui';

export interface Tool {
  slug: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  /** Filled in when the tool page ships; undefined = placeholder card. */
  href?: string;
}

export const tools: Tool[] = [
  {
    slug: 'password-generator',
    href: '/password-generator/',
    name: {
      en: 'Password Generator',
      es: 'Generador de contraseñas',
    },
    description: {
      en: 'Create strong, random passwords entirely in your browser.',
      es: 'Crea contraseñas fuertes y aleatorias íntegramente en tu navegador.',
    },
  },
  {
    slug: 'password-strength',
    name: {
      en: 'Password Strength Analyzer',
      es: 'Analizador de fortaleza de contraseñas',
    },
    description: {
      en: 'Check how resistant a password is to cracking — nothing leaves your device.',
      es: 'Comprueba cuánto resiste una contraseña frente a ataques — nada sale de tu dispositivo.',
    },
  },
  {
    slug: 'subnet-calculator',
    href: '/subnet-calculator/',
    name: {
      en: 'Subnet Calculator',
      es: 'Calculadora de subredes',
    },
    description: {
      en: 'Work out network ranges, masks and hosts from any CIDR block.',
      es: 'Calcula rangos de red, máscaras y hosts a partir de cualquier bloque CIDR.',
    },
  },
  {
    slug: 'which-cyber-role',
    name: {
      en: 'Which Cyber Role Are You?',
      es: '¿Qué rol cyber eres?',
    },
    description: {
      en: 'A quick quiz to find your fit: pentester, SOC analyst, forensics and more.',
      es: 'Un test rápido para encontrar tu perfil: pentester, analista SOC, forense y más.',
    },
  },
  {
    slug: 'security-headers',
    name: {
      en: 'Security Headers Checker',
      es: 'Verificador de cabeceras de seguridad',
    },
    description: {
      en: 'Paste a URL and audit its HTTP security headers in seconds.',
      es: 'Pega una URL y audita sus cabeceras de seguridad HTTP en segundos.',
    },
  },
  {
    slug: 'breach-check',
    name: {
      en: 'Breach Checker',
      es: 'Comprobador de filtraciones',
    },
    description: {
      en: 'Find out if an account appears in known data breaches.',
      es: 'Descubre si una cuenta aparece en filtraciones de datos conocidas.',
    },
  },
];
