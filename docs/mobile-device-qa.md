# Mobile Device QA Scenario

Use this scenario before publishing a mobile build or after changing authentication,
tenant preferences, modules, or API bindings.

## Prerequisites

- A real Android or iOS device with Expo Go installed.
- The device and development machine can reach the same network, or Expo tunnel is enabled.
- A web-created EnterpriseERP account exists. Mobile account creation is intentionally disabled.
- The API is running locally or the mobile app is configured to use the deployed API.

## Start

From the project root:

```bash
npm run qa:mobile:device
```

If the API should run locally too:

```bash
npm run dev:api
```

## Test Steps

1. Open the Expo app on the physical device.
2. Sign in with an account created from the web app.
3. Confirm the mobile app does not show sector selection or account creation.
4. Confirm the active sector matches the web account company sector.
5. Open the profile/preferences area and confirm:
   - name and email match the web account;
   - language matches the saved web preference;
   - country, currency, timezone, and sector match the company settings.
6. Open Dashboard and confirm KPIs load without static fallback data.
7. Open CRM/Clients and confirm the list matches the web/API tenant data.
8. Open Stock and confirm products, quantities, and alerts match the web/API tenant data.
9. Open Invoices/Billing and confirm invoices, due dates, and status match the web/API tenant data.
10. Open Sales, Accounting, Reports, HR, Appointments, Production, and Assistant.
    Each screen must show tenant API data or an honest empty state, not generic sector demo data.
11. Switch phone network between Wi-Fi and mobile data if the API is deployed, then reload.
12. Sign out and sign back in.

## Pass Criteria

- No Expo red or yellow error overlay remains after reload.
- No screen routes the user to the wrong sector.
- No mobile screen shows hard-coded demo commerce/restaurant data for another sector.
- Every supported module either reads tenant API data or shows a clear empty state.
- Profile and company preferences remain aligned with the web app.
