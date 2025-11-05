// support/email.js
// ----------------------------------------------------
// EmailJS helpers voor offertes en afspraken
// ----------------------------------------------------

const EMAIL_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

// Environment config (Expo leest EXPO_PUBLIC_* op runtime)
const SERVICE_ID = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID?.trim();
const TEMPLATE_ID_CLIENT = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_CLIENT?.trim();
const TEMPLATE_ID_TEAM = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_TEAM?.trim();
const TEMPLATE_ID_OFFERTE = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_OFFERTE?.trim();
const PUBLIC_KEY = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY?.trim();

const TEAM_EMAIL =
  process.env.EXPO_PUBLIC_APPOINTMENT_TEAM_EMAIL?.trim() ||
  "r.oskam@wattsnext.energy";

// Deze e-mail is waar offerte-aanvragen heen moeten
const SALES_EMAIL = "micha.honkoop@gmail.com";

//
// Hulpfunctie om te checken of de basis EmailJS-config gezet is
//
export function isEmailConfigured() {
  return Boolean(
    SERVICE_ID &&
      PUBLIC_KEY &&
      TEMPLATE_ID_CLIENT &&
      TEMPLATE_ID_TEAM &&
      TEMPLATE_ID_OFFERTE
  );
}

// -------------------- Utils --------------------
function _safe(v, fb = "") {
  if (v === null || v === undefined) return fb;
  const s = String(v).trim();
  return s.length ? s : fb;
}

function _toIntOr(defaultVal, v) {
  // accepteert "10", 10 etc. en geeft minimaal defaultVal terug
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : defaultVal;
}

/**
 * Normaliseert inkomende argumenten zodat sendProductQuoteEmail
 * zowel de NIEUWE payload als de LEGACY-aanroep ondersteunt.
 *
 * Ondersteunt:
 *  1) sendProductQuoteEmail({ type:"single", product|item, requester })
 *     - verwacht qty in product.qty (of item.qty)
 *  2) sendProductQuoteEmail(product)   // legacy
 *     - kan qty in product.qty of product.aantal bevatten
 */
function _normalizeQuoteArg(arg) {
  // Nieuwe vorm met payload
  if (
    arg &&
    typeof arg === "object" &&
    (arg.type || arg.product || arg.item || arg.requester)
  ) {
    const type = arg.type || "single";
    // ⬇️ Belangrijk: pak product óf item (voor backwards-compat)
    const product = arg.product || arg.item || {};
    const requester = arg.requester || {};

    // qty → aantal (fallback op 1)
    const aantal = _toIntOr(1, product.qty ?? product.aantal);

    return {
      type,
      productnaam: _safe(product.productnaam),
      artikelcode: _safe(product.artikelcode),
      categorie: _safe(product.categorie),
      specs: _safe(product.specs, "-"),
      doelgroep: _safe(product.doelgroep),
      aantal,

      requester_name:
        _safe(requester.displayName) ||
        _safe(arg.requester_name, "Onbekende installateur"),
      requester_email:
        _safe(requester.email) || _safe(arg.requester_email, "onbekend"),
      requester_uid:
        _safe(requester.uid) || _safe(arg.requester_uid, "onbekend"),
    };
  }

  // Legacy vorm: direct product object
  const p = arg || {};
  const aantal = _toIntOr(1, p.qty ?? p.aantal);

  return {
    type: "single",
    productnaam: _safe(p.productnaam),
    artikelcode: _safe(p.artikelcode),
    categorie: _safe(p.categorie),
    specs: _safe(p.specs, "-"),
    doelgroep: _safe(p.doelgroep),
    aantal,

    requester_name: _safe(p.requester_name, "Onbekende installateur"),
    requester_email: _safe(p.requester_email, "onbekend"),
    requester_uid: _safe(p.requester_uid, "onbekend"),
  };
}

// -------------------- Offerte e-mail --------------------
/**
 * Offerte-aanvraag (single of batch-item of legacy)
 * Gebruikt TEMPLATE_ID_OFFERTE en stuurt naar SALES_EMAIL.
 *
 * Voorbeelden:
 * sendProductQuoteEmail({ type:"single", product, requester })
 * sendProductQuoteEmail({ type:"single", item, requester }) // ook ok
 * sendProductQuoteEmail(product) // legacy
 */
export async function sendProductQuoteEmail(arg) {
  if (!isEmailConfigured()) {
    console.warn(
      "Email service niet geconfigureerd. Stel de EXPO_PUBLIC_EMAILJS_* variabelen in om e-mails te versturen."
    );
    return { success: false, reason: "missing-configuration" };
  }

  // Normaliseer inkomend argument
  const n = _normalizeQuoteArg(arg);

  // Subject (optioneel als je dit in EmailJS wilt tonen via {{subject}})
  const subjectBase = n.productnaam || "Product";
  const subjectAantal = n.aantal > 1 ? ` (${n.aantal} stuks)` : "";
  const subject =
    n.type === "single"
      ? `[Offerte] ${subjectBase}${subjectAantal} (${n.artikelcode || "-"})`
      : `[Offerte-aanvraag]${subjectAantal}`;

  // Template params die aansluiten op je EmailJS-template:
  // {{product_naam}}, {{artikelcode}}, {{categorie}}, {{doelgroep}}, {{specificaties}}
  // + nieuw: {{aantal}}
  // + requester-blok: {{requester_name}}, {{requester_email}}, {{requester_uid}}
  // + optioneel: {{subject}}
  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID_OFFERTE,
    user_id: PUBLIC_KEY,
    template_params: {
      to_email: SALES_EMAIL,

      product_naam: n.productnaam,
      artikelcode: n.artikelcode,
      categorie: n.categorie,
      specificaties: n.specs,
      doelgroep: n.doelgroep,
      aantal: String(n.aantal || 1),

      requester_name: n.requester_name,
      requester_email: n.requester_email,
      requester_uid: n.requester_uid,

      subject,
    },
  };

  // Debug eventueel even aan laten:
  // console.log("EmailJS template_params:", payload.template_params);

  try {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err?.message || "Onbekende fout" };
  }
}

// -------------------- Afspraak e-mails --------------------
/**
 * 2. Afspraakbevestiging en interne notificatie
 * - Stuurt 2 mails:
 *   a) naar de klant (TEMPLATE_ID_CLIENT)
 *   b) naar het interne team (TEMPLATE_ID_TEAM)
 */
export async function sendAppointmentEmails({
  clientEmail,
  clientName,
  formattedDate,
  time,
  locationLabel,
  address,
}) {
  if (!isEmailConfigured()) {
    console.warn(
      "Email service niet geconfigureerd. Stel de EXPO_PUBLIC_EMAILJS_* variabelen in om e-mails te verzenden."
    );
    return { success: false, reason: "missing-configuration" };
  }

  const baseParams = {
    klant_naam: clientName,
    klant_email: clientEmail,
    afspraak_datum: formattedDate,
    afspraak_tijd: time,
    afspraak_locatie: locationLabel,
    afspraak_adres: address,
  };

  const payloads = [
    // Mail naar de klant
    {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID_CLIENT,
      user_id: PUBLIC_KEY,
      template_params: {
        ...baseParams,
        to_email: clientEmail,
      },
    },
    // Mail naar intern team (of planner)
    {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID_TEAM,
      user_id: PUBLIC_KEY,
      template_params: {
        ...baseParams,
        to_email: TEAM_EMAIL,
      },
    },
  ];

  const results = [];

  for (const payload of payloads) {
    try {
      const response = await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        results.push({ ok: false, error: errorText });
      } else {
        results.push({ ok: true });
      }
    } catch (error) {
      results.push({ ok: false, error: error?.message || "Onbekende fout" });
    }
  }

  return {
    success: results.every((r) => r.ok),
    results,
  };
}
