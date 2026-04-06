"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MediaUploader } from "./MediaManage";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, Layers } from "lucide-react";

interface MediaLibraryModalProps {
  onSelect: (media: { url: string; alt: string }) => void;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export const MediaLibraryModal = ({
  onSelect,
  trigger,
  isOpen: externalOpen,
  onClose: externalClose,
}: MediaLibraryModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  
  const setOpen = (val: boolean) => {
    if (isControlled) {
      if (!val && externalClose) externalClose();
    } else {
      setInternalOpen(val);
    }
  };

  const handleSelect = (media: any) => {
    onSelect({
      url: media.url,
      alt: media.alt || "",
    });
    setOpen(false);
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger || (
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-charcoal border-charcoal-light text-gold hover:bg-gold hover:text-ink transition-all rounded-none"
          >
            <ImageIcon size={18} />
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!h-[95vh] !max-w-[95vw] w-[95vw] !p-1 border-2 border-gold bg-ink shadow-[0_0_50px_rgba(212,175,55,0.2)] [&>button]:hidden">
          <div className="bg-charcoal h-full flex flex-col border border-charcoal-light">
            <div className="flex items-center justify-between p-6 border-b border-charcoal-light bg-ink">
              <div className="flex items-center gap-4">
                <Layers className="text-gold" size={24} />
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">
                    Asset <span className="text-gold">Intelligence</span>
                  </h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-1 italic">
                    Select or deploy tactical media assets.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-gold hover:bg-charcoal transition-all"
              >
                <X size={24} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto bg-ink">
              <MediaUploader onSelect={handleSelect} hideHeader={true} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
