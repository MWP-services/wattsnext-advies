// support/email.js
// ----------------------------------------------------
// EmailJS helpers voor offertes en afspraken
// ----------------------------------------------------

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const EMAIL_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

// Environment config (Expo leest EXPO_PUBLIC_* op runtime)
const SERVICE_ID = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID?.trim();
const TEMPLATE_ID_CLIENT =
  process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_CLIENT?.trim();
const TEMPLATE_ID_TEAM = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_TEAM?.trim();
const TEMPLATE_ID_OFFERTE =
  process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_OFFERTE?.trim();
const PUBLIC_KEY = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY?.trim();

const TEAM_EMAIL =
  process.env.EXPO_PUBLIC_APPOINTMENT_TEAM_EMAIL?.trim() ||
  "r.oskam@wattsnext.energy";

// Deze e-mail is waar offerte-aanvragen heen moeten
const SALES_EMAIL = "sales@wattsnext.energy";

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
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : defaultVal;
}

/**
 * Probeert altijd een betrouwbare requester te krijgen:
 * 1) payload requester / args
 * 2) auth.currentUser
 * 3) Firestore users/{uid}
 */
async function resolveRequester({ requester, arg } = {}) {
  const u = auth.currentUser;

  const uidFromArg =
    _safe(requester?.uid) || _safe(arg?.requester_uid) || _safe(u?.uid);
  const emailFromArg =
    _safe(requester?.email) || _safe(arg?.requester_email) || _safe(u?.email);
  let nameFromArg =
    _safe(requester?.displayName) ||
    _safe(arg?.requester_name) ||
    _safe(u?.displayName);

  // Firestore fallback als naam leeg is
  if (!nameFromArg && uidFromArg) {
    try {
      const snap = await getDoc(doc(db, "users", uidFromArg));
      if (snap.exists()) {
        const data = snap.data() || {};
        nameFromArg = _safe(data.naam) || _safe(data.bedrijf);
      }
    } catch (e) {
      console.log("resolveRequester Firestore fout:", e?.message);
    }
  }

  return {
    requester_uid: uidFromArg || "onbekend",
    requester_email: emailFromArg || "onbekend",
    requester_name: nameFromArg || "Onbekende installateur",
  };
}

/**
 * Normaliseert inkomende argumenten zodat sendProductQuoteEmail
 * zowel de NIEUWE payload als de LEGACY-aanroep ondersteunt (single item).
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
    const type = arg.type || "multi";
    const product = arg.product || arg.item || {};
    const requester = arg.requester || {};

    const aantal = _toIntOr(1, product.qty ?? product.aantal);

    return {
      type,
      productnaam: _safe(product.productnaam),
      artikelcode: _safe(product.artikelcode),
      categorie: _safe(product.categorie),
      specs: _safe(product.specs, "-"),
      doelgroep: _safe(product.doelgroep),
      aantal,

      // Let op: deze waarden kunnen later worden overschreven door resolveRequester()
      requester_name:
        _safe(requester.displayName) ||
        _safe(arg.requester_name, "Onbekende installateur"),
      requester_email: _safe(requester.email) || _safe(arg.requester_email, "onbekend"),
      requester_uid: _safe(requester.uid) || _safe(arg.requester_uid, "onbekend"),
    };
  }

  // Legacy vorm: direct product object
  const p = arg || {};
  const aantal = _toIntOr(1, p.qty ?? p.aantal);

  return {
    type: "multi",
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
 * Offerte-aanvraag (single of multi)
 * Gebruikt TEMPLATE_ID_OFFERTE en stuurt naar SALES_EMAIL.
 *
 * Voorbeelden:
 *  - Single:
 *      sendProductQuoteEmail({ type:"single", product, requester })
 *      sendProductQuoteEmail(product) // legacy
 *
 *  - Multi (winkelmandje):
 *      sendProductQuoteEmail({ items, requester })
 *      sendProductQuoteEmail({ type:"multi", items, requester })
 *      // items = [{ productnaam, artikelcode, categorie, specs, doelgroep, qty }, ...]
 */
export async function sendProductQuoteEmail(arg) {
  if (!isEmailConfigured()) {
    console.warn(
      "Email service niet geconfigureerd. Stel de EXPO_PUBLIC_EMAILJS_* variabelen in om e-mails te versturen."
    );
    return { success: false, reason: "missing-configuration" };
  }

  console.log("▶ sendProductQuoteEmail arg:", JSON.stringify(arg));

  // 🧺 Speciaal pad voor multi-product offerte (winkelmandje)
  const isMulti =
    arg &&
    typeof arg === "object" &&
    Array.isArray(arg.items) &&
    arg.items.length > 0;

  if (isMulti) {
    console.log("▶ MULTI-OFFERTE detected, items:", arg.items.length);

    const requester = arg.requester || {};
    const resolved = await resolveRequester({ requester, arg });

    const items = arg.items.map((p) => {
      const aantal = _toIntOr(1, p.qty ?? p.aantal);
      return {
        aantal,
        productnaam: _safe(p.productnaam, "Product"),
        artikelcode: _safe(p.artikelcode, "-"),
        categorie: _safe(p.categorie),
        specs: _safe(p.specs, "-"),
        doelgroep: _safe(p.doelgroep),
      };
    });

    // Voor in de e-mail: nette lijst
    const productListLines = items.map((item, index) => {
      const parts = [
        `${item.aantal}× ${item.productnaam}`,
        `(${item.artikelcode})`,
      ];
      if (item.categorie) parts.push(`– ${item.categorie}`);
      if (item.specs) parts.push(`– ${item.specs}`);
      return `${index + 1}. ${parts.join(" ")}`;
    });

    const product_list = productListLines.join("\n");

    // Optioneel: eerste product blijft ingevuld voor bestaande templates
    const first = items[0] || {};
    const subject = `[Offerte] ${items.length} product(en)`;

    const payload = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID_OFFERTE,
      user_id: PUBLIC_KEY,
      template_params: {
        to_email: SALES_EMAIL,

        // Eerste product (voor backwards-compat)
        product_naam: first.productnaam,
        artikelcode: first.artikelcode,
        categorie: first.categorie,
        specificaties: first.specs,
        doelgroep: first.doelgroep,
        aantal: String(first.aantal || 1),

        // Nieuw: volledige lijst van producten
        product_list,

        // ✅ altijd correct ingevuld
        requester_name: resolved.requester_name,
        requester_email: resolved.requester_email,
        requester_uid: resolved.requester_uid,

        subject,
      },
    };

    console.log("▶ MULTI-OFFERTE payload:", payload.template_params);

    try {
      const response = await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("❌ EmailJS multi response not ok:", errorText);
        return { success: false, error: errorText };
      }

      return { success: true };
    } catch (err) {
      console.warn("❌ EmailJS multi error:", err);
      return { success: false, error: err?.message || "Onbekende fout" };
    }
  }

  // 🔹 Standaard: single-product offerte
  const n = _normalizeQuoteArg(arg);

  // ✅ forceer requester via resolveRequester (ook bij legacy calls)
  const resolved = await resolveRequester({
    requester: arg?.requester,
    arg,
  });

  const subjectBase = n.productnaam || "Product";
  const subjectAantal = n.aantal > 1 ? ` (${n.aantal} stuks)` : "";
  const subject =
    n.type === "multi"
      ? `[Offerte] ${subjectBase}${subjectAantal} (${n.artikelcode || "-"})`
      : `[Offerte-aanvraag]${subjectAantal}`;

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

      // ✅ altijd correct ingevuld
      requester_name: resolved.requester_name,
      requester_email: resolved.requester_email,
      requester_uid: resolved.requester_uid,

      subject,
    },
  };

  console.log("▶ SINGLE-OFFERTE payload:", payload.template_params);

  try {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("❌ EmailJS single response not ok:", errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (err) {
    console.warn("❌ EmailJS single error:", err);
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
