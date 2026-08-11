# Data From Android — Full Signal Inventory, Collection Method, and Onboarding Journey

The Approach Document lists a short signal set (SMS, GPS, app usage, call metadata). This note expands that inventory, maps each signal to a livelihood-measurement inference, documents **how** each signal is technically collected (API/permission/consent mechanism, verified against current Android/Play Store policy), and lays out the proposed beneficiary onboarding journey. Status labels are used throughout: **[Verified]** = confirmed against current Android developer docs / Play Console policy (sources at bottom); **[Recommended]** = my proposed design, not yet agreed with the NGO/professor; **[Decided]** = a choice the project has actually settled on.

## Communications signals

| Signal | Raw capture | Livelihood inference | Dimension fed |
|---|---|---|---|
| SMS – bank/UPI/wallet alerts | Debit/credit events, amounts, timing | Cash flow volatility, income regularity (salary-date consistency vs. irregular casual-labor pattern), spend categories | Economic outcomes |
| SMS – loan/EMI/insurance/SIP alerts | Disbursement, due dates, payment confirmations | Formal credit access, repayment discipline (missed EMI = distress), savings/insurance uptake | Economic outcomes |
| SMS – government DBT alerts | Scheme payment received | Not just scheme *enrollment* but ongoing *utilization* — pair with a later withdrawal alert to see if the money was actually used | Economic outcomes, Inclusion |
| SMS – low-balance/overdraft/bounced-payment alerts | Distress notifications | Financial fragility index — an actual negative-outlier signal, not just "declining activity" | Economic outcomes (risk flag) |
| Call logs (metadata only — no content) | Unique numbers called, duration, time-of-day | Business network growth (new customers/suppliers), business-hours concentration = operating hours proxy | Sustainability, Inclusion |
| Contacts list size/growth | Count over time | Social capital growth — a dimension the source doc doesn't have at all | *(new dimension candidate)* |

## Location signals

| Signal | Raw capture | Livelihood inference | Dimension fed |
|---|---|---|---|
| Home vs. work location split | Two stable clusters vs. one | Business formalization (fixed premises vs. itinerant/home-based work) | Sustainability |
| Movement radius | Distance/spread of pings | Market reach — growing radius = expanding customer/supplier base | Inclusion, market access |
| Dwell time at work location during "business hours" | Stationary duration | Proxy for actual operating hours/days — more objective than self-report | Sustainability |
| Geofenced visits to bank/ATM/govt office | Visit frequency | Financial engagement without needing transaction content | Economic outcomes |
| GPS ping at training center matching scheduled session time | Location + timestamp match | Objective attendance verification — replaces self-reported "course completion," the weakest/most gameable indicator in the current framework | Capacity development |

## App & digital-behavior signals

| Signal | Raw capture | Livelihood inference | Dimension fed |
|---|---|---|---|
| Installed-app inventory (fintech: GPay/PhonePe/Khatabook/Vyapar/BharatPe; e-commerce seller apps; govt apps like UMANG) | Presence + install/uninstall timeline | Direct digital-capability tier; new installs right after a training module = behavioral proof the training changed real tool adoption, not just a certificate | Digital capability |
| App uninstalls (business tools specifically) | Removal events | Early-warning leading indicator of business slowdown — earlier than any survey round would catch it | Sustainability (early warning) |
| App usage duration/frequency by category | Foreground time | Engagement quality, not just adoption | Digital capability |
| Notifications (via Notification Listener, not SMS inbox) | Title/preview of incoming notifications | A permission-lighter substitute for reading full SMS; also proves an app is *actively used*, not just installed | Multiple |

## Device & network signals

| Signal | Raw capture | Livelihood inference | Dimension fed |
|---|---|---|---|
| Device model/OS upgrade events | Hardware change over time | Weak income proxy alone (phones are financed/gifted/shared) — only useful combined with other signals | Economic outcomes (weak/noisy) |
| Network type & data volume (2G→4G/WiFi) | Connectivity tier | Digital infrastructure access — tells the NGO *where* infra, not behavior, is the bottleneck | Digital capability |
| Dual-SIM presence | SIM count | Possible separation of personal vs. business line = formalization signal | Sustainability |
| Bluetooth-paired POS/card device | Paired device ID | Hard-to-fake evidence of accepting digital/card payments — stronger than self-report | Digital capability, Economic outcomes |

## Where the real inferential value is: combining signals

Any single signal above is a noisy proxy. The real product value is in **triangulating** two or three independent, cheap signals to corroborate one claim instead of trusting one:

- GPS-at-training-time + scheduled-session-time → attendance verification without self-report
- DBT scheme SMS + a later withdrawal/spend SMS → did the scheme money get *used*, not just received
- New bookkeeping-app install + rising transaction-SMS frequency in following weeks → closest thing to an individual-level "did training change behavior" signal, vs. a cohort-level correlation
- Device upgrade *without* a corresponding rise in transaction-SMS volume → a contradiction worth flagging (possible debt-financed purchase, not earned income)
- Call-network growth + GPS-radius growth + new e-commerce-seller-app install, moving together → a composite "market expansion" signal, more defensible to a government funder than any one proxy alone

*(Note: this triangulation logic is about measurement confidence, not causal attribution — see the separate "Correlation, Causation and Modular Architecture" note for that distinction.)*

## How each signal is actually collected **[Verified against current Android/Play docs, 2026-07-20]**

| Signal | API / Permission | Consent mechanism | Play Store scrutiny | Key constraint |
|---|---|---|---|---|
| SMS bank/UPI/loan/DBT/low-balance alerts | `NotificationListenerService` intercepting the default SMS app's notification, or the bank/fintech app's own push notification directly | Manual settings toggle (Settings → Notification access) | High — sensitive/fraud-flagged permission, needs clear Play justification | Forward-only (no historical inbox backfill); unreliable on aggressive-battery-management OEMs (Xiaomi/Vivo/Oppo/Realme) unless the app is also whitelisted from battery optimization; **[Verified]** does not function at all on low-RAM devices running Android Q (10) and below — the OS itself restricts listener access for performance reasons on those devices |
| Direct `READ_SMS`/`RECEIVE_SMS` (i.e., reading the SMS inbox directly) | — | Blocked in practice | Very high | Restricted since 2019 to apps registered as the user's **default SMS, Phone, or Assistant handler** — not realistic for this app. This is why Notification Listener is the actual mechanism used, not direct SMS reading |
| WhatsApp Business / e-commerce / govt-scheme app notifications | Same `NotificationListenerService`, filtered to an allowlist of known package names | Same as above | Same as above | All-or-nothing OS grant — the app itself must discard/never store or transmit anything outside the declared allowlist. This client-side filtering *is* the real DPDP/privacy-by-design control, not the OS permission |
| Call logs (numbers, duration, full history) | `READ_CALL_LOG` | Blocked in practice | Very high | Same default-handler restriction as SMS, tightened further by a July 2026 Play policy update narrowing `READ_CALL_LOG` use-cases. Only missed-call notifications leak through via Notification Listener as a weak partial substitute — no duration, no full log |
| Contacts list | `READ_CONTACTS` | Standard one-tap runtime dialog | Low | High-sensitivity data even though easy to obtain — deprioritized for MVP per the Responsible AI concerns already logged in memory |
| GPS location (foreground) | `FusedLocationProviderClient` + `ACCESS_FINE_LOCATION` | Standard one-tap runtime dialog | Low | — |
| GPS location (background — needed for dwell-time/attendance signals) | `ACCESS_BACKGROUND_LOCATION` | Separate follow-up dialog after a required in-app disclosure screen (cannot be combined with the foreground prompt since Android 11) | High — one of Play's most scrutinized permissions | Should use geofencing/significant-location-change APIs, not continuous polling, for battery reasons |
| Installed-app inventory (fintech/e-commerce/govt apps) | `PackageManager` + a `<queries>` manifest declaration listing ~20-30 known package names | **No permission dialog at all** | None | Deliberately avoids the restricted `QUERY_ALL_PACKAGES` permission, which Google Play reserves for launchers/antivirus/file-managers/device-management apps and would likely get an NGO app rejected if requested broadly |
| App usage duration/frequency | `UsageStatsManager` + `PACKAGE_USAGE_STATS` | Manual settings toggle (Settings → Special app access → Usage access) | Moderate | Cannot be requested via a normal permission dialog — a deliberate detour out of the app |
| Device model/OS version | `Build` class | No permission needed | None | Always available |
| Network type | `ConnectivityManager` | No permission needed | None | — |
| Network data volume | `NetworkStatsManager` | Piggybacks on Usage Access (`PACKAGE_USAGE_STATS`) | Moderate | — |
| Dual-SIM presence | `SubscriptionManager` + `READ_PHONE_STATE` | Standard one-tap runtime dialog | Low | — |
| Bluetooth-paired POS/card device | `BluetoothAdapter.getBondedDevices()` + `BLUETOOTH_CONNECT` (Android 12+) | Standard one-tap runtime dialog | Low | — |

## User journey — assisted onboarding for a smartphone beneficiary **[Recommended — not yet agreed with NGO/professor]**

Stacking the table above together, a single beneficiary's enrollment requires up to three separate detours into the phone's Settings app plus several permission dialogs. Given the beneficiary population is expected to be less digitally confident, this **cannot be a self-service app install** — the same field officer who administers the Tier 1 survey should walk the beneficiary through it as one guided session. Proposed flow:

1. **Baseline survey (Tier 1)** — administered as already planned for every beneficiary, smartphone or not.
2. **If smartphone-owning**: field officer installs/opens the NGO app on the beneficiary's phone.
3. **Consent screen** — plain-language, local-language (and read-aloud if literacy is a concern), explaining what will be collected and why, satisfying DPDP consent requirements. Field officer confirms verbal agreement with the beneficiary.
4. **One-tap permissions** — Location (foreground), Bluetooth, Phone State (dual-SIM) — field officer taps "Allow" for each with the beneficiary present.
5. **Background location** — a required in-app disclosure screen, then a settings deep-link where the beneficiary selects "Allow all the time."
6. **Notification Access** — manual detour to Settings → Notification access, toggled on by the field officer (this is what enables the SMS/fintech-notification-substitute signals).
7. **Usage Access** — manual detour to Settings → Special app access → Usage access, toggled on (enables app-usage-duration signals).
8. **Battery-optimization exemption** — whitelist the app so the Notification Listener and background location service keep running on aggressive-battery-management devices.
9. **Confirmation screen** — app confirms all permissions are active; ideally shows the beneficiary a preview of what they'll get back from the program (the beneficiary-value-exchange question is still open — see memory).
10. **Day-0 baseline snapshot** — app captures an initial device/network/installed-app snapshot, paired with the Tier 1 survey baseline for the same enrollment round.
11. **Ongoing** — Notification Listener, location, and usage-stats signals accumulate in the background; the app periodically syncs structured (already-filtered) data to the backend.
12. **Endline (3–6 months later)** — field officer returns for the Tier 1 endline survey; Tier 2 signals have been logging continuously over the same window. Both rounds land in the unified feature store keyed by the same `beneficiary_id`, enabling correlation and causal analysis (see the separate architecture note).

Planning estimate (not a measured figure): budget roughly 10–15 extra minutes per smartphone beneficiary beyond the survey itself, given the three manual settings detours. Beneficiaries should also have a visible "revoke consent / stop tracking" control at any time — this connects to the consent-revocability concern already logged in memory and hasn't been resolved by this journey design, only made concrete.

## Critical reality-check

**1. Reading SMS/Call Log directly is largely blocked on Android.** See the collection table above — this is why the architecture routes through Notification Listener instead. The source document's assumption that the SDK can just "read SMS financial alerts" is likely non-compliant for real Play Store distribution as written.

**2. iOS has no API for third-party SMS content access, period.** OS-level design, not a policy restriction. Any iPhone-using beneficiary is out of scope for SMS-based signals regardless of consent — "smartphone user" ≠ "SMS-signal-available user."

**3. The signal-equity gap.** Digital signal richness correlates with prior digital privilege. A beneficiary already comfortable with UPI/banking apps generates abundant measurable signal; a beneficiary growing a genuinely cash-only, informal business — arguably the person the NGO most needs to help — looks flat or invisible under this signal set, not because they aren't improving, but because their economy doesn't leave a digital trail. Left unaddressed, "improvement" ends up measured more accurately for people who needed the program least. This sharpens the peer-group-baseline bias concern already logged in project memory.

## Sources (verified 2026-07-20)

- [Use of SMS or Call Log permission groups — Play Console Help](https://support.google.com/googleplay/android-developer/answer/10208820?hl=en)
- [Permissions used only in default handlers — Android Developers](https://developer.android.com/guide/topics/permissions/default-handlers)
- [Policy announcement: July 15, 2026 — Play Console Help](https://support.google.com/googleplay/android-developer/answer/17134731?hl=en)
- [Notification access and notification listener policy — AOSP](https://source.android.com/docs/automotive/hmi/notifications/notification-access)
- [Package visibility filtering on Android — Android Developers](https://developer.android.com/training/package-visibility)
- [Use of the broad package (App) visibility (QUERY_ALL_PACKAGES) permission — Play Console Help](https://support.google.com/googleplay/android-developer/answer/10158779?hl=en)
