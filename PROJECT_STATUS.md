# Project status (honest report)

## Verified
- All JSON files edited (`package.json`, locale files) parse; `node scripts/translations/verify.mjs` passes (all 17 locales match English).
- Gradle files, manifest, workflow YAML were edited by hand and checked by reading/YAML parse only.
- No Firebase/Crashlytics references remain in Gradle, manifest, `package.json`, `index.js` or source imports.

## NOT verified (no network or Android toolchain in the authoring environment)
- `yarn install`, full `tsc --noEmit` (needs node_modules), `jest` and `eslint` were **not run**. A syntax-only TypeScript parse of every edited/new `.ts/.tsx` file found no syntax errors, and every `@/` and relative import in those files resolves to an existing file. Type errors and runtime/layout bugs are still possible, especially in the new Model Library and chat styling.
- **No APK has been built.** The workflow has not been run by the author.
- No on-device test of: GGUF download/inference, document chat/RAG, assistant, share-to-app, scheduled jobs, ChatGPT sign-in.
- `yarn.lock` was pruned by script; Yarn may want to adjust it (see BUILDING.md).

## External dependencies on the original project (resolved in code, not yet tested on a device)
- The bundled SearXNG endpoint **and its embedded key** were removed; `src/utils/endpoints.ts` is empty by default.
- The IP-geolocation call to the original authors' server was removed, and the location tool is off by default (the chat-suggestion code that used it now simply gets "no location").
- You.com keyless search is a third-party service that is still used by the web-search tool.
- `nexvora://` deep-link scheme added; legacy `anythingllm://` kept for Hugging Face links (see README).
- ChatGPT sign-in now identifies the app as NexVora LLM Studio; it is untested.

## UI redesign status (presentation layer only; logic untouched)
Redesigned with the NexVora design system (navy surfaces, cyan primary, violet accent):
- **Model Library** (`Settings > AI provider > On-device`): new model cards (status chips, size, quantisation parsed from the file name, linear download progress, explicit Download / Use model / Cancel / Uninstall buttons, expandable Details incl. device fit), new header with device RAM, search across all models and Suggested / Installed / All filters. Download, select, cancel and uninstall still call the original handlers (`useModelManager`).
- **Chat**: new user bubble, assistant identity row and accent rule, restyled suggestion cards, new top bar (cyan icons, divider), prompt sheet border. Streaming, stop/regenerate, citations, attachments, tools and the keyboard/bottom-sheet logic are unchanged.
- **Home** (empty state), **drawer** (brand header, active-workspace card, cyan primary button), **onboarding** (new artwork, new preset cards), **About / Credits**.
- Remaining screens (document files sheet, provider forms, scheduled jobs, etc.) inherit the new palette and gray normalisation but keep their original layouts.

NOT done: a separate "dashboard" route (the app still opens straight into the last chat; Home appears only when no workspace exists), a chat-history screen separate from the drawer, model capability tags (the app has no capability metadata to show), structural redesign of the document workspace and provider forms.

## Not done yet
- `images/` README screenshots (upstream assets, used only by `README.upstream.md`) are not NexVora's.
- Generated third-party license inventory (see NOTICE.md).
- Set `BRAND.sourceCodeUrl` (see `SOURCE.md`) before distributing an APK.
- New UI strings (model library, About, Home) are English-only; other languages fall back to the same English text.
