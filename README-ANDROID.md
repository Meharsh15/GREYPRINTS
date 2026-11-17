# GREYPRINTS Android app

This repository keeps the existing GreyStudio print catalogue as the single source of truth. The Android app is a Capacitor 8 native shell around a generated copy of the current `index.html`.

## App decisions

- App name: GREYPRINTS
- Android application ID: `online.greystudio.greyprints`
- Order flow: existing quotation builder and WhatsApp confirmation (no in-app payments)
- Native layer: Android status bar, splash screen, bottom navigation, haptic feedback and Android back-button handling
- Website: root `index.html` remains the live website source and is not rewritten by the Android build.

## Requirements

- Node.js 22 or newer
- Android Studio 2025.2.1 or newer for Capacitor 8
- Android SDK Platform 24 or newer
- Android SDK Build Tools and Platform Tools

See the official Capacitor environment setup: https://capacitorjs.com/docs/getting-started/environment-setup

## First-time setup (Windows PowerShell)

From the repository root:

```powershell
npm install
npm run android:build
npx cap add android
npx cap sync android
npx cap open android
```

If `android/` already exists, skip `npx cap add android`.

## Run on a connected Android phone

Enable Developer options and USB debugging on the phone, connect it by USB, accept the debugging prompt, then run:

```powershell
npm run android:run
```

Or select the device in Android Studio and press Run.

## Build a Play Store bundle

After testing the app on a real device:

1. In Android Studio, open **Build → Generate Signed Bundle / APK**.
2. Select **Android App Bundle**.
3. Create and securely back up a release signing key. Never commit the keystore or passwords to GitHub.
4. Build the **release** bundle.
5. Upload the resulting `app-release.aab` to a Google Play Console internal testing track first.

Do not upload a debug APK to production. Play Console listing, app icon, screenshots, privacy policy, Data safety form, content rating, target API compliance and account verification still need to be completed before release.

## Important implementation notes

- The Android build copies the current root `index.html` into `www/` each time; catalogue prices and products are not duplicated into a second data file.
- The generated `www/` folder and native Android build outputs are not intended to be committed.
- Product-specific website URLs are still web routes. Native Android App Links / deep links can be added after the first device test.
- The WhatsApp action uses the existing GreyStudio number. Verify WhatsApp hand-off on a real Android device before Play Store submission.
- This is a quote-request app, not a payment or order-management system. The app must not claim that a job is confirmed until GreyStudio confirms it in WhatsApp.
