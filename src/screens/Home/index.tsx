import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BRAND } from "@/utils/brand";
import SafeView from "@/components/SafeView";
import TopBar from "@/components/TopBar";
import { NativeEventEmitter } from "react-native";
import Workspace from "@/database/models/Workspace";
import { useNavigation } from "@react-navigation/native";
import { PATHS } from "@/utils/paths";
import useRedirect from "@/hooks/useRedirect";
import { useEffect, useState } from "react";
import { resolveDefaultChatRoute } from "@/utils/defaultChatRoute";
import { useTranslation } from "react-i18next";

const eventEmitter = new NativeEventEmitter();

// Short, accurate descriptions of capabilities that exist in this app (see README.upstream.md).
const HOME_FEATURES = [
  { title: 'Local models', body: 'Download GGUF models and run them privately on your device.' },
  { title: 'Document chat', body: 'Ask questions about PDF, Word, Excel, PowerPoint and text files.' },
  { title: 'Your workspaces', body: 'Keep chats, documents and memory organised per workspace.' },
]
;

/**
 * Empty-state screen: only meant to be seen when no workspaces exist.
 * If any do, it immediately hands off to the thread the user last chatted in
 * so this screen never sits in front of an existing conversation.
 */
export default function Home() {
  useRedirect();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [checkingWorkspaces, setCheckingWorkspaces] = useState(true);

  useEffect(() => {
    let cancelled = false;
    resolveDefaultChatRoute().then((route) => {
      if (cancelled) return;
      if (!route) return setCheckingWorkspaces(false);
      navigation.reset({
        index: 0,
        // @ts-ignore
        routes: [{ name: PATHS.workspace_chat, params: route }],
      });
    });
    return () => { cancelled = true; };
  }, []);

  async function createWorkspace() {
    await Workspace.create({ name: t('home.default_workspace_name') })
      .then((workspace) => {
        eventEmitter.emit('workspaceUpdate', {
          type: 'add-workspace',
          details: {
            name: workspace.name,
            slug: workspace.slug,
            createdAt: workspace.createdAt,
            threads: workspace.threads,
          },
        });

        // @ts-ignore
        navigation.navigate(PATHS.workspace_chat, { wsSlug: workspace.slug, threadSlug: workspace.threads[0].slug });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <SafeView scrollable={false} safeAreaClassNames="pt-[21px]" containerClassNames="flex-1 flex flex-col" safeAreaStyle={{ backgroundColor: '#070b18' }} applyGradient>
      <TopBar />
      {/* flex-1 centers within the space left under the top bar - a fixed 90vh box sat below true center */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 24, gap: 20 }}
        showsVerticalScrollIndicator={false}>
        {checkingWorkspaces ? (
          <ActivityIndicator size="large" color="#2de2e6" />
        ) : (
          <>
            <Image source={require('@/assets/logo/nexvora-mark.png')} resizeMode="contain" style={{ width: 112, height: 112 }} />
            <View className="flex flex-col items-center justify-center gap-y-1">
              <Text className="text-3xl font-bold text-white text-center">{BRAND.appName}</Text>
              <Text className="text-white/70 text-center">{t('home.get_started')}</Text>
            </View>
            <View style={{ width: '100%', maxWidth: 420, gap: 10 }}>
              {HOME_FEATURES.map((feature) => (
                <View
                  key={feature.title}
                  style={{ backgroundColor: '#0d1426', borderColor: '#1f2a52', borderWidth: 1, borderRadius: 14, padding: 14 }}>
                  <Text style={{ color: '#2de2e6' }} className="text-base font-semibold">{feature.title}</Text>
                  <Text style={{ color: '#9aa6c4' }} className="text-sm">{feature.body}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              accessibilityRole="button"
              style={{ minWidth: 240, minHeight: 52, backgroundColor: '#2de2e6', borderRadius: 14, justifyContent: 'center' }}
              className="py-2 px-6"
              onPress={createWorkspace}>
              <Text style={{ color: '#032a30' }} className="text-center text-xl font-semibold">{t('home.create_workspace')}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeView>
  );
};
