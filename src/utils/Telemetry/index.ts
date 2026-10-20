/**
 * NexVora LLM Studio - privacy-preserving telemetry stub.
 *
 * The original project reported usage events and crash reports to a Firebase project owned by its
 * authors. NexVora LLM Studio does NOT include Firebase Analytics or Crashlytics, and this module
 * never sends any data anywhere: events and errors are discarded (or printed to the local debug
 * console in debug builds only).
 *
 * The public API (method names, signatures and CUSTOM_EVENTS) is kept identical to the original so
 * every existing call site keeps working unchanged. If analytics are ever added, they must be
 * opt-in and clearly disclosed to the user.
 */
class Telemetry {
    private static instance: Telemetry;

    CUSTOM_EVENTS = {
        ONBOARDING: {
            COMPLETED: 'onboarding_completed',
            SURVEY_RESPONSE: 'onboarding_survey_response',
        },
        ACTIONS: {
            WORKSPACE_CREATED: 'workspace_created',
            CHAT_COMPLETED: 'chat_completed',
            /** The user pressed stop while a reply was generating - nothing was saved */
            CHAT_ABORTED: 'chat_aborted',
            /** A document was attached to a workspace (payload: documentType, mode = embedded | full) */
            DOCUMENT_IMPORTED: 'document_added',
            /** An image was attached to a prompt from the gallery, the camera or the share sheet (payload: source) */
            IMAGE_ATTACHED: 'image_attached',
            /** Another app shared files/images to the app through the share sheet (payload: files, images) */
            CONTENT_SHARED: 'content_shared',
            /** An app deep link (pull-hf) (Hugging Face "Use this model") opened the on-device picker (payload: repo, hasFile) */
            HF_PULL_LINK_OPENED: 'hf_pull_link_opened',
            /** Text highlighted in another app was sent to the Quick Actions card (payload: mode, action) */
            QUICK_CONTEXT_USED: 'quick_context_used',
            /** The selection-toolbar entry was switched on or off in Settings > Special tools (payload: enabled) */
            QUICK_CONTEXT_TOGGLED: 'quick_context_toggled',
            /** "Set up" / "Change" in Settings > Device Assistant, which opens Android's assistant settings (payload: alreadyDefault) */
            ASSISTANT_SETUP_OPENED: 'assistant_setup_opened',
            /** The assist gesture opened the assistant overlay */
            ASSISTANT_INVOKED: 'assistant_invoked',
            /** A prompt was sent from the assistant overlay (payload: screenshot, voice, followUp) */
            ASSISTANT_CHAT_SENT: 'assistant_chat_sent',
            /** An assistant behavior was switched in Settings > Assistant (payload: preference, enabled) */
            ASSISTANT_PREFERENCE_TOGGLED: 'assistant_preference_toggled',
            /** A background theme was picked in Settings > Assistant (payload: theme) */
            ASSISTANT_THEME_CHANGED: 'assistant_theme_changed',
            TOOL_CALLED: 'tool_called',
            /** The user switched a tool on from the tools sheet (payload: tool, provider) - disabling and suggestion-chip toggles are not tracked */
            TOOL_ENABLED: 'tool_enabled',
            LLM_SETTINGS_UPDATED: 'llm_settings_updated',
            /** A chat thread was exported (txt/md/json/pdf) and handed to the share sheet */
            THREAD_EXPORTED: 'thread_exported',
            /** A chat thread was forked into a new thread with a copy of its history */
            THREAD_FORKED: 'thread_forked',
            /** A user/assistant message pair was deleted from a thread */
            CHAT_DELETED: 'chat_deleted',
            /** A user/assistant message pair was removed and its prompt re-submitted */
            CHAT_RETRIED: 'chat_retried',
            /** The user switched the memory system on (disabling is not tracked) */
            MEMORIES_ENABLED: 'memories_enabled',
            /** The user saved a memory from the thread menu (payload: scope) */
            MEMORY_SAVED: 'memory_saved',
            /** A scheduled job was created (payload: tools count, notify) */
            SCHEDULED_JOB_CREATED: 'scheduled_job_created',
            SCHEDULED_JOB_RAN: 'scheduled_job_ran',
            /** The user approved a reminder from chat (payload: kind alarm|timer|calendar) */
            REMINDER_SET: 'reminder_set',
            /** The feature highlights carousel was dismissed (payload: audience new_user|upgrade, cards) */
            HIGHLIGHTS_VIEWED: 'highlights_viewed',

            /** The user use the QR code to connect to an external instance */
            EXTERNAL_CONNECTION_ESTABLISHED: 'external_connection_established',
            /** External workspace imported from a desktop instance */
            EXTERNAL_WORKSPACE_IMPORTED: 'external_workspace_imported',
        },
        /** The user switched anonymous telemetry off - kept only for source compatibility */
        DISABLED_TELEMETRY: 'disabled_telemetry',
    } as const;

    constructor() {
        if (Telemetry.instance) return Telemetry.instance;
        Telemetry.instance = this;
    }

    log(message: any, ...args: any[]) {
        if (__DEV__) console.log('[Telemetry:disabled]', message, ...args);
    }

    /** No-op: events are never recorded or transmitted. */
    logEvent(_name: string, _params: Record<string, any> = {}) {
        // Intentionally empty.
    }

    /** No-op: errors are never transmitted. Kept so error boundaries can call it safely. */
    recordError(_error: Error, _context?: string) {
        // Intentionally empty.
    }

    /**
     * Runs the given native model load as-is. The original wrapped it with crash-report context;
     * here it simply forwards to `load` with no side effects and no data collection.
     */
    async trackNativeModelLoad<T>(
        _kind: string,
        _path: string,
        _details: Record<string, string | number | boolean>,
        load: () => Promise<T>,
    ): Promise<T> {
        return load();
    }

    /** Telemetry is permanently off in this build. */
    async isEnabled(): Promise<boolean> {
        return false;
    }

    /** No-op: there is nothing to switch on. */
    async setEnabled(_enabled: boolean): Promise<void> {
        // Intentionally empty.
    }
}

const telemetry = new Telemetry();
export default telemetry;
