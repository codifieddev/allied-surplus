"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, Loader2, Check, Plus } from "lucide-react";
import { mappedLanguages } from "./mappedLanguageCode";

interface CountrySearchModalProps {
  onSelect: (data: { languages: any[]; currencies: any[]; countryName: string }) => void;
  trigger?: React.ReactNode;
}

export const CountrySearchModal = ({ onSelect, trigger }: CountrySearchModalProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`https://restcountries.com/v3.1/name/${search}`);
      if (!resp.ok) throw new Error("Country not found");
      const data = await resp.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setResults([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (country: any) => {
    const languages = country.languages
      ? Object.entries(country.languages).map(([code, name]) => {
          const mappedCode = mappedLanguages[code.toLowerCase()] || code;
          return {
            code: mappedCode,
            name: name as string,
            enabled: true,
          };
        })
      : [];

    const currencies = country.currencies
      ? Object.entries(country.currencies).map(([code, info]: [string, any]) => ({
          code,
          name: info.name,
          symbol: info.symbol || code,
          enabled: true
        }))
      : [];

    onSelect({
      languages,
      currencies,
      countryName: country.name.common
    });
    setOpen(false);
    setSearch("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-olive hover:bg-[#7a8944] text-white font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> ADD TACTICAL REGION
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-ink border-charcoal-light text-white p-0 overflow-hidden">
        <div className="p-6 bg-charcoal border-b border-charcoal-light">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-[0.2em] text-gold flex items-center gap-3">
              <Globe className="w-6 h-6 text-gold" />
              Regional <span className="text-white">Discovery</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="SEARCH BY COUNTRY NAME (E.G. PERU, JAPAN)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-ink border-neutral-800 text-xs font-bold tracking-widest focus:border-gold rounded-none uppercase"
            />
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
          {loading && (
            <div className="flex items-center justify-center p-8 gap-3 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Intercepting Data...</span>
            </div>
          )}

          {!loading && results.map((country: any) => (
            <button
              key={country.cca3}
              onClick={() => handleSelect(country)}
              className="w-full flex items-center justify-between p-3 hover:bg-neutral-800 transition-colors group text-left border border-transparent hover:border-gold/30"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{country.name.common}</h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                    {country.region} • {country.subregion}
                  </p>
                </div>
              </div>
              <Check className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}

          {!loading && search && results.length === 0 && !error && (
             <div className="p-8 text-center text-slate-500">
                <p className="text-[10px] font-bold uppercase tracking-widest">No Intelligence Found for "{search}"</p>
             </div>
          )}

          {error && (
            <div className="p-8 text-center text-red-500/70">
              <p className="text-[10px] font-bold uppercase tracking-widest">Frequency Error: {error}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-charcoal border-t border-charcoal-light flex justify-end">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">
                Source: RestCountries Global Intelligence System
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
