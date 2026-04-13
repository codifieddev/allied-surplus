"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Plus,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Layers,
} from "lucide-react";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { CountrySearchModal } from "@/components/admin/branding/CountrySearchModal";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchBrandingThunk,
  saveBrandingThunk,
} from "@/lib/store/branding/brandingThunks";
import { updateBrandingState } from "@/lib/store/branding/brandingSlice";

// Type Definitions
interface Logo {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface CompanyInfo {
  name: string;
  tagline: string;
  foundedYear: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  isPrimary: boolean;
}

interface ContactInfo {
  primaryEmail: string;
  supportEmail: string;
  phoneDisplay: boolean;
}

interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
  enabled: boolean;
}

interface LegalInfo {
  companyLegalName: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  copyrightText: string;
}

interface Language {
  code: string;
  name: string;
  enabled: boolean;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
  enabled: boolean;
}

interface LanguageConfig {
  available: Language[];
  default: string;
}

interface CurrencyConfig {
  available: Currency[];
  default: string;
}

// Theme colors removed

interface BrandConfiguration {
  logos: Logo[];
  companyInfo: CompanyInfo;
  locations: Location[];
  contact: ContactInfo;
  socialMedia: SocialMedia[];
  legal: LegalInfo;
  languages: LanguageConfig;
  currencies: CurrencyConfig;
}

type SectionId =
  | "logo"
  | "company"
  | "locations"
  | "contact"
  | "social"
  | "legal"
  | "regional";

interface Section {
  id: SectionId;
  label: string;
}

export default function BrandingManager() {
  const dispatch = useAppDispatch();
  const { config: brandConfig, isLoading: loading } = useAppSelector(
    (state) => state.branding,
  );

  useEffect(() => {
    if (!brandConfig) {
      dispatch(fetchBrandingThunk());
    }
  }, [dispatch, brandConfig]);

  const saveConfiguration = async () => {
    if (brandConfig) {
      dispatch(saveBrandingThunk(brandConfig));
    }
  };

  const [activeSection, setActiveSection] = useState<SectionId>("logo");

  const addLogo = (): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        logos: [
          ...brandConfig.logos,
          {
            id: Date.now().toString(),
            url: "",
            alt: "New Logo",
            width: 120,
            height: 40,
          },
        ],
      }),
    );
  };

  const removeLogo = (id: string): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        logos: brandConfig.logos.filter((l) => l.id !== id),
      }),
    );
  };

  const updateLogo = (id: string, field: keyof Logo, value: any): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        logos: brandConfig.logos.map((l) =>
          l.id === id ? { ...l, [field]: value } : l,
        ),
      }),
    );
  };

  const updateCompanyInfo = <K extends keyof CompanyInfo>(
    field: K,
    value: CompanyInfo[K],
  ): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        companyInfo: { ...brandConfig.companyInfo, [field]: value },
      }),
    );
  };

  const updateLocation = <K extends keyof Location>(
    id: number,
    field: K,
    value: Location[K],
  ): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        locations: brandConfig.locations.map((loc) =>
          loc.id === id ? { ...loc, [field]: value } : loc,
        ),
      }),
    );
  };

  const addLocation = (): void => {
    if (!brandConfig) return;
    const newId = Math.max(...brandConfig.locations.map((l) => l.id), 0) + 1;
    dispatch(
      updateBrandingState({
        locations: [
          ...brandConfig.locations,
          {
            id: newId,
            name: "",
            address: "",
            phone: "",
            isPrimary: false,
          },
        ],
      }),
    );
  };

  const removeLocation = (id: number): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        locations: brandConfig.locations.filter((loc) => loc.id !== id),
      }),
    );
  };

  const updateSocial = <K extends keyof SocialMedia>(
    index: number,
    field: K,
    value: SocialMedia[K],
  ): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        socialMedia: brandConfig.socialMedia.map((social, i) =>
          i === index ? { ...social, [field]: value } : social,
        ),
      }),
    );
  };

  const addSocialMedia = (): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        socialMedia: [
          ...brandConfig.socialMedia,
          {
            platform: "",
            url: "",
            icon: "link",
            enabled: true,
          },
        ],
      }),
    );
  };

  const removeSocial = (index: number): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        socialMedia: brandConfig.socialMedia.filter((_, i) => i !== index),
      }),
    );
  };

  const updateContact = <K extends keyof ContactInfo>(
    field: K,
    value: ContactInfo[K],
  ): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        contact: { ...brandConfig.contact, [field]: value },
      }),
    );
  };

  const updateLegal = <K extends keyof LegalInfo>(
    field: K,
    value: LegalInfo[K],
  ): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        legal: { ...brandConfig.legal, [field]: value },
      }),
    );
  };

  const toggleLanguage = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.languages.available.map((lang) =>
      lang.code === code ? { ...lang, enabled: !lang.enabled } : lang,
    );

    let newDefault = brandConfig.languages.default;
    if (code === brandConfig.languages.default) {
      const firstEnabled = available.find((l) => l.enabled);
      if (firstEnabled) newDefault = firstEnabled.code;
    }

    dispatch(
      updateBrandingState({
        languages: {
          ...brandConfig.languages,
          available,
          default: newDefault,
        },
      }),
    );
  };

  const setDefaultLanguage = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.languages.available.map((lang) =>
      lang.code === code ? { ...lang, enabled: true } : lang,
    );
    dispatch(
      updateBrandingState({
        languages: {
          ...brandConfig.languages,
          available,
          default: code,
        },
      }),
    );
  };

  const toggleCurrency = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.currencies.available.map((curr) =>
      curr.code === code ? { ...curr, enabled: !curr.enabled } : curr,
    );

    let newDefault = brandConfig.currencies.default;
    if (code === brandConfig.currencies.default) {
      const firstEnabled = available.find((c) => c.enabled);
      if (firstEnabled) newDefault = firstEnabled.code;
    }

    dispatch(
      updateBrandingState({
        currencies: {
          ...brandConfig.currencies,
          available,
          default: newDefault,
        },
      }),
    );
  };

  const setDefaultCurrency = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.currencies.available.map((curr) =>
      curr.code === code ? { ...curr, enabled: true } : curr,
    );
    dispatch(
      updateBrandingState({
        currencies: {
          ...brandConfig.currencies,
          available,
          default: code,
        },
      }),
    );
  };

  const removeLanguage = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.languages.available.filter(
      (l) => l.code !== code,
    );
    let newDefault = brandConfig.languages.default;
    if (code === brandConfig.languages.default) {
      newDefault = available.length > 0 ? available[0].code : "";
    }
    dispatch(
      updateBrandingState({
        languages: { ...brandConfig.languages, available, default: newDefault },
      }),
    );
  };

  const removeCurrency = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.currencies.available.filter(
      (c) => c.code !== code,
    );
    let newDefault = brandConfig.currencies.default;
    if (code === brandConfig.currencies.default) {
      newDefault = available.length > 0 ? available[0].code : "";
    }
    dispatch(
      updateBrandingState({
        currencies: {
          ...brandConfig.currencies,
          available,
          default: newDefault,
        },
      }),
    );
  };

  const sections: Section[] = [
    { id: "logo", label: "LOGO & IDENTITY" },
    { id: "company", label: "COMPANY INFO" },
    { id: "locations", label: "LOCATIONS" },
    { id: "contact", label: "CONTACT" },
    { id: "social", label: "SOCIAL MEDIA" },
    { id: "regional", label: "REGIONAL & FINANCIAL" },
    { id: "legal", label: "LEGAL & PAYMENT" },
  ];

  const handleCountrySelect = (data: {
    languages: any[];
    currencies: any[];
    countryName: string;
  }) => {
    if (!brandConfig) return;

    const newLanguages = [...brandConfig.languages.available];
    data.languages.forEach((lang) => {
      if (!newLanguages.find((l) => l.code === lang.code)) {
        newLanguages.push(lang);
      }
    });

    const newCurrencies = [...brandConfig.currencies.available];
    data.currencies.forEach((curr) => {
      if (!newCurrencies.find((c) => c.code === curr.code)) {
        newCurrencies.push(curr);
      }
    });

    dispatch(
      updateBrandingState({
        languages: {
          ...brandConfig.languages,
          available: newLanguages,
          default:
            brandConfig.languages.default ||
            (newLanguages.length > 0 ? newLanguages[0].code : ""),
        },
        currencies: {
          ...brandConfig.currencies,
          available: newCurrencies,
          default:
            brandConfig.currencies.default ||
            (newCurrencies.length > 0 ? newCurrencies[0].code : ""),
        },
      }),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink text-white p-6 flex items-center justify-center">
        <p className="text-gold font-bold tracking-widest text-sm uppercase">
          Loading Configuration...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-neutral-800 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                BRANDING COMMAND CENTER
              </h1>
              <p className="text-slate-400 text-sm uppercase tracking-wider">
                Configure Brand Identity • Manage Visual Assets • Deploy
                Settings
              </p>
            </div>
            <button
              onClick={saveConfiguration}
              className="px-6 py-3 bg-olive hover:bg-[#7a8944] text-white font-bold text-sm tracking-wider transition-all"
            >
              DEPLOY CHANGES
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-3">
            <div className="bg-charcoal border border-neutral-800 sticky top-6">
              <div className="p-4 border-b border-neutral-800">
                <h3 className="text-xs font-bold text-slate-400 tracking-wider">
                  CONFIGURATION SECTORS
                </h3>
              </div>
              <nav className="p-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium tracking-wide transition-all mb-1 ${
                      activeSection === section.id
                        ? "bg-olive text-white"
                        : "text-slate-400 hover:text-white hover:bg-neutral-800"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-charcoal border border-neutral-800 p-6">
              {/* LOGO SECTION */}
              {activeSection === "logo" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-wide text-gold">
                      LOGO & IDENTITY
                    </h2>
                    <Button
                      onClick={addLogo}
                      className="bg-olive hover:bg-[#7a8944] text-white font-bold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> ADD LOGO
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {brandConfig &&
                      brandConfig.logos.map((logo, index) => (
                        <div
                          key={logo.id}
                          className="bg-ink border border-neutral-800 p-6 flex items-start gap-6 relative"
                        >
                          {brandConfig.logos.length > 1 && (
                            <button
                              onClick={() => removeLogo(logo.id)}
                              className="absolute top-4 right-4 text-red-500 hover:text-red-400"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                          <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-400 mb-3 tracking-wider">
                              LOGO ASSET {index + 1}
                            </label>
                            <div className="border border-neutral-800 rounded p-4 flex flex-col items-center justify-center min-h-[160px] bg-charcoal">
                              {logo.url ? (
                                <div className="w-full h-full flex flex-col items-center gap-4">
                                  <img
                                    src={logo.url}
                                    alt={logo.alt}
                                    className="max-h-24 max-w-full"
                                    style={{
                                      width: logo.width || "auto",
                                      height: logo.height || "auto",
                                    }}
                                  />
                                  <MediaLibraryModal
                                    onSelect={(media) => {
                                      updateLogo(logo.id, "url", media.url);
                                      updateLogo(logo.id, "alt", media.alt);
                                    }}
                                    trigger={
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-ink text-slate-400 border-neutral-700 hover:bg-neutral-800 hover:text-white"
                                      >
                                        Change Image
                                      </Button>
                                    }
                                  />
                                </div>
                              ) : (
                                <MediaLibraryModal
                                  onSelect={(media) => {
                                    updateLogo(logo.id, "url", media.url);
                                    updateLogo(logo.id, "alt", media.alt);
                                  }}
                                  trigger={
                                    <div className="text-center cursor-pointer hover:text-gold transition-colors">
                                      <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                                      <p className="text-slate-400 text-xs">
                                        SELECT FROM LIBRARY
                                      </p>
                                    </div>
                                  }
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 space-y-4 pt-8">
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">
                                ALT TEXT
                              </label>
                              <input
                                type="text"
                                value={logo.alt}
                                onChange={(e) =>
                                  updateLogo(logo.id, "alt", e.target.value)
                                }
                                className="w-full bg-charcoal border border-neutral-700 px-3 py-2 text-white focus:border-gold focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">
                                DISPLAY WIDTH (PX)
                              </label>
                              <input
                                type="number"
                                value={logo.width}
                                onChange={(e) =>
                                  updateLogo(
                                    logo.id,
                                    "width",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                className="w-full bg-charcoal border border-neutral-700 px-3 py-2 text-white focus:border-gold focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">
                                DISPLAY HEIGHT (PX)
                              </label>
                              <input
                                type="number"
                                value={logo.height}
                                onChange={(e) =>
                                  updateLogo(
                                    logo.id,
                                    "height",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                className="w-full bg-charcoal border border-neutral-700 px-3 py-2 text-white focus:border-gold focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* COMPANY INFO SECTION */}
              {activeSection === "company" && (
                <div>
                  <h2 className="text-xl font-bold mb-6 text-gold tracking-wide">
                    COMPANY INFORMATION
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wider">
                        COMPANY NAME
                      </label>
                      <input
                        type="text"
                        value={brandConfig ? brandConfig.companyInfo.name : ""}
                        onChange={(e) =>
                          updateCompanyInfo("name", e.target.value)
                        }
                        className="w-full bg-ink border border-neutral-700 px-4 py-3 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wider">
                        TAGLINE / DESCRIPTION
                      </label>
                      <textarea
                        value={
                          brandConfig ? brandConfig.companyInfo.tagline : ""
                        }
                        onChange={(e) =>
                          updateCompanyInfo("tagline", e.target.value)
                        }
                        rows={4}
                        className="w-full bg-ink border border-neutral-700 px-4 py-3 text-white focus:border-gold focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wider">
                        FOUNDED YEAR
                      </label>
                      <input
                        type="text"
                        value={
                          brandConfig ? brandConfig.companyInfo.foundedYear : ""
                        }
                        onChange={(e) =>
                          updateCompanyInfo("foundedYear", e.target.value)
                        }
                        className="w-full bg-ink border border-neutral-700 px-4 py-3 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* LOCATIONS SECTION */}
              {activeSection === "locations" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gold tracking-wide">
                      TACTICAL LOCATIONS
                    </h2>
                    <button
                      onClick={addLocation}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-sm font-bold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      ADD LOCATION
                    </button>
                  </div>
                  <div className="space-y-4">
                    {brandConfig &&
                      brandConfig.locations.map((location) => (
                        <div
                          key={location.id}
                          className="bg-ink border border-neutral-800 p-5"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={location.isPrimary}
                                onChange={(e) =>
                                  updateLocation(
                                    location.id,
                                    "isPrimary",
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4"
                              />
                              <span className="text-xs text-slate-500 font-bold">
                                PRIMARY LOCATION
                              </span>
                            </div>
                            {brandConfig.locations.length > 1 && (
                              <button
                                onClick={() => removeLocation(location.id)}
                                className="text-red-500 hover:text-red-400"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">
                                LOCATION NAME
                              </label>
                              <input
                                type="text"
                                value={location.name}
                                onChange={(e) =>
                                  updateLocation(
                                    location.id,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-charcoal border border-neutral-700 px-3 py-2 text-white focus:border-gold focus:outline-none"
                                placeholder="e.g., Tactical HQ (Phoenix)"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">
                                PHONE
                              </label>
                              <input
                                type="text"
                                value={location.phone}
                                onChange={(e) =>
                                  updateLocation(
                                    location.id,
                                    "phone",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-charcoal border border-neutral-700 px-3 py-2 text-white focus:border-gold focus:outline-none"
                                placeholder="(XXX) XXX-XXXX"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-slate-500 mb-1">
                                ADDRESS
                              </label>
                              <input
                                type="text"
                                value={location.address}
                                onChange={(e) =>
                                  updateLocation(
                                    location.id,
                                    "address",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-charcoal border border-neutral-700 px-3 py-2 text-white focus:border-gold focus:outline-none"
                                placeholder="Street address"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* CONTACT SECTION */}
              {activeSection === "contact" && (
                <div>
                  <h2 className="text-xl font-bold mb-6 text-gold tracking-wide">
                    CONTACT INFORMATION
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wider">
                        PRIMARY EMAIL
                      </label>
                      <input
                        type="email"
                        value={
                          brandConfig ? brandConfig.contact.primaryEmail : ""
                        }
                        onChange={(e) =>
                          updateContact("primaryEmail", e.target.value)
                        }
                        className="w-full bg-ink border border-neutral-700 px-4 py-3 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wider">
                        SUPPORT EMAIL
                      </label>
                      <input
                        type="email"
                        value={
                          brandConfig ? brandConfig.contact.supportEmail : ""
                        }
                        onChange={(e) =>
                          updateContact("supportEmail", e.target.value)
                        }
                        className="w-full bg-ink border border-neutral-700 px-4 py-3 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-ink border border-neutral-800">
                      <input
                        type="checkbox"
                        checked={
                          brandConfig ? brandConfig.contact.phoneDisplay : false
                        }
                        onChange={(e) =>
                          updateContact("phoneDisplay", e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-300">
                        Display phone numbers on website
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SOCIAL MEDIA SECTION */}
              {activeSection === "social" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gold tracking-wide">
                      SOCIAL MEDIA CHANNELS
                    </h2>
                    <button
                      onClick={addSocialMedia}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-sm font-bold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      ADD PLATFORM
                    </button>
                  </div>
                  <div className="space-y-3">
                    {brandConfig &&
                      brandConfig.socialMedia.map((social, index) => (
                        <div
                          key={index}
                          className="bg-ink border border-neutral-800 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={social.enabled}
                              onChange={(e) =>
                                updateSocial(index, "enabled", e.target.checked)
                              }
                              className="w-4 h-4"
                            />
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={social.platform}
                                onChange={(e) =>
                                  updateSocial(
                                    index,
                                    "platform",
                                    e.target.value,
                                  )
                                }
                                placeholder="Platform name"
                                className="bg-charcoal border border-neutral-700 px-3 py-2 text-white focus:border-gold focus:outline-none text-sm"
                              />
                              <input
                                type="url"
                                value={social.url}
                                onChange={(e) =>
                                  updateSocial(index, "url", e.target.value)
                                }
                                placeholder="https://..."
                                className="bg-charcoal border border-neutral-700 px-3 py-2 text-white focus:border-gold focus:outline-none text-sm"
                              />
                            </div>
                            <button
                              onClick={() => removeSocial(index)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* REGIONAL & FINANCIAL SECTION */}
              {activeSection === "regional" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gold tracking-wide">
                        REGIONAL & FINANCIAL
                      </h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Configure localized intelligence and operational
                        currency units.
                      </p>
                    </div>
                    <CountrySearchModal onSelect={handleCountrySelect} />
                  </div>

                  <div className="space-y-8">
                    {/* Languages Sub-section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 border-b border-neutral-800 pb-2">
                        <Globe className="w-4 h-4 text-gold" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                          Active Languages
                        </h3>
                      </div>

                      {brandConfig &&
                      brandConfig.languages.available.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {brandConfig.languages.available.map((lang) => (
                            <div
                              key={lang.code}
                              className={`p-4 bg-ink border transition-all ${
                                lang.enabled
                                  ? "border-gold/50"
                                  : "border-neutral-800 opacity-60"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <input
                                    type="checkbox"
                                    checked={lang.enabled}
                                    onChange={() => toggleLanguage(lang.code)}
                                    className="w-4 h-4 cursor-pointer"
                                  />
                                  <div>
                                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                                      {lang.name}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-mono">
                                      CODE: {lang.code.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                                {lang.code === brandConfig.languages.default ? (
                                  <span className="px-2 py-1 bg-gold text-ink text-[9px] font-black uppercase tracking-tighter">
                                    Default
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <button
                                      disabled={!lang.enabled}
                                      onClick={() =>
                                        setDefaultLanguage(lang.code)
                                      }
                                      className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border transition-all ${
                                        lang.enabled
                                          ? "text-gold border-gold/50 hover:bg-gold hover:text-ink"
                                          : "text-slate-600 border-neutral-800 cursor-not-allowed"
                                      }`}
                                    >
                                      Make Default
                                    </button>
                                    <button
                                      onClick={() => removeLanguage(lang.code)}
                                      className="p-1 text-slate-600 hover:text-red-500 transition-colors"
                                      title="Remove language"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 border-2 border-dashed border-neutral-800 text-center">
                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">
                            No regional intelligence deployed. Use discovery to
                            add.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Currencies Sub-section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 border-b border-neutral-800 pb-2">
                        <Layers className="w-4 h-4 text-gold" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                          Active Currencies
                        </h3>
                      </div>

                      {brandConfig &&
                      brandConfig.currencies.available.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {brandConfig.currencies.available.map((curr) => (
                            <div
                              key={curr.code}
                              className={`p-4 bg-ink border transition-all ${
                                curr.enabled
                                  ? "border-gold/50"
                                  : "border-neutral-800 opacity-60"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <input
                                    type="checkbox"
                                    checked={curr.enabled}
                                    onChange={() => toggleCurrency(curr.code)}
                                    className="w-4 h-4 cursor-pointer"
                                  />
                                  <div>
                                    <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                                      <span className="text-gold font-mono">
                                        {curr.symbol}
                                      </span>{" "}
                                      {curr.name}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-mono">
                                      CURRENCY: {curr.code.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                                {curr.code ===
                                brandConfig.currencies.default ? (
                                  <span className="px-2 py-1 bg-gold text-ink text-[9px] font-black uppercase tracking-tighter">
                                    Default
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <button
                                      disabled={!curr.enabled}
                                      onClick={() =>
                                        setDefaultCurrency(curr.code)
                                      }
                                      className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 border transition-all ${
                                        curr.enabled
                                          ? "text-gold border-gold/50 hover:bg-gold hover:text-ink"
                                          : "text-slate-600 border-neutral-800 cursor-not-allowed"
                                      }`}
                                    >
                                      Make Default
                                    </button>
                                    <button
                                      onClick={() => removeCurrency(curr.code)}
                                      className="p-1 text-slate-600 hover:text-red-500 transition-colors"
                                      title="Remove currency"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 border-2 border-dashed border-neutral-800 text-center">
                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">
                            No functional currency units identified.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* LEGAL & PAYMENT SECTION */}
              {activeSection === "legal" && (
                <div>
                  <h2 className="text-xl font-bold mb-6 text-gold tracking-wide">
                    LEGAL & PAYMENT
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wider">
                        LEGAL COMPANY NAME
                      </label>
                      <input
                        type="text"
                        value={
                          brandConfig ? brandConfig.legal.companyLegalName : ""
                        }
                        onChange={(e) =>
                          updateLegal("companyLegalName", e.target.value)
                        }
                        className="w-full bg-ink border border-neutral-700 px-4 py-3 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wider">
                          PRIVACY POLICY URL
                        </label>
                        <input
                          type="text"
                          value={
                            brandConfig
                              ? brandConfig.legal.privacyPolicyUrl
                              : ""
                          }
                          onChange={(e) =>
                            updateLegal("privacyPolicyUrl", e.target.value)
                          }
                          className="w-full bg-ink border border-neutral-700 px-4 py-3 text-white focus:border-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wider">
                          TERMS URL
                        </label>
                        <input
                          type="text"
                          value={brandConfig ? brandConfig.legal.termsUrl : ""}
                          onChange={(e) =>
                            updateLegal("termsUrl", e.target.value)
                          }
                          className="w-full bg-ink border border-neutral-700 px-4 py-3 text-white focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2 tracking-wider">
                        COPYRIGHT TEXT
                      </label>
                      <input
                        type="text"
                        value={
                          brandConfig ? brandConfig.legal.copyrightText : ""
                        }
                        onChange={(e) =>
                          updateLegal("copyrightText", e.target.value)
                        }
                        className="w-full bg-ink border border-neutral-700 px-4 py-3 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
