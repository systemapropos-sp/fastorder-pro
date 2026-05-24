import { useState } from "react";

import { useMenuCategories, useMenuItems, usePopularMenuItems } from "@/hooks/useStaticQueries";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Leaf, Flame, WheatOff, Plus, Minus, Star, Clock, ShoppingBag } from "lucide-react";

export default function MenuPage() {
  const { data: categories } = useMenuCategories();
  const { data: menuItems } = useMenuItems();
  const { data: popularItems } = usePopularMenuItems();

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  const addToCart = useCartStore((s) => s.addItem);

  const filteredItems = activeCategory
    ? menuItems?.filter((i) => i.categoryId === activeCategory)
    : menuItems;

  const openCustomize = (item: any) => {
    setSelectedItem(item);
    setQuantity(1);
    const defaults: Record<string, string[]> = {};
    if (item.options) {
      for (const opt of item.options) {
        if (opt.required && !opt.multiSelect) {
          defaults[opt.name] = [opt.choices[0]?.label ?? ""];
        } else {
          defaults[opt.name] = [];
        }
      }
    }
    setSelectedOptions(defaults);
  };

  const calculatePrice = () => {
    if (!selectedItem) return 0;
    let base = parseFloat(selectedItem.price);
    if (selectedItem.options) {
      for (const opt of selectedItem.options) {
        const sel = selectedOptions[opt.name] ?? [];
        for (const choice of opt.choices) {
          if (sel.includes(choice.label)) {
            base += choice.priceModifier;
          }
        }
      }
    }
    return base * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    const options = [] as { optionName: string; choices: string[]; priceModifier: number }[];
    if (selectedItem.options) {
      for (const opt of selectedItem.options) {
        const sel = selectedOptions[opt.name] ?? [];
        if (sel.length > 0) {
          let modifier = 0;
          for (const c of opt.choices) if (sel.includes(c.label)) modifier += c.priceModifier;
          options.push({ optionName: opt.name, choices: sel, priceModifier: modifier });
        }
      }
    }
    addToCart({
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      price: parseFloat(selectedItem.price),
      quantity,
      image: selectedItem.image,
      selectedOptions: options,
    });
    setSelectedItem(null);
  };

  const toggleOption = (optName: string, choice: string, multiSelect: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[optName] ?? [];
      if (multiSelect) {
        return { ...prev, [optName]: current.includes(choice) ? current.filter((c) => c !== choice) : [...current, choice] };
      }
      return { ...prev, [optName]: [choice] };
    });
  };

  return (
    <div className="pb-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Order Online</h2>
          <p className="text-amber-100">Fresh artisan sandwiches, salads, soups & baked goods</p>
        </div>
      </div>

      {/* Popular Items */}
      {popularItems && popularItems.length > 0 && (
        <div className="px-4 py-6 bg-white border-b">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Popular Items
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {popularItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openCustomize(item)}
                  className="snap-start flex-shrink-0 w-48 bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow text-left"
                >
                  <img src={item.image ?? ""} alt={item.name} className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                    <p className="text-amber-600 font-bold text-sm mt-1">${item.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="px-4 py-4 bg-white border-b sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === null ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Items
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow flex"
            >
              <img src={item.image ?? ""} alt={item.name} className="w-32 h-full object-cover flex-shrink-0" />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <span className="font-bold text-amber-600 whitespace-nowrap">${item.price}</span>
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {item.isVegetarian && (
                    <Badge variant="outline" className="text-green-600 border-green-300 text-[10px] px-1.5 py-0">
                      <Leaf className="w-3 h-3 mr-0.5" /> Veg
                    </Badge>
                  )}
                  {item.isVegan && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-300 text-[10px] px-1.5 py-0">
                      Vegan
                    </Badge>
                  )}
                  {item.isGlutenFree && (
                    <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px] px-1.5 py-0">
                      <WheatOff className="w-3 h-3 mr-0.5" /> GF
                    </Badge>
                  )}
                  {item.isPopular && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300 text-[10px] px-1.5 py-0">
                      <Star className="w-3 h-3 mr-0.5" /> Popular
                    </Badge>
                  )}
                  {item.calories && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {item.prepTimeMinutes}min · {item.calories}cal
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-3">
                  <Button
                    size="sm"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => openCustomize(item)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Order
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customize Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedItem?.name}</DialogTitle>
          </DialogHeader>

          {selectedItem?.image && (
            <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-48 object-cover rounded-lg" />
          )}

          <p className="text-sm text-gray-600">{selectedItem?.description}</p>

          {/* Options */}
          {selectedItem?.options?.map((opt: any) => (
            <div key={opt.name} className="space-y-2">
              <h4 className="font-medium text-sm">
                {opt.name}
                {opt.required && <span className="text-red-500 ml-1">*</span>}
              </h4>
              <div className="space-y-1">
                {opt.choices.map((choice: any) => {
                  const isSelected = (selectedOptions[opt.name] ?? []).includes(choice.label);
                  return (
                    <button
                      key={choice.label}
                      onClick={() => toggleOption(opt.name, choice.label, opt.multiSelect)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors ${
                        isSelected ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${opt.multiSelect ? "border" : "rounded-full border"} flex items-center justify-center ${
                          isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300"
                        }`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        {choice.label}
                      </span>
                      {choice.priceModifier > 0 && <span className="text-amber-600">+${choice.priceModifier.toFixed(2)}</span>}
                      {choice.priceModifier < 0 && <span className="text-green-600">${choice.priceModifier.toFixed(2)}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <Separator />

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add Button */}
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-lg" onClick={handleAddToCart}>
            <ShoppingBag className="w-5 h-5 mr-2" />
            Add to Cart — ${calculatePrice().toFixed(2)}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
