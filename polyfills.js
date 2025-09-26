// Global polyfills used before the app boots

// Sommige omgevingen (zoals de Expo Go app) verwachten dat er een globale
// `codex` referentie bestaat. Wanneer die ontbreekt, gooit Hermes een
// `ReferenceError: Property 'codex' doesn't exist` voordat de app kan
// registreren. Definieer een no-op placeholder zodat het laden niet stukloopt.
// We dekken meerdere globale objecten af zodat de guard ook werkt in exotische
// omgevingen (bijvoorbeeld wanneer `globalThis` of `global` nog niet bestaat).
const globalCandidates = [
  typeof globalThis !== 'undefined' ? globalThis : undefined,
  typeof global !== 'undefined' ? global : undefined,
  typeof self !== 'undefined' ? self : undefined,
];

let codexRef;
for (const candidate of globalCandidates) {
  if (!candidate) continue;
  if (typeof candidate.codex === 'undefined') {
    Object.defineProperty(candidate, 'codex', {
      value: {},
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }

  codexRef = candidate.codex;
}

// Zorg er ook voor dat er een globale variabele `codex` bestaat in de
// JavaScript-runtime. Het gebruik van `var` bindt de naam aan de globale scope
// zonder bestaande implementaties te overschrijven.
// eslint-disable-next-line no-var
if (typeof codex === 'undefined') {
  // eslint-disable-next-line no-var
  var codex = codexRef || {};
}

// Some dependencies (e.g. Firebase on Hermes) try to call a global `Compare`
// helper. Hermes does not expose this function, so provide a minimal
// implementation that mirrors the behaviour of `Intl.Collator#compare`.
if (typeof global.Compare !== 'function') {
  try {
    const collator = typeof Intl !== 'undefined' && typeof Intl.Collator === 'function'
      ? new Intl.Collator()
      : null;
    if (collator && typeof collator.compare === 'function') {
      global.Compare = collator.compare.bind(collator);
    } else {
      global.Compare = (a, b) => {
        if (a === b) return 0;
        // Handle numeric comparisons first to preserve ordering.
        if (typeof a === 'number' && typeof b === 'number') {
          return a < b ? -1 : 1;
        }
        const valueA = String(a);
        const valueB = String(b);
        if (valueA === valueB) return 0;
        return valueA < valueB ? -1 : 1;
      };
    }
  } catch (error) {
    global.Compare = (a, b) => {
      if (a === b) return 0;
      if (typeof a === 'number' && typeof b === 'number') {
        return a < b ? -1 : 1;
      }
      const valueA = String(a);
      const valueB = String(b);
      if (valueA === valueB) return 0;
      return valueA < valueB ? -1 : 1;
    };
  }
}
