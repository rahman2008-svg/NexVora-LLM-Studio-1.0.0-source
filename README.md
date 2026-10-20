# NexVora LLM Studio

A mobile-first AI workspace for local language models, document chat and private conversations, for Android.

- **Developer:** Prince AR Abdur Rahman
- **Publisher:** NexVora Lab's Ofc
- **Version:** 1.0.0 · **Application ID:** `com.nexvora.llmstudio`
- **Copyright:** © 2026 NexVora Lab's Ofc. All Rights Reserved. This notice covers NexVora's original branding and original contributions only, not third-party code owned by other copyright holders.

## What it is

NexVora LLM Studio is a modified version of **AnythingLLM Mobile** by Mintplex Labs
(<https://github.com/Mintplex-Labs/anythingllm-mobile>). It keeps the upstream feature set: on-device GGUF
inference through `llama.rn`, a Hugging Face model browser with device-fit hints, AI chat with history, retry/fork and
export, document chat (PDF, Word, Excel, PowerPoint, text) with on-device RAG, memory, built-in tools, voice input,
share-to-app, Android assistant integration, scheduled jobs, and the existing cloud/local model providers. See
`README.upstream.md` for the original description.

It is **not** the official AnythingLLM app and is not endorsed by Mintplex Labs.

## What NexVora changed

See [CHANGELOG.md](CHANGELOG.md) and [NOTICE.md](NOTICE.md). In short: new name, identity, icon, cyan-violet theme and
About/Credits screens; Firebase Analytics and Crashlytics removed; update-check, issue-report and CDN media links that
pointed to the original project disabled.

## License (important)

This project is licensed under the **GNU General Public License v3.0 or later** (see [LICENSE](LICENSE)), because it is a
derivative of GPL-3.0-or-later software. If you distribute this app (for example an APK), you must also make the
corresponding source code available under the same license and keep the copyright and license notices. NexVora's
branding (name, logo, icon) is NexVora's; the code is GPL.

## Optional services and credentials

NexVora LLM Studio ships with **no** server credentials and no endpoint run by the original authors.

| Feature | Behaviour in this build | To enable / change |
|---|---|---|
| Web search tool | Uses You.com's keyless public search API (the query and your IP go to You.com). Falls back to nothing. | Optional self-hosted SearXNG fallback: set `ENDPOINTS.searxngUrl` (and key header/value) in `src/utils/endpoints.ts`. |
| Approximate-location tool | **Off by default and unavailable**: no IP lookup is made. | Set `ENDPOINTS.geolocationUrl` (HTTPS JSON in ip-api.com shape) and enable the tool. |
| In-app update check / "report on GitHub" | Disabled (no NexVora server/tracker yet). | Fill `remote_version_url`, `github_new_issue` in `src/utils/paths.ts`. |
| Deep links | `nexvora://pull-hf?...` and the legacy `anythingllm://pull-hf?...` (needed by Hugging Face's "Use this model" button). If the original AnythingLLM app is also installed, Android asks which app opens `anythingllm://` links. | Remove the `anythingllm` intent-filter in `AndroidManifest.xml` to drop the legacy scheme. |
| ChatGPT sign-in (experimental) | Uses OpenAI's dynamic client registration and shows the app as "NexVora LLM Studio". Untested in this build; check OpenAI's current terms before relying on it. | No credentials stored in the repo. |
| Cloud providers (OpenAI, Anthropic, Gemini, ...) | Work only with **your own API keys** entered in the app. | Nothing to configure in source. |

## Build

See [BUILDING.md](BUILDING.md). Short version: run the **Android Debug APK** workflow in GitHub Actions and download
the `nexvora-llm-studio-debug-apk` artifact.

## Project status

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for what was and was not verified.
