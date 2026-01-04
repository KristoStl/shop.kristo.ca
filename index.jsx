import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import {
  Star,
  MapPin,
  ShoppingCart,
  X,
  Package,
  ArrowLeft,
  Check,
  ChevronDown,
  Gamepad2,
  Globe,
  ShieldCheck,
  Dice5,
  Wand2,
  Loader2,
} from "lucide-react";

// Stripe
import { loadStripe } from "@stripe/stripe-js";
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
      fullDesc:
        "Based in Airdrie, we provide world-class game systems specializing in Lua and C#. With over 2000 hours in Stormworks engineering, we build admin tools, physics-defying logic, and complete standalone prototypes.",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      iconName: "Gamepad2",
      basePrice: 50,
      customFields: [
        {
          id: "engine",
          label: "Engine Architecture",
          type: "select",
          options: ["Unity C#", "Stormworks Lua", "Roblox Luau", "Custom C++"],
        },
        {
          id: "features",
          label: "Core Systems",
          type: "list",
          options: ["Netcode", "Physics", "AI", "UI/UX", "Database"],
        },
        { id: "projName", label: "Project Name", type: "text", placeholder: "Operation: Thunder" },
        { id: "complexity", label: "Complexity Index", type: "number", min: 1, max: 10, default: 5 },
      ],
    },
    SITE_MAKING: {
      id: "site",
      type: "service",
      name: "Web Development",
      headline: "Liquid Glass Web Engineering",
      fullDesc:
        "We don't just make websites; we forge digital experiences. Utilizing React, Next.js, and Tailwind CSS, we build blazing-fast portfolios and stores. Locally owned and operated in Alberta.",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      iconName: "Globe",
      basePrice: 30,
      customFields: [
        {
          id: "stack",
          label: "Development Stack",
          type: "select",
          options: ["React/Tailwind", "Next.js Fullstack", "Static Site"],
        },
        { id: "pages", label: "Page Quantity", type: "number", min: 1, max: 50, default: 1 },
        {
          id: "addons",
          label: "Web Features",
          type: "list",
          options: ["Auth", "Stripe", "CMS", "SEO", "Analytics"],
        },
      ],
    },
  },
  SUBSCRIPTIONS: {
    MAINTENANCE: {
      id: "sub_maint",
      type: "subscription",
      name: "Priority Support",
      headline: "Zero Downtime Architecture",
      fullDesc:
        "Ongoing maintenance, security patches, and priority bug fixing for your existing systems. Billed monthly.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      iconName: "ShieldCheck",
      basePrice: 10,
      customFields: [
        {
          id: "tier",
          label: "Response Tier",
          type: "select",
          options: ["Basic 48h", "Pro 12h", "Elite 1h"],
        },
        { id: "systems", label: "Server Count", type: "number", min: 1, max: 5, default: 1 },
      ],
    },
  },
  RANDOM: {
    MYSTERY_CODE: {
      id: "rnd_code",
      type: "product",
      name: "Mystery Script",
      headline: "Algorithmic Luck of the Draw",
      fullDesc:
        "Receive a random, high-quality utility script from our private archive. Could be a shader, a pathfinder, or a UI kit.",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      iconName: "Dice5",
      basePrice: 5,
      customFields: [
        { id: "category", label: "Pool Category", type: "select", options: ["Logic", "Visuals", "Tools", "Universal"] },
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
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4" ref={containerRef}>
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
            <button
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full px-4 py-3 text-left hover:bg-orange-500 hover:text-black transition-colors ${value === opt ? "bg-white/5 text-orange-500" : "text-gray-400"}`}
            >
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
          <button
            key={opt}
            onClick={() => toggleItem(opt)}
            className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase flex items-center gap-2 transition-all ${
              selected.includes(opt) ? "bg-orange-500/10 border-orange-500 text-orange-500" : "bg-white/5 border-white/10 text-gray-500"
            }`}
          >
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
// APP COMPONENT
// ==========================
function App() {
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [showCart, setShowCart] = useState(false);

  const totalPrice = useMemo(() => cart.reduce((acc, i) => acc + (i.price || 0), 0), [cart]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, { ...item, cartId: Math.random().toString(36).substr(2, 9) }]);
    alert(`Added ${item.name} to haul!`);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.cartId !== id));

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.session.id });
    } catch (err) {
      console.error(err);
      alert("Checkout failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center border-b border-orange-500/10 backdrop-blur-3xl bg-black/60">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("home")}>
          <div className="relative w-10 h-10 bg-[#3D2B1F] rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Star className="text-yellow-400 fill-yellow-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-orange-500 uppercase">KristoShop</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <MapPin className="w-2 h-2 text-red-500" /> Airdrie • CA
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-10">
          {["home", "services", "subs", "random"].map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`text-[10px] font-black tracking-[0.2em] uppercase ${page === p ? "text-orange-500" : "text-gray-400 hover:text-white"}`}>
              {p === "home" ? "Station" : p === "services" ? "Bounties" : p === "subs" ? "Passes" : "Stash"}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCart(true)} className="relative p-2 text-orange-500">
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && <span className="absolute top-0 right-0 bg-orange-600 text-[10px] font-bold px-1.5 rounded-full ring-2 ring-black">{cart.length}</span>}
        </button>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-[80vh]">
        {page === "home" && <HomeView />}
        {page === "services" && <GridView data={DATA.SERVICES} onSelect={(s) => { setSelected(s); setPage("detail"); }} />}
        {page === "subs" && <GridView data={DATA.SUBSCRIPTIONS} onSelect={(s) => { setSelected(s); setPage("detail"); }} />}
        {page === "random" && <GridView data={DATA.RANDOM} onSelect={(s) => { setSelected(s); setPage("detail"); }} />}
        {page === "detail" && selected && <ProductDetail product={selected} addToCart={addToCart} />}
      </main>

      {/* CART */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-md bg-[#080808] border-l border-orange-500/20 h-full p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-orange-500 flex items-center gap-2 uppercase tracking-tighter">
                <Package className="w-6 h-6" /> YOUR HAUL
              </h3>
              <button onClick={() => setShowCart(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-4">
              {cart.map((item) => (
                <div key={item.cartId} className="p-4 rounded-2xl border border-white/5 bg-white/5 flex gap-4 items-center">
                  <div className="flex-grow">
                    <div className="font-bold text-sm text-white">{item.name}</div>
                    <div className="text-orange-500 font-mono text-xs">${item.price}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.cartId)}><X className="w-4 h-4 text-gray-500" /></button>
                </div>
              ))}
              {cart.length === 0 && <div className="text-center py-20 text-gray-600 text-xs font-bold uppercase tracking-widest">Haul is empty</div>}
            </div>
            <div className="pt-8 border-t border-white/10 mt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Total</span>
                <span className="text-3xl font-black text-orange-500">${totalPrice}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-5 rounded-2xl bg-[#FF6B00] text-black font-black text-lg hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                PROCEED TO STRIPE
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/5 py-12 text-center text-gray-600 text-[10px] uppercase font-bold tracking-[0.3em]">
        KristoShop • Airdrie • Alberta • CA
      </footer>
    </div>
  );
}

// ==========================
// HOME VIEW
// ==========================
const HomeView = () => (
  <section className="py-20 text-center">
    <h2 className="text-6xl md:text-[8rem] font-black mb-10 leading-[0.8] tracking-tighter">
      THE <br /> <span className="text-orange-500">FAR WEST</span> <br /> OF CODE.
    </h2>
    <p className="text-gray-400 text-lg md:text-2xl mb-12 max-w-2xl mx-auto uppercase font-bold tracking-tight">
      Boutique engineering in Airdrie. Specialized in Lua, Game Logic, and High-Performance React.
    </p>
  </section>
);

// ==========================
// GRID VIEW
// ==========================
const GridView = ({ data, onSelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {Object.values(data).map((s) => (
      <div key={s.id} onClick={() => onSelect(s)} className="cursor-pointer group flex flex-col bg-[#080808] border border-white/5 rounded-[3rem] overflow-hidden hover:border-orange-500/30 transition-all">
        <div className="h-56 overflow-hidden relative">
          <img src={s.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-2xl text-black"><IconRenderer name={s.iconName} className="w-5 h-5" /></div>
            <h3 className="text-2xl font-black text-white uppercase">{s.name}</h3>
          </div>
        </div>
        <div className="p-8 flex-grow flex flex-col">
          <p className="text-gray-500 text-xs italic mb-8">"{s.headline}"</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="text-3xl font-black text-orange-500">${s.basePrice}</span>
            <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest group-hover:text-white transition-colors">Configure →</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ==========================
// PRODUCT DETAIL
// ==========================
const ProductDetail = ({ product, addToCart }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleAdd = () => {
    const item = { ...product, ...formData, price: product.basePrice };
    addToCart(item);
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
      <img src={product.image} className="w-full h-full object-cover rounded-[3rem]" />
      <div>
        <h2 className="text-4xl font-black text-orange-500 mb-4">{product.name}</h2>
        <p className="text-gray-400 mb-6 italic">{product.headline}</p>
        <p className="text-gray-500 mb-6">{product.fullDesc}</p>

        {product.customFields && product.customFields.map((f) => {
          if (f.type === "select") return <CustomDropdown key={f.id} label={f.label} options={f.options} value={formData[f.id] || f.options[0]} onChange={(v) => handleChange(f.id, v)} />;
          if (f.type === "list") return <CustomListSelector key={f.id} label={f.label} options={f.options} selected={formData[f.id] || []} onChange={(v) => handleChange(f.id, v)} />;
          if (f.type === "text") return <input key={f.id} placeholder={f.placeholder} value={formData[f.id] || ""} onChange={(e) => handleChange(f.id, e.target.value)} className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500" />;
          if (f.type === "number") return <input key={f.id} type="number" min={f.min} max={f.max} value={formData[f.id] || f.default} onChange={(e) => handleChange(f.id, parseInt(e.target.value))} className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />;
          return null;
        })}

        <button onClick={handleAdd} className="mt-6 w-full py-5 rounded-2xl bg-orange-500 text-black font-black text-lg hover:bg-orange-400 transition-all">
          Add to Haul • ${product.basePrice}
        </button>

        <button onClick={() => window.history.back()} className="mt-4 w-full py-3 rounded-2xl border border-white/10 text-gray-400 font-bold text-sm hover:border-orange-500 hover:text-orange-500 transition-all">
          ← Back
        </button>
      </div>
    </div>
  );
};

// ==========================
// RENDER
// ==========================
ReactDOM.render(<App />, document.getElementById("root"));
