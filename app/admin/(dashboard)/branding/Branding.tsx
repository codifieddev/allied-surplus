"use client";

import React, { useState, useEffect } from "react";
import { Upload, Plus, X, ExternalLink, Eye, EyeOff } from "lucide-react";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { Button } from "@/components/ui/button";

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

// Theme colors removed

interface BrandConfiguration {
  logos: Logo[];
  companyInfo: CompanyInfo;
  locations: Location[];
  contact: ContactInfo;
  socialMedia: SocialMedia[];
  legal: LegalInfo;
}

type SectionId =
  | "logo"
  | "company"
  | "locations"
  | "contact"
  | "social"
  | "legal";

interface Section {
  id: SectionId;
  label: string;
}

export default function BrandingManager() {
  const [loading, setLoading] = useState(true);
  const [brandConfig, setBrandConfig] = useState<BrandConfiguration | null>(
    null,
  );

  console.log(brandConfig);

  useEffect(() => {
    fetch("/api/admin/branding")
      .then((res) => res.json())
      .then((data) => {
        if (data.branding) {
          setBrandConfig(data.branding);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load branding", err);
        setLoading(false);
      });
  }, []);

  const saveConfiguration = async () => {
    try {
      const res = await fetch("/api/admin/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandConfig),
      });
      if (res.ok) alert("Branding configuration saved successfully!");
      else alert("Failed to save branding configuration.");
    } catch (err) {
      console.error(err);
      alert("Error saving configuration.");
    }
  };

  const [activeSection, setActiveSection] = useState<SectionId>("logo");

  const addLogo = (): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        logos: [
          ...prev.logos,
          {
            id: Date.now().toString(),
            url: "",
            alt: "New Logo",
            width: 120,
            height: 40,
          },
        ],
      };
    });
  };

  const removeLogo = (id: string): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        logos: prev.logos.filter((l) => l.id !== id),
      };
    });
  };

  const updateLogo = (id: string, field: keyof Logo, value: any): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        logos: prev.logos.map((l) =>
          l.id === id ? { ...l, [field]: value } : l,
        ),
      };
    });
  };

  const updateCompanyInfo = <K extends keyof CompanyInfo>(
    field: K,
    value: CompanyInfo[K],
  ): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        companyInfo: { ...prev.companyInfo, [field]: value },
      };
    });
  };

  const updateLocation = <K extends keyof Location>(
    id: number,
    field: K,
    value: Location[K],
  ): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        locations: prev.locations.map((loc) =>
          loc.id === id ? { ...loc, [field]: value } : loc,
        ),
      };
    });
  };

  const addLocation = (): void => {
    const newId = Math.max(...brandConfig!.locations.map((l) => l.id), 0) + 1;
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        locations: [
          ...prev.locations,
          {
            id: newId,
            name: "",
            address: "",
            phone: "",
            isPrimary: false,
          },
        ],
      };
    });
  };

  const removeLocation = (id: number): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        locations: prev.locations.filter((loc) => loc.id !== id),
      };
    });
  };

  const updateSocial = <K extends keyof SocialMedia>(
    index: number,
    field: K,
    value: SocialMedia[K],
  ): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        socialMedia: prev.socialMedia.map((social, i) =>
          i === index ? { ...social, [field]: value } : social,
        ),
      };
    });
  };

  const addSocialMedia = (): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        socialMedia: [
          ...prev.socialMedia,
          {
            platform: "",
            url: "",
            icon: "link",
            enabled: true,
          },
        ],
      };
    });
  };

  const removeSocial = (index: number): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        socialMedia: prev.socialMedia.filter((_, i) => i !== index),
      };
    });
  };

  const updateContact = <K extends keyof ContactInfo>(
    field: K,
    value: ContactInfo[K],
  ): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        contact: { ...prev.contact, [field]: value },
      };
    });
  };

  const updateLegal = <K extends keyof LegalInfo>(
    field: K,
    value: LegalInfo[K],
  ): void => {
    setBrandConfig((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        legal: { ...prev.legal, [field]: value },
      };
    });
  };

  const sections: Section[] = [
    { id: "logo", label: "LOGO & IDENTITY" },
    { id: "company", label: "COMPANY INFO" },
    { id: "locations", label: "LOCATIONS" },
    { id: "contact", label: "CONTACT" },
    { id: "social", label: "SOCIAL MEDIA" },
    { id: "legal", label: "LEGAL & PAYMENT" },
  ];

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
