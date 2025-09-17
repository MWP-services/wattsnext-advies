const defaultLogo = require('../assets/logo.png');

const sanitize = (value) => {
  if (value === undefined || value === null || value === '') {
    return '—';
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? `${value}` : '—';
  }

  return `${value}`;
};

const toIsoString = (value) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  return new Date().toISOString();
};

const generateReferenceId = (prefix = 'ADV') => {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 12);
  return `${prefix}-${timestamp}`;
};

export function createAdvicePayload({
  routeParams = {},
  client = {},
  advice = {},
  reference = {},
  logos,
}) {
  const mergedParams = routeParams || {};

  const normalizedClient = {
    type: sanitize(mergedParams.clientType ?? client.type),
    name: sanitize(mergedParams.clientName ?? client.name),
    company: sanitize(mergedParams.clientCompany ?? client.company),
    email: sanitize(mergedParams.clientEmail ?? client.email),
    phone: sanitize(mergedParams.clientPhone ?? client.phone),
  };

  const normalizedAdvice = {
    title: sanitize(advice.title ?? mergedParams.adviceTitle),
    summary: sanitize(advice.summary ?? mergedParams.adviceSummary),
    capacity: sanitize(advice.capacity ?? mergedParams.adviceCapacity),
    connection: sanitize(
      mergedParams.aansluiting ?? advice.connection ?? mergedParams.connection
    ),
    inputs: {
      verbruik: sanitize(advice.inputs?.verbruik ?? mergedParams.verbruik),
      vermogenWp: sanitize(advice.inputs?.vermogenWp ?? mergedParams.vermogenWp),
      aantalPanelen: sanitize(
        advice.inputs?.aantalPanelen ?? mergedParams.aantalPanelen
      ),
      overige: sanitize(
        advice.inputs?.overige ??
          mergedParams.overige ??
          (mergedParams.zekering ? `Zekering: ${mergedParams.zekering}` : undefined)
      ),
    },
    image: advice.image ?? mergedParams.adviceImage ?? null,
  };

  const referenceId =
    reference.id ?? mergedParams.referenceId ?? generateReferenceId(reference.prefix);
  const referenceDate =
    reference.date ?? mergedParams.referenceDate ?? toIsoString(reference.createdAt);

  const providedLogos = logos || mergedParams.logos || advice.logos;
  const normalizedLogos = Array.isArray(providedLogos) && providedLogos.length
    ? providedLogos
    : [defaultLogo];

  return {
    client: normalizedClient,
    advice: normalizedAdvice,
    reference: {
      id: referenceId,
      date: referenceDate,
    },
    logos: normalizedLogos,
    attachments: advice.attachments ?? mergedParams.attachments ?? [],
    __isNormalizedAdvicePayload: true,
  };
}

export function formatReferenceDate(dateValue) {
  try {
    const date = new Date(dateValue);
    return date.toLocaleDateString('nl-NL');
  } catch (error) {
    return sanitize(dateValue);
  }
}

