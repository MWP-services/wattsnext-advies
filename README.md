# WattsNext Advies

Deze Expo React Native-app begeleidt gebruikers door een vragenpad om een batterij- of noodstroomoplossing te adviseren. Het project maakt gebruik van React Navigation om tussen schermen te navigeren en afbeeldingen te tonen van de aangeraden configuratie.

## Advies e-mail & PDF

### Functionaliteit in het kort
- Vanuit een adviesscherm kan de gebruiker op **Verstuur advies** tikken om een dynamisch samengesteld overzicht van het berekende advies te genereren.
- De app converteert dit overzicht naar een PDF-bestand en stelt een e-mail op naar het adres dat in het formulier is ingevuld. De PDF wordt als bijlage toegevoegd zodat het advies gedeeld of opgeslagen kan worden.
- Wanneer een mailclient niet beschikbaar is, wordt automatisch het systeemdelen-venster geopend zodat de PDF alsnog gedeeld of opgeslagen kan worden (bijvoorbeeld in Bestanden/iCloud of Google Drive).

### Benodigde modules
Installeer of update onderstaande Expo-modules zodat de knop alle stappen kan uitvoeren:

```bash
npx expo install expo-print expo-file-system expo-sharing expo-mail-composer
```

- `expo-print` zet de HTML-versie van het advies om in een PDF.
- `expo-file-system` beheert het tijdelijke pad waarin de PDF wordt bewaard.
- `expo-mail-composer` opent de mailcomponist met onderwerp, bericht en de PDF als bijlage.
- `expo-sharing` biedt een fallback wanneer de mailcomponist niet beschikbaar is (bijvoorbeeld op simulatoren of toestellen zonder geconfigureerde mailapp).

### Werking van de knop op het adviesscherm
1. De knop controleert of alle verplichte formuliervelden (zoals contactgegevens en keuze voor aansluiting) zijn ingevuld; zo niet, krijgt de gebruiker een melding en blijft de PDF-actie uit.
2. Tijdens het genereren wordt een laadindicator getoond en wordt de knop tijdelijk uitgeschakeld om dubbele aanvragen te voorkomen.
3. Het advies wordt omgezet in HTML, waarna `expo-print.printToFileAsync` een PDF-bestand produceert.
4. Vervolgens probeert de app `MailComposer.composeAsync` aan te roepen met het ingevulde e-mailadres, een standaardonderwerp en de PDF als bijlage.
5. Wanneer `MailComposer` niet beschikbaar is of de gebruiker het delen annuleert, valt de app terug op `Sharing.shareAsync` zodat het advies alsnog gedeeld kan worden.
6. Na een succesvolle verzending of gedeelde actie volgt een bevestiging/toast en wordt de tijdelijke PDF opgeruimd uit het bestandssysteem.

### Testinstructies
#### iOS
- **Simulator**
  1. Start de simulator met `npm start` gevolgd door `i` of `expo start --ios`.
  2. Doorloop het adviespad tot het gewenste adviesscherm en vul alle velden in.
  3. Tik op **Verstuur advies** en controleer dat: (a) er geen e-mailvenster verschijnt (Mail is niet beschikbaar in de simulator), (b) automatisch het delen-venster opent met de PDF als optie en (c) annuleren een nette foutmelding toont.
  4. Test met lege velden door bewust een verplicht veld leeg te laten; de knop mag niet doorgaan en moet de gebruiker waarschuwen.
- **Fysiek toestel**
  1. Installeer de Expo Go-app of gebruik een development build via `expo run:ios`.
  2. Zorg dat een mailaccount actief is in de Mail-app.
  3. Tik op **Verstuur advies** en controleer dat de e-mailcomponist opent, het onderwerp is ingevuld en de PDF als bijlage zichtbaar is.
  4. Zet het toestel tijdelijk offline en herhaal; de app moet een duidelijke foutmelding geven en de gebruiker vragen het opnieuw te proberen zodra verbinding beschikbaar is.

#### Android
- **Emulator**
  1. Start de emulator met `npm start` gevolgd door `a` of `expo start --android`.
  2. Open het adviesscherm, laat de mailapp ongeconfigureerd en activeer **Verstuur advies**.
  3. Controleer dat de standaard Android-share sheet verschijnt met de PDF, en dat annuleren geen crash veroorzaakt.
  4. Herhaal met lege velden om te bevestigen dat de validatie de actie blokkeert.
- **Fysiek toestel**
  1. Bouw of open de app via Expo Go of een development build (`expo run:android`).
  2. Controleer dat bij een correct ingevuld formulier de standaard mailapp (bijv. Gmail) wordt geopend met de PDF als bijlage.
  3. Test de fallback door de mailapp tijdelijk te verwijderen of uit te schakelen; de app moet terugvallen op `Sharing.shareAsync`.
  4. Probeer het advies meerdere keren achter elkaar te verzenden en verifieer dat dubbele PDF’s niet blijven staan in het tijdelijke bestandspad.

### Edge-cases & fallbacks om te valideren
- Lege of ongeldig geformatteerde e-mailadressen: de knop moet een foutmelding tonen en niet doorgaan.
- Gebruikers annuleren tijdens het delen: het laadscherm moet sluiten en de gebruiker mag het opnieuw proberen.
- Opslagfouten (bijv. weinig schijfruimte): toon een waarschuwing en verwijder eventuele gedeeltelijk aangemaakte PDF-bestanden.
- Onstabiele netwerkverbinding: de app moet het mailvenster tonen, maar mag niet crashen als verzending later mislukt; verwijs de gebruiker naar de mail-app voor status.
