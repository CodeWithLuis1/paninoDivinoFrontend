export default function CategoryTabs({ active, onChange, counts }) {
  const tabs = [
    { key: 'paninis',   label: 'Paninis'   },
    { key: 'bagels',    label: 'Bagels'    },
    { key: 'smoothies', label: 'Smoothies 12oz' },
    { key: 'calientes', label: 'Bebidas calientes' },
    { key: 'frias',     label: 'Bebidas frías' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pr-1">
      {tabs.map(t => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`pill whitespace-nowrap ${isActive ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            {t.label}
            <span className={`ml-2 text-xs ${isActive ? 'text-white/90' : 'text-slate-500'}`}>
              {counts?.[t.key] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
