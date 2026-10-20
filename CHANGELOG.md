# Changelog

## 1.0.0 (2026)

First NexVora LLM Studio release, forked from AnythingLLM Mobile 1.3.2.

- Rebrand: name, application ID `com.nexvora.llmstudio`, icon, logo, theme, export wordmarks, strings in all locales.
- New About NexVora section: Developer, Company, Technical Information, Credits & Legal.
- Removed Firebase Analytics and Crashlytics; telemetry module is a no-op.
- Disabled in-app update check, GitHub issue link, Play Store link and highlight-video CDN (they pointed at the original project).
- Removed Clash Display font dependency; uses Inter.
- Removed the bundled SearXNG key/endpoint and the original authors' geolocation call; added `src/utils/endpoints.ts`.
- Added `nexvora://` deep-link scheme (legacy `anythingllm://` kept).
- New original onboarding artwork, Home screen and drawer header.
- Redesigned Model Library (cards, search, filters, details, progress), chat bubbles/top bar/suggestions, drawer, Home and onboarding preset cards.
- Added `SOURCE.md` (GPL source-availability instructions).
- Added GitHub Actions workflow for a baseline debug APK.
