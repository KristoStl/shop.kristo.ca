import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Star, MapPin, ShoppingCart, X, Package, Check, ChevronDown, Gamepad2, Globe, ShieldCheck, Dice5 } from "lucide-react";

// Stripe
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

// ==========================
// DATA DEFINITIONS
// ==========================
const DATA = {
  SERVICES: {
    GAME_MAKING: {
      id: "game",
      type: "service",
      name: "Game Development",
      headline: "High-Octane Logic for Modern Gaming",
      fullDesc: "We build world-class game systems with Lua/C#, admin tools, and complete prototypes.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      iconName: "Gamepad2",
      basePrice: 50,
      customFields: [
        { id: "engine", label: "Engine Architecture", type: "select", options: ["Unity C#", "Stormworks Lua", "Roblox Luau", "Custom C++"] },
        { id: "features", label: "Core Systems", type: "list", options: ["Netcode", "Physics", "AI", "UI/UX", "Database"] },
        { id: "projName", label: "Project Name", type: "text", placeholder: "Operation: Thunder" },
        { id: "complexity", label: "Complexity Index", type: "number", min: 1, max: 10, default: 5 },
      ],
    },
  },
};

// ==========================
// ICON RENDERER
// ==========================
const IconRenderer = ({ name, className }) => {
  const icons = { Gamepad2, Globe, ShieldCheck, Dice5, Star, MapPin };
  const IconComponent = icons[name] || Star;
  return <IconComponent className={className} />;
};

// ==========================
// CUSTOM DROPDOWN
// ==========================
const CustomDropdown = ({ value, options, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative mb-4">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm flex justify-between items-center hover:border-orange-500/50 transition-colors"
      >
        <span className="font-bold text-white">{value}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#121212] border border-white/10 rounded-2xl overflow-hidden z-50">
          {options.map((opt) => (
            <button key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full px-4 py-3 text-left hover:bg-orange-500 hover:text-black transition-colors ${value === opt ? "bg-white/5 text-orange-500" : "text-gray-400"}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================
// CUSTOM LIST SELECTOR
// ==========================
const CustomListSelector = ({ label, options, selected = [], onChange }) => {
  const toggleItem = (item) => {
    const next = selected.includes(item) ? selected.filter((i) => i !== item) : [...selected, item];
    onChange(next);
  };

  return (
    <div className="mb-4">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button key={opt} onClick={() => toggleItem(opt)} className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase flex items-center gap-2 transition-all ${selected.includes(opt) ? "bg-orange-500/10 border-orange-500 text-orange-500" : "bg-white/5 border-white/10 text-gray-500"}`}>
            <div className={`w-3 h-3 rounded-sm border ${selected.includes(opt) ? "bg-orange-500 border-orange-500" : "border-gray-700"} flex items-center justify-center`}>
              {selected.includes(opt) && <Check size={8} className="text-black" />}
            </div>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================
// PRODUCT DETAIL
// ==========================
const ProductDetail = ({ product, addToCart }) => {
  const [formData, setFormData] = useState({});
  const handleChange = (fieldId, value) => setFormData(prev => ({ ...prev, [fieldId]: value }));

  const handleAdd = () => {
    const priceMultiplier = (formData.complexity || 1) * 5;
    const item = { ...product, ...formData, price: product.basePrice + priceMultiplier };
    addToCart(item);
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
      <img src={product.image} className="w-full h-full object-cover rounded-[3rem]" />
      <div>
        <h2 className="text-4xl font-black text-orange-500 mb-4">{product.name}</h2>
        <p className="text-gray-400 mb-6 italic">{product.headline}</p>
        <p className="text-gray-500 mb-6">{product.fullDesc}</p>

        {product.customFields && product.customFields.map(f => {
          if(f.type === "select") return <CustomDropdown key={f.id} label={f.label} options={f.options} value={formData[f.id] || f.options[0]} onChange={v => handleChange(f.id,v)} />;
          if(f.type === "list") return <CustomListSelector key={f.id} label={f.label} options={f.options} selected={formData[f.id] || []} onChange={v => handleChange(f.id,v)} />;
          if(f.type === "text") return <input key={f.id} placeholder={f.placeholder} value={formData[f.id] || ""} onChange={e => handleChange(f.id,e.target.value)} className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500" />;
          if(f.type === "number") return <input key={f.id} type="number" min={f.min} max={f.max} value={formData[f.id] || f.default} onChange={e => handleChange(f.id,parseInt(e.target.value))} className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />;
          return null;
        })}

        <button onClick={handleAdd} className="mt-6 w-full py-5 rounded-2xl bg-orange-500 text-black font-black text-lg hover:bg-orange-400 transition-all">
          Add to Haul
        </button>
      </div>
    </div>
  );
};

// ==========================
// APP COMPONENT
// ==========================
const App = () => {
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState(DATA.SERVICES.GAME_MAKING);

  const totalPrice = useMemo(() => cart.reduce((acc,i)=>acc+i.price,0),[cart]);

  const addToCart = (item) => setCart(prev => [...prev,{...item, cartId:Math.random().toString(36).substr(2,9)}]);
  const removeFromCart = (id) => setCart(prev => prev.filter(i=>i.cartId !== id));

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ items: cart }),
    });
    const data = await res.json();
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6">
      <h1 className="text-5xl font-black text-orange-500 mb-8">KristoShop</h1>
      <ProductDetail product={selected} addToCart={addToCart} />

      <div className="mt-10 p-6 bg-[#080808] rounded-[2rem]">
        <h2 className="font-black text-orange-500 mb-4">Cart ({cart.length})</h2>
        {cart.map(item => (
          <div key={item.cartId} className="flex justify-between mb-2 border-b border-white/10 pb-2">
            <span>{item.name}</span>
            <span>${item.price}</span>
            <button onClick={()=>removeFromCart(item.cartId)}><X className="inline w-4 h-4 ml-2"/></button>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-bold text-orange-500">Total: ${totalPrice}</div>
        <button onClick={handleCheckout} disabled={cart.length===0} className="mt-4 w-full py-3 bg-orange-500 text-black font-black rounded-2xl disabled:opacity-50">Checkout</button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
