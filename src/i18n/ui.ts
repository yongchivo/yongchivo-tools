export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'site.title': 'Yongchivo Tools',
    'site.tagline': 'Free, private, bilingual cybersecurity micro-tools.',
    'site.description':
      'A hub of free cybersecurity micro-tools: password generator, subnet calculator, security headers checker, and more. Everything runs in your browser.',
    'nav.home': 'Tools',
    'nav.yongchivo': 'yongchivo.com',
    'nav.phvprep': 'PHV Prep UK',
    'hub.heading': 'Cybersecurity micro-tools',
    'hub.subheading':
      'Small, focused, privacy-first utilities. Client-side tools never send your data anywhere.',
    'card.comingSoon': 'Coming soon',
    'card.live': 'Live',
    'related.heading': 'Related tools',
    'pwgen.title': 'Password Generator',
    'pwgen.metaDescription':
      'Generate strong, random passwords right in your browser. Cryptographically secure, free, no signup — nothing ever leaves your device.',
    'pwgen.heading': 'Password Generator',
    'pwgen.intro':
      'Create strong, random passwords with a cryptographically secure generator. Everything runs in your browser — nothing is stored or sent anywhere.',
    'pwgen.outputLabel': 'Generated password',
    'pwgen.copy': 'Copy',
    'pwgen.copied': 'Copied!',
    'pwgen.regenerate': 'Regenerate',
    'pwgen.strengthLabel': 'Strength',
    'pwgen.weak': 'Weak',
    'pwgen.medium': 'Medium',
    'pwgen.strong': 'Strong',
    'pwgen.veryStrong': 'Very strong',
    'pwgen.length': 'Length',
    'pwgen.uppercase': 'Uppercase (A–Z)',
    'pwgen.lowercase': 'Lowercase (a–z)',
    'pwgen.numbers': 'Numbers (0–9)',
    'pwgen.symbols': 'Symbols (!@#$…)',
    'pwgen.excludeAmbiguous': 'Exclude ambiguous characters (l, I, 1, O, 0)',
    'footer.builtBy': 'Built by Yongchivo',
    'footer.privacy': 'Client-side tools run entirely in your browser — no data leaves your device.',
  },
  es: {
    'site.title': 'Yongchivo Tools',
    'site.tagline': 'Micro-herramientas de ciberseguridad gratuitas, privadas y bilingües.',
    'site.description':
      'Un hub de micro-herramientas gratuitas de ciberseguridad: generador de contraseñas, calculadora de subredes, verificador de cabeceras de seguridad y más. Todo funciona en tu navegador.',
    'nav.home': 'Herramientas',
    'nav.yongchivo': 'yongchivo.com',
    'nav.phvprep': 'PHV Prep UK',
    'hub.heading': 'Micro-herramientas de ciberseguridad',
    'hub.subheading':
      'Utilidades pequeñas, enfocadas y centradas en la privacidad. Las herramientas del lado del cliente nunca envían tus datos a ningún sitio.',
    'card.comingSoon': 'Próximamente',
    'card.live': 'Disponible',
    'related.heading': 'Herramientas relacionadas',
    'pwgen.title': 'Generador de contraseñas',
    'pwgen.metaDescription':
      'Genera contraseñas fuertes y aleatorias directamente en tu navegador. Criptográficamente seguro, gratis y sin registro — nada sale de tu dispositivo.',
    'pwgen.heading': 'Generador de contraseñas',
    'pwgen.intro':
      'Crea contraseñas fuertes y aleatorias con un generador criptográficamente seguro. Todo funciona en tu navegador — nada se guarda ni se envía a ningún sitio.',
    'pwgen.outputLabel': 'Contraseña generada',
    'pwgen.copy': 'Copiar',
    'pwgen.copied': '¡Copiado!',
    'pwgen.regenerate': 'Regenerar',
    'pwgen.strengthLabel': 'Fortaleza',
    'pwgen.weak': 'Débil',
    'pwgen.medium': 'Media',
    'pwgen.strong': 'Fuerte',
    'pwgen.veryStrong': 'Muy fuerte',
    'pwgen.length': 'Longitud',
    'pwgen.uppercase': 'Mayúsculas (A–Z)',
    'pwgen.lowercase': 'Minúsculas (a–z)',
    'pwgen.numbers': 'Números (0–9)',
    'pwgen.symbols': 'Símbolos (!@#$…)',
    'pwgen.excludeAmbiguous': 'Excluir caracteres ambiguos (l, I, 1, O, 0)',
    'footer.builtBy': 'Creado por Yongchivo',
    'footer.privacy':
      'Las herramientas del lado del cliente funcionan íntegramente en tu navegador — ningún dato sale de tu dispositivo.',
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Returns the equivalent path in the other language, for the EN/ES switcher. */
export function getLocalizedPath(path: string, targetLang: Lang): string {
  const clean = path.replace(/^\/es(\/|$)/, '/');
  if (targetLang === 'es') {
    return clean === '/' ? '/es/' : `/es${clean}`;
  }
  return clean;
}
