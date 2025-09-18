// screens/OfferteAanvraagScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, Linking } from 'react-native';
import * as Print from 'expo-print';
import * as MailComposer from 'expo-mail-composer';


const Row = ({ label, value }) => (
<View style={{ marginBottom: 8 }}>
<Text style={{ color: '#6b7280', marginBottom: 2 }}>{label}</Text>
<Text style={{ fontWeight: '600' }}>{value}</Text>
</View>
);


export default function OfferteAanvraagScreen({ route }) {
const params = route?.params || {};
const [email, setEmail] = useState('info@wattsnext.energy');
const [naam, setNaam] = useState('');
const [tel, setTel] = useState('');
const [opmerkingen, setOpmerkingen] = useState('');


const samenvatting = useMemo(() => ({
phase: params.phase || '—',
annualUse: params.annualUse ? `${params.annualUse} kWh/jaar` : '—',
pvAnnual: params.pvAnnual ? `${params.pvAnnual} kWh/jaar` : '—',
autonomyHours: params.autonomyHours ? `${params.autonomyHours} uur` : '—',
need: typeof params.need === 'number' ? `${params.need.toFixed(2)} kWh` : '—',
recommendation: params.recommendation || '—',
}), [route?.params]);


const buildHtml = () => `
<html>
<head>
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
<style>
body { font-family: -apple-system, Helvetica, Arial; padding: 24px; }
h1 { font-size: 22px; margin-bottom: 12px; }
.card { border: 1px solid #eee; border-radius: 12px; padding: 16px; margin: 12px 0; }
.row { display: flex; justify-content: space-between; margin: 6px 0; }
.muted { color: #6b7280; }
</style>
</head>
<body>
<h1>Offerte‑aanvraag – WattsNext Thuisbatterij</h1>
<div class=\"card\">
<div class=\"row\"><div>Naam</div><div><b>${naam || '—'}</b></div></div>
<div class=\"row\"><div>Telefoon</div><div><b>${tel || '—'}</b></div></div>
</div>
<div class=\"card\">
<div class=\"row\"><div>Aansluiting</div><div><b>${samenvatting.phase}</b></div></div>
<div class=\"row\"><div>Verbruik</div><div><b>${samenvatting.annualUse}</b></div></div>
<div class=\"row\"><div>PV‑opwek</div><div><b>${samenvatting.pvAnnual}</b></div></div>
<div class=\"row\"><div>Autonomie</div><div><b>${samenvatting.autonomyHours}</b></div></div>
<div class=\"row\"><div>Netto behoefte</div><div><b>${samenvatting.need}</b></div></div>
<div class=\"row\"><div>Advies</div><div><b>${samenvatting.recommendation}</b></div></div>
</div>
${opmerkingen ? `<div class=\"card\"><div><b>Opmerkingen klant</b></div><div>${opmerkingen}</div></div>` : ''}
<p class=\"muted\">Automatisch gegenereerd uit de app. Indicatief; offerte volgt na controle.</p>
</body>
</html>
`;


const verstuur = async () => {
  try {
	const available = await MailComposer.isAvailableAsync();
	const subject = 'Offerte‑aanvraag – thuisbatterij';
	const bodyText =
	  `Beste WattsNext,\n\n` +
	  `Naam: ${naam || '—'}\n` +
	  `Telefoon: ${tel || '—'}\n` +
	  `\n` +
	  `Aansluiting: ${samenvatting.phase}\n` +
	  `Verbruik: ${samenvatting.annualUse}\n` +
	  `PV‑opwek: ${samenvatting.pvAnnual}\n` +
	  `Autonomie: ${samenvatting.autonomyHours}\n` +
	  `Netto behoefte: ${samenvatting.need}\n` +
	  `Advies: ${samenvatting.recommendation}\n` +
	  (opmerkingen ? `\nOpmerkingen klant: ${opmerkingen}\n` : '') +
	  `\nAutomatisch gegenereerd uit de app. Indicatief; offerte volgt na controle.\n`;

	if (!available) {
	  Alert.alert(
		'Mail niet beschikbaar',
		'Mail is niet geconfigureerd op dit apparaat. Probeer het later opnieuw of stuur handmatig een mail naar info@wattsnext.energy.'
	  );
	  return;
	}

	await MailComposer.composeAsync({
	  recipients: [email],
	  subject,
	  body: bodyText,
	  isHtml: false,
	});

	Alert.alert('Verzonden', 'Je aanvraag is verzonden!');
  } catch (error) {
	Alert.alert('Fout', 'Er is een fout opgetreden bij het versturen van de aanvraag.');
  }
}

// Add the missing closing bracket for the component
}