const EMAIL_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

const SERVICE_ID = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID_CLIENT = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_CLIENT;
const TEMPLATE_ID_TEAM = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_TEAM;
const PUBLIC_KEY = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;
const TEAM_EMAIL =
  process.env.EXPO_PUBLIC_APPOINTMENT_TEAM_EMAIL || 'info@wattsnext.energy';

export function isEmailConfigured() {
  return Boolean(
    SERVICE_ID && TEMPLATE_ID_CLIENT && TEMPLATE_ID_TEAM && PUBLIC_KEY
  );
}

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
      'Email service niet geconfigureerd. Stel de EXPO_PUBLIC_EMAILJS_* variabelen in om e-mails te verzenden.'
    );
    return { success: false, reason: 'missing-configuration' };
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
    {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID_CLIENT,
      user_id: PUBLIC_KEY,
      template_params: {
        ...baseParams,
        to_email: clientEmail,
      },
    },
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      results.push({ ok: false, error: error?.message || 'Onbekende fout' });
    }
  }

  return {
    success: results.every((result) => result.ok),
    results,
  };
}
