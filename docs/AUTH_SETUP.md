# Accounts and admin tools

People sign in with their mobile number and a text-message code (Firebase Authentication). Each person has a profile in Firestore with a role (`member` or `admin`) and a status (`active` or `removed`). Admins can edit the website details listed in `src/content/editableFields.ts` and manage who has admin access.

Until the Firebase settings below are provided at build time, the site runs exactly as before: no account icon, no sign-in, built-in content only.

## Pages

| Path | Who | What |
|---|---|---|
| `/account/sign-in` | Everyone | Phone number → 6-digit code → name (first time only) |
| `/account` | Signed-in people | Name, phone, role; sign out; link to admin tools |
| `/account/admin` | Admins | Website details editor and the People list |

## Code layout

- `src/backend/`: the only place that imports Firebase. `config.ts` reads the `VITE_FIREBASE_*` settings.
- `src/account/`: account types, phone formatting, and `AccountProvider` / `useAccount`, which screens use instead of calling Firebase.
- `src/components/account/`, `src/pages/account/`: the sign-in, profile, and admin screens. They load lazily, so public pages don't download sign-in code.
- `src/content/publishedSite.ts`: loads the admin-published values from `content/site` and applies them through `applySiteContentPatch`. A value that fails validation falls back to the default.
- `firestore.rules`: the server-side permissions. **These are the real protection.** Tested by `tests/firestore.rules.test.mjs`.

## Permissions (enforced by `firestore.rules`)

- Anyone who signs in can create their own profile once, as an active member, with the phone number they signed in with.
- People can read their own profile and change their own name. They can't change their role, status, or phone.
- Admins can list everyone and change another person's role or status. They can't change their own, so an admin can't accidentally lock themselves out.
- “Remove” sets status to `removed`. That person keeps their Firebase login but can't use their account or sign up again with the same login. “Restore” undoes it. To delete someone completely, delete them in the Firebase console under Authentication and Firestore.
- The website details (`content/site`) are public to read. Only admins can write them, and only the allowed fields within their length limits, with safe link and image addresses.

## One-time setup

1. **Create a Firebase project** at https://console.firebase.google.com. Google Analytics is optional.
2. **Add a web app:** Project settings → General → Your apps → Web (`</>`). Copy `apiKey`, `authDomain`, `projectId`, and `appId`.
3. **Turn on phone sign-in:** Build → Authentication → Get started → Sign-in method → Phone → Enable. Phone sign-in sends real text messages, which Firebase charges for; it may require the pay-as-you-go Blaze plan. Check current pricing and set a budget alert in Google Cloud billing.
4. **Allow your website's domains:** Authentication → Settings → Authorized domains. Add `jkjoeeekim.github.io`, your Amplify domain (e.g. `main.xxxx.amplifyapp.com`), and your own domain when you have one. `localhost` is there by default.
5. **Create the database:** Build → Firestore Database → Create database → production mode → pick a US location.
6. **Publish the rules** from this folder (needs Java 21 or newer, see below):
   ```sh
   npx -y firebase-tools@15.37.0 login
   npm run deploy:rules -- --project YOUR_PROJECT_ID
   ```
7. **Give the build the settings.**
   - Local: copy `.env.example` to `.env.local` and fill in the four values.
   - GitHub Pages: repo Settings → Secrets and variables → Actions → **Variables** tab → add `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`. Then re-run the deploy workflow.
   - AWS Amplify: App settings → Environment variables → add the same four.
8. **Make yourself the first admin.** Sign up on the website, then in the Firebase console go to Firestore → `users` → your document (find it by phone number) → change `role` from `member` to `admin`. Reload `/account`, and **Admin tools** appears. From then on, admins promote others from the People list.

Optional for testing: Authentication → Sign-in method → Phone → *Phone numbers for testing* lets you add a fake number with a fixed code, so you can sign in without real texts.

## Local development with emulators (no real project or texts)

The Firebase emulators need Java 21 or newer (`java -version`). On a Mac with Homebrew: `brew install openjdk`, then put `/opt/homebrew/opt/openjdk/bin` first on your `PATH`.

```sh
npm run emulators            # Auth on :9099, Firestore on :8080, emulator UI on :4000
```

In a second terminal, start the site with the emulator values from `.env.example` (in `.env.local`, or inline):

```sh
npm run dev
```

Any phone number works. The code is shown in the emulator UI (Authentication tab) and in the emulator's terminal output. To make an account an admin, edit its `role` in the emulator UI's Firestore tab.

Run the permission tests (starts and stops its own emulator):

```sh
npm run test:rules
```

If you add a field to `editableFields`, add it to the list and `fieldsOk` in `firestore.rules`. The rules test fails until you do.
