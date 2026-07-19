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
    'subnet.title': 'Subnet Calculator',
    'subnet.metaDescription':
      'Free IPv4 subnet calculator: get network and broadcast addresses, subnet and wildcard masks, and usable host ranges from any CIDR block — right in your browser.',
    'subnet.heading': 'Subnet Calculator',
    'subnet.intro':
      'Work out network and broadcast addresses, masks, and usable host ranges from any IPv4 CIDR block. Everything runs in your browser.',
    'subnet.inputLabel': 'IP address / CIDR',
    'subnet.inputHelp': 'Also accepts a dotted mask, e.g. 192.168.1.0 255.255.255.0',
    'subnet.calculate': 'Calculate',
    'subnet.network': 'Network address',
    'subnet.broadcast': 'Broadcast address',
    'subnet.mask': 'Subnet mask',
    'subnet.wildcard': 'Wildcard mask',
    'subnet.hostRange': 'Usable host range',
    'subnet.totalAddresses': 'Total addresses',
    'subnet.usableHosts': 'Usable hosts',
    'subnet.ipClass': 'IP class',
    'subnet.scope': 'Type',
    'subnet.scopePrivate': 'Private (RFC 1918)',
    'subnet.scopePublic': 'Public',
    'subnet.scopeLoopback': 'Loopback',
    'subnet.scopeLinkLocal': 'Link-local',
    'subnet.errFormat': 'Enter an IP with a prefix or mask, e.g. 192.168.1.0/24',
    'subnet.errIp': 'Invalid IP address',
    'subnet.errPrefix': 'Prefix must be between 0 and 32',
    'subnet.errMask': 'Invalid subnet mask',
    'subnet.splitTitle': 'Subnet splitter',
    'subnet.splitLabel': 'Number of subnets',
    'subnet.splitHelp': 'Rounded up to the next power of two.',
    'subnet.splitBtn': 'Split',
    'subnet.splitColSubnet': 'Subnet',
    'subnet.splitColRange': 'Usable range',
    'subnet.splitColBroadcast': 'Broadcast',
    'subnet.splitShowing': 'Showing the first {shown} of {total} subnets.',
    'subnet.errSplitCount': 'Enter a whole number between 2 and 1024',
    'subnet.errSplitTooSmall': 'The network is too small to split into that many subnets',
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
    'subnet.title': 'Calculadora de subredes',
    'subnet.metaDescription':
      'Calculadora de subredes IPv4 gratuita: obtén direcciones de red y broadcast, máscaras de subred y wildcard, y rangos de hosts utilizables de cualquier bloque CIDR — directamente en tu navegador.',
    'subnet.heading': 'Calculadora de subredes',
    'subnet.intro':
      'Calcula direcciones de red y broadcast, máscaras y rangos de hosts utilizables a partir de cualquier bloque CIDR IPv4. Todo funciona en tu navegador.',
    'subnet.inputLabel': 'Dirección IP / CIDR',
    'subnet.inputHelp': 'También acepta una máscara decimal, p. ej. 192.168.1.0 255.255.255.0',
    'subnet.calculate': 'Calcular',
    'subnet.network': 'Dirección de red',
    'subnet.broadcast': 'Dirección de broadcast',
    'subnet.mask': 'Máscara de subred',
    'subnet.wildcard': 'Máscara wildcard',
    'subnet.hostRange': 'Rango de hosts utilizables',
    'subnet.totalAddresses': 'Direcciones totales',
    'subnet.usableHosts': 'Hosts utilizables',
    'subnet.ipClass': 'Clase de IP',
    'subnet.scope': 'Tipo',
    'subnet.scopePrivate': 'Privada (RFC 1918)',
    'subnet.scopePublic': 'Pública',
    'subnet.scopeLoopback': 'Loopback',
    'subnet.scopeLinkLocal': 'Link-local',
    'subnet.errFormat': 'Introduce una IP con prefijo o máscara, p. ej. 192.168.1.0/24',
    'subnet.errIp': 'Dirección IP no válida',
    'subnet.errPrefix': 'El prefijo debe estar entre 0 y 32',
    'subnet.errMask': 'Máscara de subred no válida',
    'subnet.splitTitle': 'Divisor de subredes',
    'subnet.splitLabel': 'Número de subredes',
    'subnet.splitHelp': 'Se redondea a la siguiente potencia de dos.',
    'subnet.splitBtn': 'Dividir',
    'subnet.splitColSubnet': 'Subred',
    'subnet.splitColRange': 'Rango utilizable',
    'subnet.splitColBroadcast': 'Broadcast',
    'subnet.splitShowing': 'Mostrando las primeras {shown} de {total} subredes.',
    'subnet.errSplitCount': 'Introduce un número entero entre 2 y 1024',
    'subnet.errSplitTooSmall': 'La red es demasiado pequeña para dividirla en tantas subredes',
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
