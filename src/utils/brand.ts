/**
 * NexVora LLM Studio - single source of truth for product, developer and company details shown in
 * the About / Credits screens. Edit values here, not in the UI.
 */
export const BRAND = {
  appName: 'NexVora LLM Studio',
  version: '1.0.0', // fallback only - the About screen shows the real installed version
  developer: 'Prince AR Abdur Rahman',
  company: "NexVora Lab's Ofc",
  copyright: "\u00A9 2026 NexVora Lab's Ofc. All Rights Reserved.",
  copyrightScope:
    "This notice covers NexVora's original branding and original contributions only. It does not apply to third-party code owned by other copyright holders.",
  contact: {
    whatsappNumbers: ['01707424006', '01796951709'],
    facebook: 'https://www.facebook.com/share/1BNn32qoJo/',
    instagram: 'https://www.instagram.com/ur___abdur____rahman__2008',
  },
  /**
   * Public URL where the complete corresponding source code of this app version is published (for
   * example the GitHub repository next to the APK release). Fill this in before distributing the APK;
   * the Credits screen shows it as a link when set.
   */
  sourceCodeUrl: '' as string,
  upstream: {
    name: 'AnythingLLM Mobile',
    owner: 'Mintplex Labs, Inc. and contributors',
    repo: 'https://github.com/Mintplex-Labs/anythingllm-mobile',
    license: 'GNU General Public License v3.0 or later (GPL-3.0-or-later)',
    licenseUrl: 'https://www.gnu.org/licenses/gpl-3.0.html',
  },
} as const;

/**
 * WhatsApp deep link for a Bangladesh mobile number written locally (e.g. 01707424006).
 * The leading 0 is replaced with the +880 country code, which wa.me requires.
 */
export function whatsappUrl(localNumber: string): string {
  const digits = localNumber.replace(/\D/g, '');
  const international = digits.startsWith('0') ? `880${digits.slice(1)}` : digits;
  return `https://wa.me/${international}`;
}
