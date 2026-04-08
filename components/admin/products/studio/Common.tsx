export function SectionCard({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-charcoal/60 rounded-sm border border-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
        <div className="p-2 bg-white/5 rounded-sm border border-white/10 flex items-center justify-center text-gold/60">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-none mb-1.5">
            Operational Section
          </span>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] leading-none">
            {title}
          </h3>
        </div>
      </div>
      {children}
    </div>
  );
}
