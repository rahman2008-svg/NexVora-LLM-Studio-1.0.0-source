import useModelManager from '@/hooks/useModelManager';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MagnifyingGlass } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModelCard from '@/components/ModelCard';
import { groupModelsByProvider, ProviderSectionHeader } from '@/components/ModelCard/ProviderSections';
import { useState, useEffect, Fragment, useCallback, useMemo } from 'react';
import OnDeviceProvider from '@/utils/AiProviders/onDevice';
import { resolveDestinationPathFromGGUFUrl } from '@/utils/models/defaults';
import * as RNFS from '@dr.pogodin/react-native-fs';
import HuggingFaceImport from '@/components/HuggingFaceImport';
import AddFromHuggingFaceCard from '@/components/HuggingFaceImport/AddCard';
import ImportedModels, { ImportedModel } from '@/utils/models/imported';
import useModelFit from '@/hooks/useModelFit';
import { consumePendingHfPull, PendingHfPull } from '@/utils/DeepLinks';
import { useTranslation } from 'react-i18next';

interface NativeOptionsProps {
  llmPreferences: any;
  fetchLLMPreference: () => Promise<void>;
  LLMProvider: any;
}

export default function NativeOptions({
  llmPreferences,
  fetchLLMPreference,
  LLMProvider,
}: NativeOptionsProps) {
  const { t } = useTranslation();
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  type LibraryFilter = 'suggested' | 'installed' | 'all';
  const [filter, setFilter] = useState<LibraryFilter>('suggested');
  const [query, setQuery] = useState('');
  const [showImport, setShowImport] = useState(false);
  // Set when the picker was opened by an anythingllm://pull-hf link: the repo to show and the file to highlight.
  const [importPull, setImportPull] = useState<PendingHfPull | null>(null);
  const {
    modelDownloadUrl,
    downloadProgress,
    selectedModel,
    downloadModel,
    cancelDownload,
    uninstallModel,
    runPreDownloadConfirmations,
  } = useModelManager({ llmPreferences, fetchLLMPreference, LLMProvider });

  const fetchModels = useCallback(async () => {
    if (LLMProvider) {
      const models = await (LLMProvider as OnDeviceProvider).availableModels();
      for (const model of models) {
        // @ts-ignore
        const path = resolveDestinationPathFromGGUFUrl(model.downloadUrl);
        // @ts-ignore
        model.isDownloaded = await RNFS.exists(path);
      }
      setAvailableModels(models);
    } else setAvailableModels([]);
  }, [LLMProvider]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // Hugging Face "Use this model" deep link: open the picker on the requested repo with the file
  // highlighted. Downloading still goes through the regular confirmation in `downloadModel`.
  useEffect(() => {
    const pull = consumePendingHfPull();
    if (!pull) return;
    setImportPull(pull);
    setShowImport(true);
  }, []);

  const closeImport = () => {
    setShowImport(false);
    setImportPull(null);
  };

  /**
   * The user picked a quant in the import modal. Run the usual network / size confirmations
   * while the modal is still up so a "Cancel" leaves them on the quant list. Once approved:
   * persist it, refresh the list so the new card is visible with its progress bar, close the
   * modal and download.
   */
  const importAndDownload = async (imported: ImportedModel) => {
    const model = {
      id: imported.modelId,
      modelId: imported.modelId,
      name: imported.name,
      description: imported.description,
      size: imported.size,
      downloadUrl: imported.downloadUrl,
      isPreset: false,
      isImported: true,
      provider: imported.author,
    };
    const onDisk = await RNFS.exists(resolveDestinationPathFromGGUFUrl(model.downloadUrl));
    if (!onDisk && !(await runPreDownloadConfirmations(model))) return false;
    await ImportedModels.add(imported);
    await fetchModels();
    closeImport();
    const started = await downloadModel(model, false);
    await fetchModels(); // pick up isDownloaded once the download settles
    return started;
  };

  const handleUninstall = async (model: any) => {
    const removed = await uninstallModel(model);
    if (removed) await fetchModels();
    return removed;
  };

  // Always show the currently selected model, even when it is not a preset,
  // so a model found in storage that is no longer in our list is still visible.
  // Models the user added from Hugging Face are always shown too.
  const normalizedQuery = query.trim().toLowerCase();
  const matchesQuery = (model: any) =>
    [model.name, model.modelId, model.provider, model.description]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(normalizedQuery));
  // Searching looks through the whole catalog, whatever filter chip is active.
  const displayedModels = normalizedQuery
    ? availableModels.filter(matchesQuery)
    : filter === 'all'
      ? availableModels
      : filter === 'installed'
        ? availableModels.filter(model => model.isDownloaded)
        : availableModels.filter(model => model.isPreset || model.isImported || model.modelId === selectedModel);

  const sections = groupModelsByProvider(displayedModels);

  // Memory badges for every row plus a "Recommended" callout on the preset that suits this phone.
  const presets = useMemo(() => availableModels.filter(model => model.isPreset), [availableModels]);
  const { fitFor, recommendedId, memory } = useModelFit(presets);
  const installedCount = availableModels.filter(model => model.isDownloaded).length;
  const ramLabel = memory ? `${(memory.total / 1e9).toFixed(1)} GB RAM` : 'RAM unknown';

  return (
    <Fragment>
      {/* Library header: device summary, search and filters */}
      <View style={{ backgroundColor: '#0d1426', borderColor: '#1f2a52', borderWidth: 1, borderRadius: 18, padding: 14, gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>Model Library</Text>
            <Text style={{ color: '#9aa6c4', fontSize: 12 }}>
              {installedCount} installed · {availableModels.length} available
            </Text>
          </View>
          <View style={{ backgroundColor: 'rgba(45,226,230,0.12)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ color: '#2de2e6', fontSize: 12, fontWeight: '600' }}>{ramLabel}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#070b18', borderColor: '#1f2a52', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12 }}>
          <MagnifyingGlass size={18} color="#9aa6c4" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search models"
            placeholderTextColor="#9aa6c4"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search models"
            style={{ flex: 1, color: '#FFFFFF', paddingVertical: 10 }}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {([
            ['suggested', 'Suggested'],
            ['installed', 'Installed'],
            ['all', 'All models'],
          ] as [LibraryFilter, string][]).map(([key, label]) => {
            const active = !normalizedQuery && filter === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setQuery('');
                  setFilter(key);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: active ? '#2de2e6' : '#1f2a52',
                  backgroundColor: active ? 'rgba(45,226,230,0.15)' : 'transparent',
                }}>
                <Text style={{ color: active ? '#2de2e6' : '#9aa6c4', fontSize: 13, fontWeight: '600' }}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {displayedModels.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 24, gap: 6 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
            {normalizedQuery ? 'No models match your search' : filter === 'installed' ? 'No models installed yet' : 'No models available'}
          </Text>
          <Text style={{ color: '#9aa6c4', textAlign: 'center' }}>
            {filter === 'installed' && !normalizedQuery
              ? 'Pick a model from Suggested or All models to download it.'
              : 'Try another search, or add a GGUF model from Hugging Face below.'}
          </Text>
        </View>
      )}
      {sections.map((section, sectionIndex) => (
        <Fragment key={`section-${section.title ?? 'presets'}`}>
          {section.title && <ProviderSectionHeader title={section.title} />}
          {section.models.map((model, index) => (
            <ModelCard
              key={`settings-${sectionIndex}-${model.modelId}-${index}`}
              model={model}
              isSelected={selectedModel === model.modelId}
              isDownloaded={model.isDownloaded}
              modelDownloadUrl={modelDownloadUrl}
              downloadProgress={downloadProgress}
              memoryFit={fitFor(model)}
              isRecommended={model.id === recommendedId}
              onSelect={() => downloadModel(model)}
              onUninstall={() => handleUninstall(model)}
              onCancelDownload={cancelDownload}
            />
          ))}
        </Fragment>
      ))}
      <AddFromHuggingFaceCard onPress={() => setShowImport(true)} />

      <Modal
        visible={showImport}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeImport}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0d1426' }}>
          <View className="flex-1 pt-3">
            <HuggingFaceImport
              initialQuery={importPull?.repo ?? ''}
              highlightFilename={importPull?.file ?? undefined}
              onDownload={importAndDownload}
              installedModelIds={availableModels.filter(m => m.isImported && m.isDownloaded).map(m => m.modelId)}
              activeDownloadUrl={modelDownloadUrl}
              downloadProgress={downloadProgress}
              onBack={closeImport}
              useStandardFlatList
            />
          </View>
        </SafeAreaView>
      </Modal>
    </Fragment>
  );
}
