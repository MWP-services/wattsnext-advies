// support/email.js (of waar dit bestand bij jou staat)

const EMAIL_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

// Environment config (Expo leest EXPO_PUBLIC_* op runtime)
const SERVICE_ID                     = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID?.trim();
const TEMPLATE_ID_CLIENT             = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_CLIENT?.trim();
const TEMPLATE_ID_TEAM               = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_TEAM?.trim();
const TEMPLATE_ID_OFFERTE            = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_OFFERTE?.trim();
const PUBLIC_KEY                     = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY?.trim();
const TEAM_EMAIL                     = (
  process.env.EXPO_PUBLIC_APPOINTMENT_TEAM_EMAIL?.trim() ||
  "r.oskam@wattsnext.energy"
);

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

//
// 1. Offerte-aanvraag voor een product
//    - Gebruikt TEMPLATE_ID_OFFERTE
//    - Stuurt 1 e-mail naar SALES_EMAIL (geen klantmail nodig)
//
export async function sendProductQuoteEmail(product) {
  if (!isEmailConfigured()) {
    console.warn(
      "Email service niet geconfigureerd. Stel de EXPO_PUBLIC_EMAILJS_* variabelen in om e-mails te versturen."
    );
    return { success: false, reason: "missing-configuration" };
  }

  // Dit zijn velden die we in de offerte-template in EmailJS gaan vullen.
  // Zorg dat jouw EmailJS-template placeholders heeft met deze namen:
  // - to_email
  // - product_naam
  // - artikelcode
  // - categorie
  // - specificaties
  // - doelgroep
  //
  // In EmailJS kan je ook de subject instellen als:
  // "Offerte-aanvraag {{product_naam}}"

  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID_OFFERTE,
    user_id: PUBLIC_KEY,
    template_params: {
      to_email: SALES_EMAIL,
      product_naam: product.productnaam,
      artikelcode: product.artikelcode,
      categorie: product.categorie,
      specificaties: product.specs || "-",
      doelgroep: product.doelgroep,
    },
  };

  try {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

//
// 2. Afspraakbevestiging en interne notificatie
//    - Wordt gebruikt door de agenda / inplan-flow
//    - Stuurt 2 mails:
//        a) naar de klant (TEMPLATE_ID_CLIENT)
//        b) naar jullie interne team (TEMPLATE_ID_TEAM)
//
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
        headers: {
          "Content-Type": "application/json",
        },
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
