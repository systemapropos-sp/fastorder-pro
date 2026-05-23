import { useState } from "react";

import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/store/cartStore";
import { Plus, Star, Minus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const TENANT_ID = 1;

export default function KioskMenu() {
  const addToCart = useCartStore((s) => s.addItem);
  const { data: categories } = trpc.menu.categories.useQuery({ tenantId: TENANT_ID });
  const { data: menuItems } = trpc.menu.items.useQuery({ tenantId: TENANT_ID });

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [selectedOpts, setSelectedOpts] = useState<Record<string, string[]>>({});

  const filtered = activeCategory ? menuItems?.filter((i) => i.categoryId === activeCategory) : menuItems;

  const openItem = (item: any) => {
    setSelectedItem(item);
    setQty(1);
    const defs: Record<string, string[]> = {};
    if (item.options) {
      for (const o of item.options) {
        if (o.required && !o.multiSelect) defs[o.name] = [o.choices[0]?.label ?? ""];
        else defs[o.name] = [];
      }
    }
    setSelectedOpts(defs);
  };

  const calcPrice = () => {
    if (!selectedItem) return 0;
    let p = parseFloat(selectedItem.price);
    if (selectedItem.options) {
      for (const o of selectedItem.options) {
        const s = selectedOpts[o.name] ?? [];
        for (const c of o.choices) if (s.includes(c.label)) p += c.priceModifier;
      }
    }
    return p * qty;
  };

  const add = () => {
    if (!selectedItem) return;
    const opts: any[] = [];
    if (selectedItem.options) {
      for (const o of selectedItem.options) {
        const s = selectedOpts[o.name] ?? [];
        if (s.length > 0) {
          let m = 0;
          for (const c of o.choices) if (s.includes(c.label)) m += c.priceModifier;
          opts.push({ optionName: o.name, choices: s, priceModifier: m });
        }
      }
    }
    addToCart({
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      price: parseFloat(selectedItem.price),
      quantity: qty,
      image: selectedItem.image,
      selectedOptions: opts,
    });
    setSelectedItem(null);
  };

  const toggleOpt = (name: string, choice: string, multi: boolean) => {
    setSelectedOpts((prev) => {
      const cur = prev[name] ?? [];
      if (multi) return { ...prev, [name]: cur.includes(choice) ? cur.filter((c) => c !== choice) : [...cur, choice] };
      return { ...prev, [name]: [choice] };
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`flex-shrink-0 px-6 py-3 rounded-xl text-base font-medium transition-colors ${
            activeCategory === null ? "bg-amber-500 text-white shadow-md" : "bg-white border text-gray-700 hover:bg-gray-50"
          }`}
        >
          All Items
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-6 py-3 rounded-xl text-base font-medium transition-colors ${
              activeCategory === cat.id ? "bg-amber-500 text-white shadow-md" : "bg-white border text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filtered?.map((item) => (
          <button
            key={item.id}
            onClick={() => openItem(item)}
            className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-lg transition-all text-left group"
          >
            <div className="relative">
              <img src={item.image ?? ""} alt={item.name} className="w-full h-40 object-cover" />
              {item.isPopular && (
                <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3" /> Popular
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xl font-bold text-amber-600">${item.price}</span>
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Item Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-0">
          {selectedItem?.image && (
            <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-52 object-cover" />
          )}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">{selectedItem?.name}</h2>
            <p className="text-gray-500 mt-1">{selectedItem?.description}</p>

            {selectedItem?.options?.map((opt: any) => (
              <div key={opt.name} className="mt-4">
                <p className="font-medium text-gray-900 mb-2">
                  {opt.name} {opt.required && <span className="text-red-500">*</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {opt.choices.map((c: any) => {
                    const sel = (selectedOpts[opt.name] ?? []).includes(c.label);
                    return (
                      <button
                        key={c.label}
                        onClick={() => toggleOpt(opt.name, c.label, opt.multiSelect)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                          sel ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {c.label}
                        {c.priceModifier !== 0 && (
                          <span className={c.priceModifier > 0 ? "text-amber-600 ml-1" : "text-green-600 ml-1"}>
                            {c.priceModifier > 0 ? `+$${c.priceModifier.toFixed(2)}` : `-$${Math.abs(c.priceModifier).toFixed(2)}`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center gap-4">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-2xl font-bold w-8 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={add}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-md"
              >
                Add — ${calcPrice().toFixed(2)}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
