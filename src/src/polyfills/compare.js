// src/polyfills/compare.js

// -- Intl.Collator: .Compare vs .compare
try {
  if (global.Intl?.Collator) {
    const proto = global.Intl.Collator.prototype;
    if (proto && typeof proto.compare === 'function' && !proto.Compare) {
      proto.Compare = proto.compare;
    }
  }
} catch { /* ignore */ }

// -- String prototype: .Compare(a) → localeCompare
try {
  // eslint-disable-next-line no-extend-native
  if (!String.prototype.Compare) {
    String.prototype.Compare = function (other) {
      return String(this).localeCompare(String(other), 'nl');
    };
  }
} catch { /* ignore */ }

// -- String static: String.Compare(a,b)
try {
  if (!String.Compare) {
    String.Compare = (a, b) => String(a).localeCompare(String(b), 'nl');
  }
} catch { /* ignore */ }

// -- Number static: Number.Compare(a,b)
try {
  if (!Number.Compare) {
    Number.Compare = (a, b) => Number(a) - Number(b);
  }
} catch { /* ignore */ }

// -- Date static: Date.Compare(a,b)
try {
  if (!Date.Compare) {
    Date.Compare = (a, b) => new Date(a).getTime() - new Date(b).getTime();
  }
} catch { /* ignore */ }
