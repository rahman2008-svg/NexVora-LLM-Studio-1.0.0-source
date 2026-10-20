# Building NexVora LLM Studio

## Requirements (taken from the repository's real configuration)

| Tool | Version |
|---|---|
| Node.js | 20.19.5 (`.nvmrc`; `engines` >= 20.19.4) |
| Yarn | 1.22.22 (`packageManager`) |
| JDK | 17 |
| Gradle | 8.14.3 (wrapper) |
| Android compileSdk / targetSdk / minSdk | 36 / 36 / 24 |
| Build tools / NDK / CMake | 36.0.0 / 27.1.12297006 / 3.22.1 |
| ABI | arm64-v8a only |

`yarn install` runs `patch-package` and downloads the prebuilt `librnllama*.so` files into
`node_modules/llama.rn/android/src/main/jniLibs`. This needs internet access.

## Debug APK from your phone (GitHub Actions)

1. Push the whole project (this folder's contents, with `package.json` at the repository root) to a GitHub repository on `main`.
2. Open **Actions → Android Debug APK → Run workflow**.
3. When it finishes, download the artifact `nexvora-llm-studio-debug-apk`, unzip it, and install `app-debug.apk`
   (allow "install unknown apps" for your browser/file manager).
4. If a step fails, open that step's log and send the last 30 lines to the developer. Do not guess.

The workflow bundles the JavaScript into the APK so the debug build runs without a Metro dev server. It uses the
repository's `debug.keystore`; no secrets are needed.

## Local debug build

```bash
yarn install --frozen-lockfile
cp .env.example .env
cd android && ./gradlew assembleDebug
```

## Release build (documented, not run here)

1. Create your own upload keystore; **never commit it**. The Gradle `release` signing config expects
   `android/app/anythingllm-upload-key.keystore` with alias `anythingllm-keystore`; change those names in
   `android/app/build.gradle` if you prefer your own.
2. Provide `APP_RELEASE_STORE_PASSWORD` and `APP_RELEASE_KEY_PASSWORD` through your CI secret store or an untracked `.env`.
3. Run `yarn build:android:release` (see `scripts/buildAndroidRelease.js`).

## Lockfile note

Firebase packages were removed from `package.json`, and `yarn.lock` was pruned by script (not by running Yarn).
The workflow tries `--frozen-lockfile` first and falls back to a normal install if Yarn wants to adjust the lockfile,
then uploads the resulting `yarn.lock` as an artifact. If that happens, commit that file.
