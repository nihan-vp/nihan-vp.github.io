import React, { useState, useEffect } from 'react';
import AnimatedSection from './AnimatedSection';
import { Cpu, Code, Leaf, Cloud, ArrowUpRight, Lock, LogOut, Plus, Check } from 'lucide-react';
import { db, collection, addDoc, getDocs, query } from '../firebase';

interface Product {
  id?: string;
  title: string;
  tagline: string;
  description: string;
  icon?: string; // stored as string e.g. 'cpu' | 'code' | 'leaf' | 'cloud'
  tags: string[];
  price: string;
  specs: string[];
  type: 'Hardware' | 'Software' | 'SaaS';
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    title: 'LumeOS Gateway',
    tagline: 'Edge IoT Gateway Hub',
    description: 'An industrial-grade IoT gateway running custom edge firmware. Collects telemetry from Modbus, BLE, and MQTT protocols, routing data securely to cloud dashboards.',
    icon: 'cpu',
    tags: ['ESP32', 'Raspberry Pi', 'C++', 'MQTT'],
    price: '$249 / node',
    specs: ['Dual-band Wi-Fi', 'LoRa Transceiver', 'IP65 Waterproof', 'Local Web GUI'],
    type: 'Hardware'
  },
  {
    title: 'AI GenBoiler',
    tagline: 'Enterprise Code Generator',
    description: 'SaaS platform that compiles database schemas and user prompts into highly-optimized, enterprise-ready React, Node.js, and TypeScript boilerplates instantly.',
    icon: 'code',
    tags: ['Next.js', 'LLM API', 'TypeScript', 'Docker'],
    price: '$19 / month',
    specs: ['Visual Schema Builder', 'Clean Architecture', 'API Spec generation', 'CI/CD Ready'],
    type: 'SaaS'
  },
  {
    title: 'HydroSense Telemetry',
    tagline: 'Smart Agricultural IoT Node',
    description: 'An ultra-low power solar-driven sensor node designed to monitor soil temperature, moisture, and NPK levels, broadcasting telemetry over LoRaWAN up to 10km.',
    icon: 'leaf',
    tags: ['Arduino', 'LoRaWAN', 'Solar telemetry', 'Sensors'],
    price: '$189 / node',
    specs: ['3-Year Battery Life', 'Solar Battery Charger', 'NPK Sensor Support', 'Geofencing Alert'],
    type: 'Hardware'
  },
  {
    title: 'VibeMesh Cloud',
    tagline: 'High-Throughput IoT Dashboard',
    description: 'Real-time telemetry broker and dashboarding platform capable of ingest-processing millions of metrics per second from distributed devices with zero lag.',
    icon: 'cloud',
    tags: ['Rust', 'WebSockets', 'React', 'TimescaleDB'],
    price: 'Custom / SaaS',
    specs: ['Real-time WebSockets', 'Automated Webhooks', 'SQL analytics API', '99.99% Uptime SLA'],
    type: 'Software'
  }
];

const getProductIcon = (iconName?: string) => {
  switch (iconName) {
    case 'cpu': return <Cpu className="w-6 h-6 text-cyan-400" />;
    case 'code': return <Code className="w-6 h-6 text-emerald-400" />;
    case 'leaf': return <Leaf className="w-6 h-6 text-amber-400" />;
    case 'cloud': return <Cloud className="w-6 h-6 text-purple-400" />;
    default: return <Cpu className="w-6 h-6 text-cyan-400" />;
  }
};

const ProductsSection: React.FC = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // New product form states
  const [newTitle, setNewTitle] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("cpu");
  const [newTags, setNewTags] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSpecs, setNewSpecs] = useState("");
  const [newType, setNewType] = useState<'Hardware' | 'Software' | 'SaaS'>('Hardware');

  // Sync / Load database helper
  const syncProducts = async () => {
    try {
      const q = query(collection(db, "products"));
      const querySnapshot = await getDocs(q);
      const items: Product[] = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as Product);
      });
      if (items.length > 0) {
        setProductsList(items);
        localStorage.setItem("nihan_portfolio_products", JSON.stringify(items));
      } else {
        loadLocalFallback();
      }
    } catch (error) {
      console.warn("Firebase query failed, loading local storage:", error);
      loadLocalFallback();
    }
  };

  const loadLocalFallback = () => {
    const saved = localStorage.getItem("nihan_portfolio_products");
    if (saved) {
      try {
        setProductsList(JSON.parse(saved));
      } catch (e) {
        setProductsList(DEFAULT_PRODUCTS);
      }
    } else {
      setProductsList(DEFAULT_PRODUCTS);
    }
  };

  useEffect(() => {
    syncProducts();
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "nihan311980") {
      setIsAdmin(true);
      setShowLogin(false);
      setPasswordInput("");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTagline || !newDesc || !newPrice) return;

    const tagsArray = newTags
      ? newTags.split(",").map(t => t.trim()).filter(Boolean)
      : ["React", "IoT"];

    const specsArray = newSpecs
      ? newSpecs.split(",").map(s => s.trim()).filter(Boolean)
      : ["High Performance", "Fully Integrated"];

    const newProd: Product = {
      title: newTitle,
      tagline: newTagline,
      description: newDesc,
      icon: newIcon,
      tags: tagsArray,
      price: newPrice,
      specs: specsArray,
      type: newType
    };

    // Optimistically update UI
    const updated = [newProd, ...productsList];
    setProductsList(updated);
    localStorage.setItem("nihan_portfolio_products", JSON.stringify(updated));

    // Try to write to Firestore
    try {
      await addDoc(collection(db, "products"), newProd);
      alert("Product saved successfully to Firebase!");
    } catch (err: any) {
      console.error("Firestore write failed:", err);
      alert("Firebase Save Failed: " + (err.message || err.code || err) + "\n\n(Tip: Check Firestore Security Rules in Firebase console to allow unauthenticated writes, or configure Auth.)");
    }

    // Reset Form
    setNewTitle("");
    setNewTagline("");
    setNewDesc("");
    setNewIcon("cpu");
    setNewTags("");
    setNewPrice("");
    setNewSpecs("");
    setNewType("Hardware");
  };

  return (
    <section id="products" className="py-28 relative">
      <AnimatedSection>
        <div className="text-center mb-16 relative">
          <h2 className="section-title gradient-text font-heading">Digital & Hardware Products</h2>
          <div className="accent-bar" />
          <p className="section-subtitle mb-4">
            Commercial SaaS, developer utilities, and IoT hardware nodes engineered for production environments
          </p>

          {/* Admin Lock Button */}
          <div className="absolute right-0 top-0">
            {!isAdmin ? (
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-gray-500 hover:text-white hover:bg-white/[0.05] transition-colors"
                title="Admin Access"
              >
                <Lock size={16} />
              </button>
            ) : (
              <button
                onClick={() => setIsAdmin(false)}
                className="px-4 py-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-950/60 transition-colors flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <LogOut size={12} />
                <span>Admin Logout</span>
              </button>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Secret Password Modal Overlay */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="glass-card p-8 w-full max-w-sm border-cyan-500/20 relative">
            <h4 className="text-lg font-bold font-heading text-white mb-2 flex items-center gap-2">
              <Lock size={18} className="text-cyan-400" />
              <span>Products Portal</span>
            </h4>
            <p className="text-xs text-gray-400 mb-6">Enter secret key to unlock manager.</p>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                placeholder="Secret Key"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm mb-4 focus:outline-none focus:border-cyan-500/50"
              />
              {loginError && <p className="text-xs text-red-400 mb-4">Invalid credentials.</p>}
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin product adding form panel */}
      {isAdmin && (
        <AnimatedSection>
          <div className="glass-card p-6 max-w-2xl mx-auto mb-16 border-cyan-500/30">
            <h3 className="text-lg font-bold text-white font-heading mb-4 flex items-center gap-2">
              <Plus size={18} className="text-cyan-400" />
              <span>Add New Product Showcase</span>
            </h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Tagline (e.g. Edge IoT Gateway Hub)"
                value={newTagline}
                onChange={(e) => setNewTagline(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Tags / Tech (comma separated)"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Price (e.g. $19 / month, $249 / node)"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Key Features / Specs (comma separated)"
                value={newSpecs}
                onChange={(e) => setNewSpecs(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 md:col-span-2"
              />
              
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-semibold px-1">Product Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="px-4 py-2.5 bg-black border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="SaaS">SaaS</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-semibold px-1">Icon Style</label>
                <select
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="px-4 py-2.5 bg-black border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="cpu">Processor / IoT (CPU)</option>
                  <option value="code">Code / Software (Code)</option>
                  <option value="leaf">Eco / Green Tech (Leaf)</option>
                  <option value="cloud">Cloud / SaaS (Cloud)</option>
                </select>
              </div>

              <textarea
                placeholder="Product Description..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 md:col-span-2"
                required
              />
              <button
                type="submit"
                className="btn-primary md:col-span-2 flex items-center justify-center gap-2 !py-2.5"
              >
                <Check size={16} />
                <span>Save Product Showcase</span>
              </button>
            </form>
          </div>
        </AnimatedSection>
      )}

      {/* Products Grid Display */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {productsList.map((prod, index) => (
          <AnimatedSection key={index} delay={index * 0.1} direction="scale">
            <div className="glass-card p-6 md:p-8 flex flex-col h-full relative group border border-white/[0.08] bg-slate-900/40 rounded-xl hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              
              {/* Top Row: Icon & Type Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {getProductIcon(prod.icon)}
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${
                  prod.type === 'Hardware' 
                    ? 'border-amber-500/30 text-amber-400 bg-amber-950/20' 
                    : prod.type === 'SaaS'
                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                    : 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20'
                }`}>
                  {prod.type}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-2xl font-bold text-white mb-1 font-heading group-hover:text-[hsl(var(--color-cyan-base))] transition-colors duration-300">
                {prod.title}
              </h3>
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-4">
                {prod.tagline}
              </p>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-grow">
                {prod.description}
              </p>

              {/* Specifications Grid */}
              {prod.specs && prod.specs.length > 0 && (
                <div className="bg-black/20 rounded-xl p-4 mb-6 border border-white/[0.02]">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5">Key Features</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {prod.specs.map((spec, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[hsl(var(--color-cyan-base))]" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer pricing and action */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] mt-auto">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Pricing</span>
                  <span className="text-sm font-bold text-white">{prod.price}</span>
                </div>
                <a
                  href="#contact"
                  className="flex items-center gap-1 text-xs font-semibold text-[hsl(var(--color-cyan-base))] hover:text-white transition-colors group/link"
                >
                  <span>Inquire</span>
                  <ArrowUpRight size={14} className="transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </div>

            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
