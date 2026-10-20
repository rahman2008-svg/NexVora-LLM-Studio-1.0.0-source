import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { DownloadSimple, Cube, Question, CaretDown, CaretUp, CheckCircle, X } from 'phosphor-react-native';
import MODEL_CARDS from '@/utils/models/defaults';
import { findMonoProviderIcon } from '@/components/MonoProviderIcon';
import truncate from 'truncate';
import { MemoryFitBadge, RecommendedBadge } from '@/components/ModelCard/FitBadges';
import type { MemoryFit } from '@/utils/models/memoryFit';
import { MEMORY_FIT_LABELS } from '@/utils/models/memoryFit';
import { useTranslation } from 'react-i18next';

/**
 * NexVora Model Library card.
 *
 * Props and behaviour are identical to the original card (tap = select/download, tap while downloading =
 * cancel, uninstall button), so every caller keeps working. Only the presentation changed: status chips,
 * a linear download progress bar, an explicit action button and an expandable details panel.
 */

interface ModelCardProps {
  model: any;
  isSelected: boolean;
  isDownloaded: boolean;
  modelDownloadUrl: string | null;
  /** 0-100 */
  downloadProgress: number;
  onSelect: () => void;
  onUninstall: () => void;
  /** Tapping a card that is downloading cancels it (the handler confirms first). */
  onCancelDownload?: () => void;
  /** Device-memory verdict for this model's weights, see `useModelFit`. null/undefined shows no badge. */
  memoryFit?: MemoryFit | null;
  /** Marks the row as the best pick for this phone. */
  isRecommended?: boolean;
}

const C = {
  card: '#0d1426',
  cardSelected: '#0f2236',
  border: '#1f2a52',
  cyan: '#2de2e6',
  violet: '#8b5cf6',
  muted: '#9aa6c4',
  text: '#FFFFFF',
  ok: '#34d399',
};

/**
 * Quantisation read from the GGUF file name (for example `Qwen3.5-2B-Q8_0.gguf` -> `Q8_0`).
 * This is derived from the name only, so it is null when the file name does not carry one.
 */
export function quantFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const file = (url.split('?')[0].split('/').pop() || '').replace(/\.gguf$/i, '');
  const match = file.match(/[-_.](IQ\d_[A-Z0-9]+|Q\d(?:_[A-Z0-9]+)+|Q\d|BF16|F16|F32)(?=[-_.]|$)/i);
  return match ? match[1].toUpperCase() : null;
}

function hostFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(/^https?:\/\/([^/]+)/i);
  return match ? match[1] : null;
}

function Chip({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
      <Text style={{ color, fontSize: 10, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text style={{ color: C.muted, fontSize: 12 }}>{label}</Text>
      <Text selectable style={{ color: C.text, fontSize: 12, flexShrink: 1, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}

export default function ModelCard({
  model,
  isSelected,
  isDownloaded,
  modelDownloadUrl,
  downloadProgress,
  onSelect,
  onUninstall,
  onCancelDownload,
  memoryFit = null,
  isRecommended = false,
}: ModelCardProps) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  const getModelIcon = () => {
    // Only the preset alias rows (Lightweight/Balanced/Powerful) use their phosphor icon.
    const defaultCard = model.isPreset ? MODEL_CARDS.find(card => card.id === model.id) : undefined;
    if (defaultCard?.Icon) {
      const Icon = defaultCard.Icon;
      return <Icon size={26} color={C.cyan} />;
    }
    const MonoIcon = findMonoProviderIcon({
      provider: model.provider,
      modelName: model.modelId || model.id || model.name,
    });
    if (MonoIcon) return <MonoIcon width={24} height={24} color={C.cyan} style={{}} />;
    if (model.imageUrl) {
      return <Image source={{ uri: model.imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />;
    }
    const Icon = model.isUnknown ? Question : Cube;
    return <Icon size={26} color={C.cyan} />;
  };

  const isDownloading = modelDownloadUrl === model.downloadUrl;
  const percent = Math.max(0, Math.min(100, Math.round(downloadProgress || 0)));
  const quant = quantFromUrl(model.downloadUrl);
  const host = hostFromUrl(model.downloadUrl);
  const borderColor = isSelected ? C.cyan : isDownloading ? C.violet : C.border;

  return (
    <TouchableOpacity
      disabled={!!modelDownloadUrl && modelDownloadUrl !== model.downloadUrl}
      onPress={isDownloading && onCancelDownload ? onCancelDownload : onSelect}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={model.name}
      style={{
        borderWidth: isSelected ? 2 : 1,
        borderColor,
        backgroundColor: isSelected ? C.cardSelected : C.card,
        borderRadius: 18,
        padding: 14,
        width: '100%',
        gap: 10,
        opacity: !!modelDownloadUrl && modelDownloadUrl !== model.downloadUrl ? 0.55 : 1,
      }}>
      {/* Header: icon, name, status chips */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: '#13203d',
            borderColor: C.border,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {getModelIcon()}
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ color: C.text, fontSize: 16, fontWeight: '600' }}>
            {model.name}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {isSelected && <Chip label="Active" color="#032a30" bg={C.cyan} />}
            {isDownloaded && !isSelected && <Chip label="Installed" color={C.ok} bg="rgba(52,211,153,0.15)" />}
            {isDownloading && <Chip label={`Downloading ${percent}%`} color="#e4dbff" bg="rgba(139,92,246,0.35)" />}
            {!!model.size && <Chip label={String(model.size)} color={C.muted} bg="rgba(154,166,196,0.15)" />}
            {!!quant && <Chip label={quant} color="#c2f6fd" bg="rgba(45,226,230,0.14)" />}
            {model.isUnknown && <Chip label={t('common.unknown')} color="#fde68a" bg="rgba(234,179,8,0.25)" />}
            {/* Recommended already implies a good fit, so only one of the two pills shows. */}
            {isRecommended ? <RecommendedBadge /> : <MemoryFitBadge fit={memoryFit} />}
          </View>
        </View>
      </View>

      {!!model.description && (
        <Text style={{ color: C.muted, fontSize: 13, lineHeight: 18 }}>{truncate(String(model.description), 140)}</Text>
      )}

      {/* Real download progress (value comes from the existing download manager) */}
      {isDownloading && (
        <View style={{ gap: 6 }}>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <View style={{ width: `${percent}%`, height: '100%', backgroundColor: C.cyan }} />
          </View>
          <Text style={{ color: C.muted, fontSize: 11 }}>Tap the card or Cancel to stop this download.</Text>
        </View>
      )}

      {/* Actions */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <TouchableOpacity
          onPress={() => setShowDetails(v => !v)}
          accessibilityRole="button"
          accessibilityLabel="Model details"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ color: C.muted, fontSize: 12 }}>Details</Text>
          {showDetails ? <CaretUp size={12} color={C.muted} /> : <CaretDown size={12} color={C.muted} />}
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          {isDownloading ? (
            onCancelDownload ? (
              <TouchableOpacity
                onPress={onCancelDownload}
                accessibilityRole="button"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(248,113,113,0.15)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
                <X size={14} color="#f87171" weight="bold" />
                <Text style={{ color: '#f87171', fontSize: 13, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
            ) : null
          ) : (
            <>
              {isDownloaded && (
                <TouchableOpacity
                  onPress={onUninstall}
                  accessibilityRole="button"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ color: C.text, fontSize: 13, fontWeight: '500' }}>{t('common.uninstall')}</Text>
                </TouchableOpacity>
              )}
              {isSelected ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6 }}>
                  <CheckCircle size={18} color={C.cyan} weight="fill" />
                  <Text style={{ color: C.cyan, fontSize: 13, fontWeight: '600' }}>In use</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={onSelect}
                  accessibilityRole="button"
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.cyan, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                  {!isDownloaded && <DownloadSimple size={16} color="#032a30" weight="bold" />}
                  <Text style={{ color: '#032a30', fontSize: 13, fontWeight: '700' }}>{isDownloaded ? 'Use model' : 'Download'}</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {showDetails && (
        <View style={{ borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10, gap: 6 }}>
          {!!model.modelId && <DetailRow label="Model" value={String(model.modelId)} />}
          {!!model.provider && <DetailRow label="Publisher" value={String(model.provider)} />}
          {!!model.size && <DetailRow label="Download size" value={String(model.size)} />}
          <DetailRow label="Format" value="GGUF" />
          <DetailRow label="Quantisation" value={quant ?? 'Not stated in file name'} />
          {!!host && <DetailRow label="Source" value={host} />}
          <DetailRow
            label="Device fit"
            value={
              memoryFit === 'ok'
                ? 'Fits in this device\'s memory'
                : memoryFit
                  ? t(MEMORY_FIT_LABELS[memoryFit].full)
                  : 'Unknown (device memory not available)'
            }
          />
          <DetailRow label="Status" value={isDownloading ? 'Downloading' : isDownloaded ? 'Installed on this device' : 'Not downloaded'} />
        </View>
      )}
    </TouchableOpacity>
  );
}
