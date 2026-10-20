# Source code availability (GPL-3.0-or-later)

NexVora LLM Studio is distributed under the GNU General Public License v3.0 or later (see `LICENSE`).

## For people who receive the app
You are entitled to the complete corresponding source code of the version you received, under the same license. Ask the
developer through **Settings → About NexVora → About Developer**, or use the link in **Credits & Legal** once the publisher
has set one. You may modify and redistribute it under the GPL.

## For the publisher (NexVora Lab's Ofc), before distributing an APK
This is a practical checklist, not legal advice. GPL section 6 allows several ways to provide source; the simplest is:
1. Publish the exact source of the released version (this repository/ZIP, including `LICENSE`, `NOTICE.md`, `BUILDING.md`, `yarn.lock`, the workflow and build scripts) in a public place **next to the APK download**, for example a tagged GitHub release.
2. Set `BRAND.sourceCodeUrl` in `src/utils/brand.ts` to that URL so the app links to it.
3. Keep every upstream copyright and license notice, and keep the "modified by NexVora" notices in `NOTICE.md`.
4. Do not add terms that restrict recipients' GPL rights (for example "All Rights Reserved" over the code). The NexVora copyright line applies to NexVora's own branding and contributions.
5. If you ever stop publishing source with the APK, the GPL requires a written offer valid for at least three years instead; talk to a lawyer before relying on that.
