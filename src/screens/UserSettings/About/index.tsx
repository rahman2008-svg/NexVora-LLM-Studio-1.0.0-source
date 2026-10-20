import { useRef, useState } from 'react';
import { Linking, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import {
  ArrowLeft,
  ArrowSquareOut,
  Buildings,
  CaretRight,
  Cpu,
  FacebookLogo,
  InstagramLogo,
  Scales,
  User,
  WhatsappLogo,
} from 'phosphor-react-native';
import SafeView from '@/components/SafeView';
import useHighjackBackButtonPress from '@/hooks/useHighjackBackButtonPress';
import { showToast } from '@/utils/Notification';
import { BRAND, whatsappUrl } from '@/utils/brand';
import { IWorkspacePageKey } from '../index';

type AboutView = 'hub' | 'developer' | 'company' | 'technical' | 'credits';

interface AboutProps {
  goToPage: (page: IWorkspacePageKey) => void;
  /** Which sub-screen to open first. Defaults to the About hub. */
  initialView?: AboutView;
}

const COLORS = {
  bg: '#070b18',
  card: '#0d1426',
  border: '#1f2a52',
  text: '#FFFFFF',
  muted: '#9aa6c4',
  cyan: '#2de2e6',
  violet: '#8b5cf6',
};

const TITLES: Record<AboutView, string> = {
  hub: 'About NexVora',
  developer: 'About Developer',
  company: 'About Company',
  technical: 'Technical Information',
  credits: 'Credits & Legal',
};

async function openLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch (e) {
    console.error('[About] could not open link', url, e);
    showToast('Could not open this link on this device.');
  }
}

/**
 * Settings > About NexVora: a small hub with four screens (Developer, Company, Technical
 * Information, Credits & Legal). All text comes from `@/utils/brand` or from the real installed
 * app metadata - nothing here is a placeholder.
 */
export default function AboutNexVora({ goToPage, initialView = 'hub' }: AboutProps) {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<AboutView>(initialView);
  // The back-button hook registers its callback once, so read the current view through a ref.
  const viewRef = useRef<AboutView>(initialView);
  const [, forceRender] = useState(0);

  function show(next: AboutView) {
    viewRef.current = next;
    setView(next);
    forceRender(n => n + 1);
  }

  function goBack() {
    if (viewRef.current !== 'hub' && viewRef.current !== initialView) {
      show('hub');
      return true;
    }
    goToPage('main');
    return true;
  }
  useHighjackBackButtonPress(goBack);

  return (
    <SafeView
      scrollable={false}
      safeAreaClassNames="pt-[21px]"
      containerClassNames="flex flex-col flex-1"
      safeAreaStyle={{ backgroundColor: COLORS.bg }}>
      <View
        style={{ paddingTop: insets.top, paddingBottom: 20 }}
        className="w-full flex flex-row items-center justify-center relative">
        <TouchableOpacity
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="absolute left-0 flex flex-row items-center gap-2">
          <ArrowLeft size={24} color="#FFF" weight="bold" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-medium">{TITLES[view]}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: insets.bottom + 24, gap: 16 }}>
        {view === 'hub' && <Hub onOpen={show} />}
        {view === 'developer' && <DeveloperView />}
        {view === 'company' && <CompanyView />}
        {view === 'technical' && <TechnicalView />}
        {view === 'credits' && <CreditsView />}
      </ScrollView>
    </SafeView>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 12,
      }}>
      {children}
    </View>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ color: COLORS.cyan }} className="text-sm uppercase font-semibold">
      {children}
    </Text>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ color: COLORS.muted, lineHeight: 22 }} className="text-base">
      {children}
    </Text>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex flex-row justify-between" style={{ gap: 12 }}>
      <Text style={{ color: COLORS.muted }} className="text-base">
        {label}
      </Text>
      <Text selectable style={{ color: COLORS.text, flexShrink: 1, textAlign: 'right' }} className="text-base">
        {value}
      </Text>
    </View>
  );
}

function LinkRow({ icon, title, subtitle, url }: { icon: React.ReactNode; title: string; subtitle?: string; url: string }) {
  return (
    <TouchableOpacity
      onPress={() => openLink(url)}
      accessibilityRole="link"
      accessibilityLabel={title}
      style={{ minHeight: 48, gap: 12 }}
      className="flex flex-row items-center">
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={{ color: COLORS.text }} className="text-base">
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ color: COLORS.muted }} className="text-sm">
            {subtitle}
          </Text>
        ) : null}
      </View>
      <ArrowSquareOut size={18} color={COLORS.muted} />
    </TouchableOpacity>
  );
}

function Hub({ onOpen }: { onOpen: (v: AboutView) => void }) {
  const items: { view: AboutView; title: string; subtitle: string; icon: React.ReactNode }[] = [
    { view: 'developer', title: 'About Developer', subtitle: BRAND.developer, icon: <User size={22} color={COLORS.cyan} /> },
    { view: 'company', title: 'About Company', subtitle: BRAND.company, icon: <Buildings size={22} color={COLORS.cyan} /> },
    { view: 'technical', title: 'Technical Information', subtitle: `Version ${DeviceInfo.getVersion()}`, icon: <Cpu size={22} color={COLORS.cyan} /> },
    { view: 'credits', title: 'Credits & Legal', subtitle: 'Licenses and attribution', icon: <Scales size={22} color={COLORS.cyan} /> },
  ];
  return (
    <>
      <Card>
        <Text style={{ color: COLORS.text }} className="text-2xl font-semibold">
          {BRAND.appName}
        </Text>
        <Body>
          A mobile-first AI workspace for local language models, document chat and private conversations. Published by{' '}
          {BRAND.company}.
        </Body>
      </Card>
      <Card>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.view}
            onPress={() => onOpen(item.view)}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            style={{
              minHeight: 52,
              gap: 12,
              borderBottomWidth: index === items.length - 1 ? 0 : 1,
              borderBottomColor: COLORS.border,
              paddingBottom: index === items.length - 1 ? 0 : 12,
            }}
            className="flex flex-row items-center">
            {item.icon}
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text }} className="text-lg">
                {item.title}
              </Text>
              <Text style={{ color: COLORS.muted }} className="text-sm">
                {item.subtitle}
              </Text>
            </View>
            <CaretRight size={18} color={COLORS.muted} />
          </TouchableOpacity>
        ))}
      </Card>
    </>
  );
}

function DeveloperView() {
  return (
    <>
      <Card>
        <Heading>Developer</Heading>
        <Text style={{ color: COLORS.text }} className="text-2xl font-semibold">
          {BRAND.developer}
        </Text>
        <Body>Developer of {BRAND.appName}, published by {BRAND.company}.</Body>
      </Card>
      <Card>
        <Heading>Contact</Heading>
        {BRAND.contact.whatsappNumbers.map(number => (
          <LinkRow
            key={number}
            icon={<WhatsappLogo size={24} color="#25D366" weight="fill" />}
            title="WhatsApp"
            subtitle={number}
            url={whatsappUrl(number)}
          />
        ))}
        <LinkRow
          icon={<FacebookLogo size={24} color="#4C8DFF" weight="fill" />}
          title="Facebook"
          subtitle="Open profile"
          url={BRAND.contact.facebook}
        />
        <LinkRow
          icon={<InstagramLogo size={24} color="#F472B6" weight="fill" />}
          title="Instagram"
          subtitle="Open profile"
          url={BRAND.contact.instagram}
        />
      </Card>
    </>
  );
}

function CompanyView() {
  return (
    <Card>
      <Heading>Company</Heading>
      <Text style={{ color: COLORS.text }} className="text-2xl font-semibold">
        {BRAND.company}
      </Text>
      <Body>
        {BRAND.company} builds AI tools and software with a focus on accessible technology: practical apps that bring
        modern AI, including models that run privately on your own device, to everyday users.
      </Body>
      <Body>Product: {BRAND.appName}</Body>
    </Card>
  );
}

function TechnicalView() {
  return (
    <>
      <Card>
        <Heading>Application</Heading>
        <InfoRow label="Application" value={BRAND.appName} />
        <InfoRow label="Version" value={DeviceInfo.getVersion()} />
        <InfoRow label="Build" value={DeviceInfo.getBuildNumber()} />
        <InfoRow label="Package ID" value={DeviceInfo.getBundleId()} />
        <InfoRow label="Developer" value={BRAND.developer} />
        <InfoRow label="Publisher" value={BRAND.company} />
        <InfoRow label="Platform" value={`${Platform.OS === 'android' ? 'Android' : Platform.OS} ${String(Platform.Version)}`} />
      </Card>
      <Card>
        <Heading>AI engine</Heading>
        <InfoRow label="On-device runtime" value="llama.rn (llama.cpp)" />
        <InfoRow label="Model format" value="GGUF" />
        <InfoRow label="Inference" value="CPU only" />
      </Card>
      <Card>
        <Heading>Privacy</Heading>
        <Body>
          This app contains no analytics or crash-reporting service. Models you download run on your device, and chats
          and documents are stored on your device. If you connect a cloud or remote model provider, or switch on an
          optional tool such as web search, the data needed for that request is sent to that service.
        </Body>
      </Card>
    </>
  );
}

function CreditsView() {
  return (
    <>
      <Card>
        <Heading>Credits</Heading>
        <Body>Developed by {BRAND.developer}</Body>
        <Body>Published by {BRAND.company}</Body>
        <Text style={{ color: COLORS.text }} className="text-base">
          {BRAND.copyright}
        </Text>
        <Body>{BRAND.copyrightScope}</Body>
      </Card>
      <Card>
        <Heading>Open-source license</Heading>
        <Body>
          {BRAND.appName} is a modified version of {BRAND.upstream.name}, copyright {BRAND.upstream.owner}, and is
          distributed under the {BRAND.upstream.license}. You may use, study, change and redistribute it under the
          terms of that license. It comes with no warranty, to the extent permitted by law.
        </Body>
        <Body>
          Your rights: you may run, study, change and share this app under the GPL. If you receive this app (for
          example as an APK), the publisher must give you, or make available to you, the complete corresponding source
          code for that version under the same license, and you may pass it on under the same terms.
        </Body>
        <Body>
          To get the source code, use the link below if one is shown, or ask the developer through About Developer. The
          source code, build instructions (BUILDING.md) and license text (LICENSE) are part of the project.
        </Body>
        {BRAND.sourceCodeUrl ? (
          <LinkRow
            icon={<ArrowSquareOut size={22} color={COLORS.violet} />}
            title="Get the source code"
            subtitle={BRAND.sourceCodeUrl}
            url={BRAND.sourceCodeUrl}
          />
        ) : null}
        <LinkRow
          icon={<Scales size={22} color={COLORS.violet} />}
          title="Read the license"
          subtitle={BRAND.upstream.licenseUrl}
          url={BRAND.upstream.licenseUrl}
        />
      </Card>
      <Card>
        <Heading>Third-party acknowledgements</Heading>
        <Body>
          Original project: {BRAND.upstream.name} by {BRAND.upstream.owner}. This app is not the official AnythingLLM
          app and is not endorsed by Mintplex Labs.
        </Body>
        <Body>
          It also uses open-source libraries, including React Native, llama.rn / llama.cpp and others, each under its
          own license. Their notices are listed in the NOTICE file shipped with the source code.
        </Body>
        <LinkRow
          icon={<ArrowSquareOut size={22} color={COLORS.violet} />}
          title="Original project"
          subtitle={BRAND.upstream.repo}
          url={BRAND.upstream.repo}
        />
      </Card>
    </>
  );
}
