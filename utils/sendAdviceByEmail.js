import * as MailComposer from 'expo-mail-composer';
import { Image, Linking, Share } from 'react-native';
import { createAdvicePayload, formatReferenceDate } from './createAdvicePayload';

const isFilled = (value) => value && value !== '—';

const buildEmailSubject = (payload) => {
  const subjectParts = ['WattsNext advies'];

  if (isFilled(payload.advice?.capacity)) {
    subjectParts.push(`– ${payload.advice.capacity}`);
  }

  if (isFilled(payload.client?.name)) {
    subjectParts.push(`voor ${payload.client.name}`);
  }

  if (isFilled(payload.reference?.id)) {
    subjectParts.push(`(${payload.reference.id})`);
  }

  return subjectParts.join(' ');
};

const buildAdviceLines = (payload) => {
  const lines = [];
  const { advice } = payload;

  lines.push(`Samenvatting: ${advice.summary}`);
  lines.push(`Capaciteit: ${advice.capacity}`);
  lines.push(`Aansluiting: ${advice.connection}`);

  const inputs = advice.inputs || {};
  lines.push(`Jaarverbruik: ${inputs.verbruik}`);
  lines.push(`Vermogen per paneel: ${inputs.vermogenWp}`);
  lines.push(`Aantal panelen: ${inputs.aantalPanelen}`);

  if (isFilled(inputs.overige)) {
    lines.push(`Overige gegevens: ${inputs.overige}`);
  }

  return lines;
};

const buildClientLines = (payload) => {
  const { client } = payload;
  return [
    `Type klant: ${client.type}`,
    `Naam: ${client.name}`,
    `Bedrijf: ${client.company}`,
    `E-mail: ${client.email}`,
    `Telefoon: ${client.phone}`,
  ];
};

const buildEmailBody = (payload) => {
  const subject = buildEmailSubject(payload);
  const bodyLines = [
    `Beste ${isFilled(payload.client?.name) ? payload.client.name : 'relatie'},`,
    '',
    'Hierbij het aangevraagde advies van WattsNext.',
    '',
    'Klantgegevens:',
    ...buildClientLines(payload),
    '',
    'Adviesdetails:',
    ...buildAdviceLines(payload),
    '',
    `Referentie: ${payload.reference.id}`,
    `Datum: ${formatReferenceDate(payload.reference.date)}`,
  ];

  if (payload.logos && payload.logos.length > 0) {
    bodyLines.push('');
    bodyLines.push(`Logo's in deze mail: ${payload.logos.length}`);
  }

  bodyLines.push('');
  bodyLines.push('Met vriendelijke groet,');
  bodyLines.push('WattsNext Advies');

  return { subject, body: bodyLines.join('\n') };
};

const resolveMediaAttachments = async (media) => {
  if (!media || !media.length) {
    return [];
  }

  const resolved = media
    .map((item) => {
      try {
        if (!item) {
          return null;
        }

        if (typeof item === 'string') {
          return item;
        }

        if (typeof item === 'object' && item.uri) {
          return item.uri;
        }

        const assetSource = Image.resolveAssetSource(item);
        return assetSource?.uri ?? null;
      } catch (error) {
        console.warn('sendAdviceByEmail: attachment kon niet geladen worden', error);
        return null;
      }
    })
    .filter((uri) => typeof uri === 'string');

  return resolved;
};

export async function sendAdviceByEmail(rawPayload, options = {}) {
  const payload = rawPayload?.__isNormalizedAdvicePayload
    ? rawPayload
    : createAdvicePayload(rawPayload);
  const { subject, body } = buildEmailBody(payload);

  let composerAvailable = false;

  try {
    composerAvailable = await MailComposer.isAvailableAsync();
  } catch (error) {
    composerAvailable = false;
  }

  if (composerAvailable) {
    const attachments = await resolveMediaAttachments([
      ...(payload.logos || []),
      ...(payload.attachments || []),
      payload.advice?.image,
    ].filter(Boolean));

    options?.onComposerOpen?.();

    const result = await MailComposer.composeAsync({
      subject,
      body,
      attachments,
    });

    return {
      method: 'composer',
      result,
      subject,
      body,
    };
  }

  const shareMessage = `${subject}\n\n${body}`;

  try {
    await Share.share({
      message: shareMessage,
      title: subject,
    });

    return {
      method: 'share',
      subject,
      body,
    };
  } catch (shareError) {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        return {
          method: 'mailto',
          subject,
          body,
        };
      }
    } catch (linkError) {
      throw linkError;
    }

    throw shareError;
  }
}

