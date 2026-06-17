"use client";

import { Suspense, lazy, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span.
// 模块标题使用 LinkedTitle 包裹：当 moduleLinkMap 命中文章时变成站内链接，
// 未命中（RF 模块键暂无对应文章）则退化为纯文本，不产生站内 URL。
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// PvP warfare accordion - 独立模块 section，客户端展开/折叠交互
function PvpAccordion({
  items,
}: {
  items: Array<{
    icon: string;
    label: string;
    content: string;
    keyPoints?: string[];
  }>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="scroll-reveal space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-border rounded-xl bg-white/5 overflow-hidden transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center gap-3 p-4 md:p-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                <DynamicIcon
                  name={item.icon}
                  className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                />
              </span>
              <span className="flex-1 font-semibold text-sm md:text-base">
                {item.label}
              </span>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 md:px-5 pb-4 md:pb-5">
                <p className="mb-3 text-sm md:text-base text-muted-foreground">
                  {item.content}
                </p>
                {item.keyPoints && item.keyPoints.length > 0 && (
                  <ul className="space-y-1.5">
                    {item.keyPoints.map((kp, kpi) => (
                      <li
                        key={kpi}
                        className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                        {kp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://rfonlinenext.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "RF Online Next Wiki",
        description:
          "Complete RF Online Next Wiki covering codes, biosuits, Sacred Weapons, MAU, world boss raids, PvP, and PC download tips for the cross-platform sci-fi MMORPG.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "RF Online Next - Cross-Platform Sci-Fi MMORPG",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "RF Online Next Wiki",
        alternateName: "RF Online Next",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "RF Online Next Wiki - Cross-Platform Sci-Fi MMORPG",
        },
        description:
          "Complete RF Online Next Wiki resource hub for codes, biosuits, Sacred Weapons, world boss raids, PvP, and PC download guides",
        sameAs: [
          "https://rfonlinenextgb.netmarble.com/en/",
          "https://discord.gg/rfonlinenext",
          "https://www.youtube.com/@RF_ONLINE_NEXT_GB",
          "https://store.epicgames.com/p/rf-online-next-fa5a7b",
        ],
      },
      {
        "@type": "VideoGame",
        name: "RF Online Next",
        gamePlatform: ["PC", "Android", "iOS"],
        applicationCategory: "Game",
        genre: ["MMORPG", "RPG", "Sci-Fi"],
        playMode: "MultiPlayer",
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1000000,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.epicgames.com/p/rf-online-next-fa5a7b",
        },
      },
      {
        "@type": "VideoObject",
        name: "RF ONLINE NEXT - Global Launch Trailer",
        description:
          "Official RF ONLINE NEXT global launch trailer showcasing the cross-platform sci-fi MMORPG.",
        uploadDate: "2026-06-16",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/cZTVgjXp2gw",
        url: "https://www.youtube.com/watch?v=cZTVgjXp2gw",
      },
    ],
  };

  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* ===== 前半屏顺序：Hero → 视频区 → Tools Grid ===== */}

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes-rewards")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.epicgames.com/p/rf-online-next-fa5a7b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，桌面端容器上限 max-w-5xl，避免挤压广告展示空间 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="cZTVgjXp2gw"
              title="RF ONLINE NEXT - Global Launch Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（位于视频区之后、Latest Updates 之前） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 md:mb-12 text-center scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID（与下方模块锚点一一对应）
              const sectionIds = [
                "download-platforms",
                "codes-rewards",
                "beginner-guide",
                "biosuit-tier-list",
                "build-progression",
                "sacred-weapons",
                "pvp-warfare",
                "pve-roadmap",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* ===== 模块区：4 个独立 section，分别采用 card-list / code-cards / step-by-step / tier-grid 布局 ===== */}

      {/* Module 1: Download, Release Date and Platforms (card-list) */}
      <section id="download-platforms" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 md:mb-12 text-center scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["rfOnlineNextDownloadPlatforms"]}
                locale={locale}
              >
                {t.modules.rfOnlineNextDownloadPlatforms.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.rfOnlineNextDownloadPlatforms.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 scroll-reveal">
            {t.modules.rfOnlineNextDownloadPlatforms.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                      <DynamicIcon
                        name={card.icon}
                        className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                      />
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold text-lg">{card.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  {card.details?.length > 0 && (
                    <ul className="mb-4 space-y-1.5">
                      {card.details.map((det: string, di: number) => (
                        <li
                          key={di}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                          {det}
                        </li>
                      ))}
                    </ul>
                  )}
                  {card.href && (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--nav-theme-light))] hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open official page
                    </a>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Codes and Coupon Rewards (code-cards) */}
      <section
        id="codes-rewards"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["rfOnlineNextCodesRewards"]}
                locale={locale}
              >
                {t.modules.rfOnlineNextCodesRewards.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              {t.modules.rfOnlineNextCodesRewards.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 scroll-reveal">
            {t.modules.rfOnlineNextCodesRewards.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                      <DynamicIcon
                        name={card.icon}
                        className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                      />
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="mb-2 font-bold text-lg">{card.name}</h3>
                  <p className="mb-2 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
                    {card.reward}
                  </p>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  {card.note && (
                    <p className="mb-3 text-xs text-muted-foreground italic">
                      {card.note}
                    </p>
                  )}
                  {card.href && (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--nav-theme-light))] hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Claim source
                    </a>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide (step-by-step) */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 md:mb-12 text-center scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["rfOnlineNextBeginnerGuide"]}
                locale={locale}
              >
                {t.modules.rfOnlineNextBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.rfOnlineNextBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.rfOnlineNextBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="mb-1.5 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
                      {step.subtitle}
                    </p>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.rfOnlineNextBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Class Tier List and Biosuits (tier-grid) */}
      <section
        id="biosuit-tier-list"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["rfOnlineNextBiosuitTierList"]}
                locale={locale}
              >
                {t.modules.rfOnlineNextBiosuitTierList.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              {t.modules.rfOnlineNextBiosuitTierList.intro}
            </p>
          </div>

          {["S", "A", "B"].map((tier) => {
            const biosuits =
              t.modules.rfOnlineNextBiosuitTierList.biosuits.filter(
                (b: any) => b.tier === tier,
              );
            const tierBadge =
              tier === "S"
                ? "bg-[hsl(var(--nav-theme))] text-black"
                : tier === "A"
                  ? "bg-[hsl(var(--nav-theme)/0.7)] text-black"
                  : "bg-white/10 text-foreground border border-border";

            return (
              <div key={tier} className="mb-10 scroll-reveal last:mb-0">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-black ${tierBadge}`}
                  >
                    {tier}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg">Tier {tier}</h3>
                    <p className="text-xs text-muted-foreground">
                      {t.modules.rfOnlineNextBiosuitTierList.tierLabels[tier]}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {biosuits.map((b: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                          <DynamicIcon
                            name={b.icon}
                            className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                          />
                        </span>
                        <div>
                          <h4 className="font-bold text-base">{b.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {b.role}
                          </p>
                        </div>
                      </div>
                      <dl className="mb-3 space-y-1 text-xs">
                        <div className="flex gap-2">
                          <dt className="text-muted-foreground">Range</dt>
                          <dd>{b.range}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-muted-foreground">Beginner fit</dt>
                          <dd>{b.fit}</dd>
                        </div>
                      </dl>
                      <p className="mb-1.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/80">
                          PvE:
                        </span>{" "}
                        {b.pve}
                      </p>
                      <p className="mb-3 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/80">
                          PvP:
                        </span>{" "}
                        {b.pvp}
                      </p>
                      <p className="mt-auto text-sm text-muted-foreground">
                        {b.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 广告位: 模块4之后的阅读停顿位（移动端方形 + 桌面端横幅） */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 5: Best Builds, Skills and Gear Progression (step-by-step with priority badges) */}
      <section id="build-progression" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 md:mb-12 text-center scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["rfOnlineNextBuildProgression"]}
                locale={locale}
              >
                {t.modules.rfOnlineNextBuildProgression.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.rfOnlineNextBuildProgression.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.rfOnlineNextBuildProgression.steps.map(
              (step: any, index: number) => {
                const priority = step.priority;
                const priorityBadge =
                  priority === "Core"
                    ? "bg-[hsl(var(--nav-theme))] text-black"
                    : priority === "High"
                      ? "bg-[hsl(var(--nav-theme)/0.7)] text-black"
                      : "bg-white/10 text-foreground border border-border";
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-3 md:flex-row md:gap-5 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 md:w-28 md:flex-shrink-0 md:flex-col md:items-start md:gap-2">
                      <span className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {index + 1}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${priorityBadge}`}
                        title={
                          t.modules.rfOnlineNextBuildProgression.priorityLabels?.[
                            priority
                          ]
                        }
                      >
                        {priority}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                        {step.title}
                      </h3>
                      <p className="mb-3 text-sm md:text-base text-muted-foreground">
                        {step.summary}
                      </p>
                      {step.details?.length > 0 && (
                        <ul className="space-y-1.5">
                          {step.details.map((det: string, di: number) => (
                            <li
                              key={di}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                              {det}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* 广告位: 模块5之后 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 6: Sacred Weapons Guide (card-list) */}
      <section
        id="sacred-weapons"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["rfOnlineNextSacredWeapons"]}
                locale={locale}
              >
                {t.modules.rfOnlineNextSacredWeapons.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              {t.modules.rfOnlineNextSacredWeapons.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 scroll-reveal">
            {t.modules.rfOnlineNextSacredWeapons.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.1)]">
                      <DynamicIcon
                        name={card.icon}
                        className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                      />
                    </span>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">
                        {card.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{card.role}</p>
                    </div>
                  </div>
                  <span className="mb-3 self-start text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {card.type}
                  </span>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  {card.bestUsed?.length > 0 && (
                    <ul className="mb-3 space-y-1.5">
                      {card.bestUsed.map((use: string, ui: number) => (
                        <li
                          key={ui}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                          {use}
                        </li>
                      ))}
                    </ul>
                  )}
                  {card.playNote && (
                    <p className="mt-auto text-xs italic text-[hsl(var(--nav-theme-light))]">
                      {card.playNote}
                    </p>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位: 模块6之后 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 7: PvP, Battlegrounds and Mining War (accordion) */}
      <section id="pvp-warfare" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 md:mb-12 text-center scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["rfOnlineNextPvpWarfare"]}
                locale={locale}
              >
                {t.modules.rfOnlineNextPvpWarfare.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.rfOnlineNextPvpWarfare.intro}
            </p>
          </div>

          <PvpAccordion items={t.modules.rfOnlineNextPvpWarfare.items} />
        </div>
      </section>

      {/* 广告位: 模块7之后 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 8: World Bosses, Dungeons and Main Quests (table) */}
      <section
        id="pve-roadmap"
        className="scroll-mt-24 px-4 py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["rfOnlineNextPveRoadmap"]}
                locale={locale}
              >
                {t.modules.rfOnlineNextPveRoadmap.title}
              </LinkedTitle>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              {t.modules.rfOnlineNextPveRoadmap.intro}
            </p>
          </div>

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                  {t.modules.rfOnlineNextPveRoadmap.tableHeaders.map(
                    (header: string, hi: number) => (
                      <th
                        key={hi}
                        className="px-4 py-3 font-semibold whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {t.modules.rfOnlineNextPveRoadmap.rows.map(
                  (row: any, index: number) => (
                    <tr
                      key={index}
                      className="border-t border-border align-top hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3 font-medium">{row.milestone}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.goal}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.reward}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/rfonlinenext"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@RF_ONLINE_NEXT_GB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://forum.netmarble.com/rfonlinenext_gl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.epicgames.com/p/rf-online-next-fa5a7b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
