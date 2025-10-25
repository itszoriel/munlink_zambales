# MunicipLink Zambales: Modern Design System

## 🎨 DESIGN PHILOSOPHY

**"Bridging Heritage with Innovation"**

MunicipLink Zambales combines traditional Filipino government authenticity with cutting-edge web experiences. This isn't just a portal—it's a living, breathing digital community.

---

## 🌊 MODERN COLOR PALETTE

### Primary Colors - Zambales Ocean
```css
/* Ocean Blue Gradients - Dynamic & Vibrant */
--ocean-50: #e6f7ff
--ocean-100: #bae7ff
--ocean-200: #91d5ff
--ocean-500: #0ea5e9  /* Primary action color */
--ocean-600: #0284c7
--ocean-700: #0369a1
--ocean-900: #002d4a

/* Gradient Overlays */
--ocean-gradient: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)
--ocean-glow: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)
```

### Secondary Colors - Mountain & Forest
```css
/* Vibrant Greens - Nature-inspired */
--forest-50: #ecfdf5
--forest-100: #d1fae5
--forest-500: #10b981
--forest-600: #059669
--forest-gradient: linear-gradient(135deg, #10b981 0%, #047857 100%)
```

### Accent Colors - Sunset & Gold
```css
/* Warm Accents - Philippine Sunset */
--sunset-500: #f59e0b
--sunset-600: #d97706
--sunset-gradient: linear-gradient(135deg, #f59e0b 0%, #d97706 100%)

/* Premium Gold - Provincial Seal */
--gold-500: #fbbf24
--gold-gradient: linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)
```

### Neutral Palette - Modern & Clean
```css
/* Glass Morphism Compatible */
--neutral-0: #ffffff
--neutral-50: #f9fafb
--neutral-100: #f3f4f6
--neutral-200: #e5e7eb
--neutral-500: #6b7280
--neutral-700: #374151
--neutral-900: #111827

/* Glass Effect */
--glass-white: rgba(255, 255, 255, 0.8)
--glass-dark: rgba(17, 24, 39, 0.6)
```

---

## ✨ MODERN DESIGN PATTERNS

### 1. **Glassmorphism UI**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.glass-dark {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 2. **Neumorphism Elements**
```css
.neomorphic-card {
  background: #f3f4f6;
  border-radius: 20px;
  box-shadow: 
    12px 12px 24px rgba(174, 174, 192, 0.4),
    -12px -12px 24px rgba(255, 255, 255, 0.8);
}

.neomorphic-inset {
  box-shadow: 
    inset 8px 8px 16px rgba(174, 174, 192, 0.4),
    inset -8px -8px 16px rgba(255, 255, 255, 0.8);
}
```

### 3. **Gradient Mesh Backgrounds**
```css
.mesh-gradient-bg {
  background: 
    radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.2) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.2) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(245, 158, 11, 0.2) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(14, 165, 233, 0.2) 0px, transparent 50%);
}
```

### 4. **Animated Gradients**
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animated-gradient {
  background: linear-gradient(
    -45deg, 
    #0ea5e9, 
    #0369a1, 
    #10b981, 
    #f59e0b
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

---

## 🎯 MICRO-INTERACTIONS & ANIMATIONS

### Button Interactions
```tsx
// Modern Button Component
<button className="group relative overflow-hidden bg-ocean-gradient text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl">
  <span className="relative z-10">Click Me</span>
  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
  <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-gradient-to-t from-black/10 to-transparent transition-transform duration-300"></div>
</button>

// Ripple Effect Button
<button className="relative overflow-hidden px-6 py-3 bg-ocean-500 text-white rounded-xl" onClick={createRipple}>
  Button Text
</button>

// JavaScript for Ripple
const createRipple = (e) => {
  const button = e.currentTarget;
  const ripple = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${e.clientX - button.offsetLeft - diameter/2}px`;
  ripple.style.top = `${e.clientY - button.offsetTop - diameter/2}px`;
  ripple.classList.add('ripple');
  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
};
```

### Card Hover Effects
```css
.card-modern {
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-modern:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 60px -15px rgba(14, 165, 233, 0.3),
    0 0 0 1px rgba(14, 165, 233, 0.1);
}

/* Glow on Hover */
.card-modern::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  filter: blur(20px);
}

.card-modern:hover::before {
  opacity: 0.6;
}
```

### Loading States
```tsx
// Skeleton Loader with Shimmer
<div className="animate-pulse">
  <div className="relative overflow-hidden bg-neutral-200 rounded-lg h-48">
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
  </div>
</div>

// CSS for Shimmer
@keyframes shimmer {
  to { transform: translateX(100%); }
}
.animate-shimmer { animation: shimmer 2s infinite; }
```

---

## 🏠 MODERN HERO SECTION

### Dynamic Hero with Parallax
```tsx
<section className="relative min-h-screen overflow-hidden">
  {/* Animated Background */}
  <div className="absolute inset-0">
    <img 
      src="/Nature.jpg" 
      className="w-full h-full object-cover scale-110"
      style={{transform: `translateY(${scrollY * 0.5}px)`}}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/60 via-ocean-900/40 to-neutral-900/80"></div>
  </div>
  
  {/* Floating Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-20 left-10 w-72 h-72 bg-ocean-500/20 rounded-full blur-3xl animate-float"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-forest-500/20 rounded-full blur-3xl animate-float-delayed"></div>
  </div>
  
  {/* Hero Content */}
  <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
    {/* Provincial Seal with Glow */}
    <div className="relative mb-8 animate-fade-in-up">
      <div className="absolute inset-0 bg-ocean-500/30 rounded-full blur-3xl scale-150"></div>
      <img 
        src="/Zambales Logo/512px-Seal_of_Province_of_Zambales.svg.png"
        className="relative w-40 h-40 md:w-56 md:h-56 drop-shadow-2xl animate-gentle-spin"
      />
    </div>
    
    {/* Title with Gradient Text */}
    <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-up animation-delay-200">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-ocean-100 via-white to-ocean-100">
        MunicipLink Zambales
      </span>
    </h1>
    
    <p className="text-xl md:text-2xl text-ocean-50 mb-8 max-w-2xl animate-fade-in-up animation-delay-400">
      Your Digital Bridge to Community, Commerce & Services
    </p>
    
    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
      <button className="group px-8 py-4 bg-white text-ocean-700 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-2xl">
        <span className="flex items-center gap-2">
          Explore Marketplace
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>
      
      <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
        Request Documents
      </button>
    </div>
  </div>
  
  {/* Scroll Indicator */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
</section>

{/* Animations */}
<style jsx>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
  }
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(20px) scale(0.95); }
  }
  @keyframes gentle-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
  .animate-gentle-spin { animation: gentle-spin 60s linear infinite; }
  .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
  .animation-delay-200 { animation-delay: 0.2s; opacity: 0; }
  .animation-delay-400 { animation-delay: 0.4s; opacity: 0; }
  .animation-delay-600 { animation-delay: 0.6s; opacity: 0; }
`}</style>
```

---

## 🎴 MODERN CARD DESIGNS

### Glass Card with Hover Effects
```tsx
<div className="group relative">
  {/* Glow Effect */}
  <div className="absolute -inset-0.5 bg-ocean-gradient opacity-0 group-hover:opacity-100 rounded-2xl blur transition-opacity duration-500"></div>
  
  {/* Card Content */}
  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 transition-transform duration-300 group-hover:scale-[1.02]">
    <div className="flex items-start gap-4">
      {/* Image with Overlay */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img src="/image.jpg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ocean-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-neutral-900 mb-1 group-hover:text-ocean-600 transition-colors">
          Card Title
        </h3>
        <p className="text-sm text-neutral-600 line-clamp-2">
          Description text that provides context
        </p>
        
        {/* Tags */}
        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1 bg-ocean-100 text-ocean-700 text-xs font-medium rounded-full">
            Tag
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Bento Grid Layout (Modern Masonry)
```tsx
<div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[200px]">
  {/* Large Featured Card */}
  <div className="md:col-span-4 md:row-span-2 bg-ocean-gradient rounded-3xl p-8 text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <img src="/pattern.svg" className="w-full h-full object-cover" />
    </div>
    <div className="relative z-10">
      <h2 className="text-3xl font-bold mb-4">Featured Content</h2>
      <p className="text-ocean-100">Large featured area for important announcements</p>
    </div>
  </div>
  
  {/* Small Cards */}
  <div className="md:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
    <h3 className="font-bold mb-2">Quick Stat</h3>
    <p className="text-3xl font-bold text-ocean-600">1,234</p>
  </div>
  
  <div className="md:col-span-2 bg-forest-gradient rounded-2xl p-6 text-white">
    <h3 className="font-bold mb-2">Action Card</h3>
    <button className="mt-2 px-4 py-2 bg-white/20 rounded-lg">Action</button>
  </div>
  
  {/* Medium Card */}
  <div className="md:col-span-3 md:row-span-1 bg-white/70 backdrop-blur-xl rounded-2xl p-6">
    <h3 className="font-bold mb-3">Recent Activity</h3>
    <div className="space-y-2">
      {/* Activity items */}
    </div>
  </div>
</div>
```

---

## 🎨 MODERN NAVIGATION

### Floating Navigation Bar
```tsx
<nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6">
  <div className="bg-white/70 backdrop-blur-xl rounded-full px-8 py-4 shadow-2xl border border-white/50">
    <div className="flex items-center gap-8">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src="/Zambales Logo/64px-Seal_of_Province_of_Zambales.svg.png" className="w-10 h-10" />
        <span className="font-bold text-ocean-700 hidden lg:block">MunicipLink</span>
      </div>
      
      {/* Nav Links */}
      <div className="flex items-center gap-6">
        {['Home', 'Marketplace', 'Documents', 'About'].map(item => (
          <a 
            key={item}
            href={`/${item.toLowerCase()}`}
            className="relative text-sm font-medium text-neutral-700 hover:text-ocean-600 transition-colors group"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ocean-gradient group-hover:w-full transition-all duration-300"></span>
          </a>
        ))}
      </div>
      
      {/* CTA Button */}
      <button className="ml-auto px-6 py-2 bg-ocean-gradient text-white rounded-full font-medium hover:scale-105 transition-transform">
        Login
      </button>
    </div>
  </div>
</nav>
```

### Mobile Bottom Navigation
```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-neutral-200 px-6 py-3 md:hidden z-50">
  <div className="flex items-center justify-around">
    {[
      { icon: 'home', label: 'Home' },
      { icon: 'shopping-bag', label: 'Market' },
      { icon: 'file-text', label: 'Docs' },
      { icon: 'user', label: 'Profile' }
    ].map(item => (
      <button 
        key={item.label}
        className="flex flex-col items-center gap-1 text-neutral-600 active:scale-95 transition-transform"
      >
        {/* Icon */}
        <div className="w-6 h-6">
          {/* Lucide icon */}
        </div>
        <span className="text-xs">{item.label}</span>
      </button>
    ))}
  </div>
</nav>
```

---

## 🛍️ MODERN MARKETPLACE FEED

### Instagram-style Feed Card
```tsx
<div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
  {/* User Header */}
  <div className="flex items-center justify-between p-4">
    <div className="flex items-center gap-3">
      <div className="relative">
        <img src="/user-avatar.jpg" className="w-12 h-12 rounded-full object-cover" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-forest-500 rounded-full border-2 border-white"></div>
      </div>
      <div>
        <p className="font-semibold text-sm">Juan Dela Cruz</p>
        <p className="text-xs text-neutral-500">Iba, Zambales • 2h ago</p>
      </div>
    </div>
    <button className="text-neutral-400 hover:text-neutral-600">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </button>
  </div>
  
  {/* Image Gallery with Modern Grid */}
  <div className="relative aspect-square bg-neutral-100">
    {images.length === 1 ? (
      <img src={images[0]} className="w-full h-full object-cover" />
    ) : (
      <div className="grid grid-cols-2 gap-1 h-full">
        {images.slice(0, 4).map((img, i) => (
          <div key={i} className="relative">
            <img src={img} className="w-full h-full object-cover" />
            {i === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center text-white text-2xl font-bold">
                +{images.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
    
    {/* Transaction Badge */}
    <div className="absolute top-4 left-4">
      <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-semibold text-ocean-700 shadow-lg">
        🤝 For Lending
      </span>
    </div>
  </div>
  
  {/* Actions */}
  <div className="p-4 space-y-3">
    {/* Interaction Buttons */}
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 text-neutral-700 hover:text-red-500 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="text-sm font-medium">24</span>
      </button>
      
      <button className="flex items-center gap-2 text-neutral-700 hover:text-ocean-500 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-sm font-medium">5</span>
      </button>
      
      <button className="ml-auto text-neutral-700 hover:text-ocean-500 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </div>
    
    {/* Content */}
    <div>
      <h3 className="font-bold text-lg mb-1">Portable Generator</h3>
      <p className="text-sm text-neutral-600 line-clamp-2">
        5KW portable generator available for lending. Perfect for events or emergency backup.
      </p>
    </div>
    
    {/* CTA Button */}
    <button className="w-full py-3 bg-ocean-gradient text-white rounded-xl font-semibold hover:scale-[1.02] transition-transform">
      Request to Borrow
    </button>
  </div>
</div>
```

---

## 📱 MODERN FORM DESIGNS

### Multi-step Form with Progress
```tsx
<div className="max-w-3xl mx-auto">
  {/* Progress Bar */}
  <div className="mb-8">
    <div className="flex items-center justify-between mb-2">
      {['Details', 'Documents', 'Review'].map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
            i <= currentStep 
              ? 'bg-ocean-gradient text-white shadow-lg scale-110' 
              : 'bg-neutral-200 text-neutral-500'
          }`}>
            {i < currentStep ? '✓' : i + 1}
          </div>
          {i < 2 && (
            <div className={`w-20 h-1 mx-2 transition-all duration-300 ${
              i < currentStep ? 'bg-ocean-500' : 'bg-neutral-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-neutral-700">Step {currentStep + 1} of 3</p>
    </div>
  </div>
  
  {/* Form Content */}
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
    {/* Animated form fields */}
  </div>
</div>
```

### Modern Input Fields
```tsx
{/* Floating Label Input */}
<div className="relative">
  <input
    type="text"
    id="name"
    className="peer w-full px-4 pt-6 pb-2 border-2 border-neutral-200 rounded-xl focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10 transition-all outline-none"
    placeholder=" "
  />
  <label
    htmlFor="name"
    className="absolute left-4 top-2 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-ocean-600"
  >
    Full Name
  </label>
</div>

{/* File Upload with Preview */}
<div className="relative group">
  <input
    type="file"
    id="file"
    className="hidden"
    onChange={handleFileChange}
  />
  <label
    htmlFor="file"
    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-300 rounded-2xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors group-hover:border-ocean-500"
  >
    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <svg className="w-12 h-12 mb-3 text-neutral-400 group-hover:text-ocean-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p className="mb-2 text-sm text-neutral-500">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-neutral-400">PDF, PNG, JPG (MAX. 10MB)</p>
    </div>
  </label>
</div>
```

---

## 🎭 ADVANCED UI PATTERNS

### Animated Statistics Dashboard
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {stats.map((stat, i) => (
    <div
      key={i}
      className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 hover:scale-105 transition-all duration-300"
      style={{ animationDelay: `${i * 100}ms` }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon */}
      <div className="relative mb-4 w-12 h-12 bg-ocean-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
        {stat.icon}
      </div>
      
      {/* Number Counter */}
      <div className="relative">
        <p className="text-4xl font-bold text-neutral-900 mb-1">
          <CountUp end={stat.value} duration={2} separator="," />
        </p>
        <p className="text-sm text-neutral-600">{stat.label}</p>
        
        {/* Trend Indicator */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-forest-600 text-sm font-medium">↑ {stat.trend}%</span>
          <span className="text-xs text-neutral-500">vs last month</span>
        </div>
      </div>
    </div>
  ))}
</div>
```

### Infinite Scroll Feed with Skeleton Loading
```tsx
<div className="space-y-6">
  {items.map((item, i) => (
    <div
      key={item.id}
      className="opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${i * 50}ms` }}
    >
      <MarketplaceCard item={item} />
    </div>
  ))}
  
  {/* Loading Skeleton */}
  {isLoading && (
    <>
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg">
          {/* Header Skeleton */}
          <div className="flex items-center gap-3 p-4">
            <div className="w-12 h-12 bg-neutral-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-3 bg-neutral-200 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
          
          {/* Image Skeleton */}
          <div className="aspect-square bg-neutral-200 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded w-2/3 animate-pulse"></div>
            </div>
            <div className="h-12 bg-neutral-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      ))}
    </>
  )}
</div>
```

---

## 🌟 INTERACTIVE COMPONENTS

### Toast Notifications (Modern Style)
```tsx
// Toast Component with Auto-dismiss
const Toast = ({ type, message, onClose }) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  const colors = {
    success: 'from-forest-500 to-forest-600',
    error: 'from-red-500 to-red-600',
    warning: 'from-sunset-500 to-sunset-600',
    info: 'from-ocean-500 to-ocean-600'
  };
  
  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
      <div className={`flex items-center gap-3 bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl`}>
        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
          {icons[type]}
        </div>
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 hover:bg-white/20 p-1 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Animation
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Modal/Dialog (Glassmorphic)
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
  {/* Backdrop */}
  <div 
    className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
    onClick={onClose}
  ></div>
  
  {/* Modal Content */}
  <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
    {/* Header with Gradient */}
    <div className="relative bg-ocean-gradient text-white px-8 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Modal Title</h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
      {/* Modal content here */}
    </div>
    
    {/* Footer */}
    <div className="flex items-center justify-end gap-3 px-8 py-6 bg-neutral-50 border-t border-neutral-200">
      <button 
        onClick={onClose}
        className="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl font-medium transition-colors"
      >
        Cancel
      </button>
      <button className="px-6 py-3 bg-ocean-gradient text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg">
        Confirm
      </button>
    </div>
  </div>
</div>

{/* Animations */}
<style jsx>{`
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .animate-fade-in { animation: fade-in 0.2s ease-out; }
  .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
`}</style>
```

### Search Bar with Live Results
```tsx
<div className="relative w-full max-w-2xl">
  {/* Search Input */}
  <div className="relative">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search marketplace, documents, announcements..."
      className="w-full pl-14 pr-4 py-4 bg-white/70 backdrop-blur-xl rounded-2xl border-2 border-neutral-200 focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10 transition-all outline-none text-lg"
    />
    
    {/* Search Icon */}
    <div className="absolute left-5 top-1/2 -translate-y-1/2">
      <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    
    {/* Clear Button */}
    {searchQuery && (
      <button
        onClick={() => setSearchQuery('')}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded-full flex items-center justify-center transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
  
  {/* Search Results Dropdown */}
  {searchQuery && (
    <div className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden animate-slide-down">
      {/* Quick Filters */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200">
        <span className="text-sm text-neutral-600">Filter:</span>
        {['All', 'Marketplace', 'Documents', 'Announcements'].map(filter => (
          <button
            key={filter}
            className="px-3 py-1 text-sm font-medium rounded-full bg-neutral-100 hover:bg-ocean-100 hover:text-ocean-700 transition-colors"
          >
            {filter}
          </button>
        ))}
      </div>
      
      {/* Results */}
      <div className="max-h-96 overflow-y-auto">
        {results.map((result, i) => (
          <a
            key={i}
            href={result.url}
            className="flex items-center gap-4 px-4 py-3 hover:bg-ocean-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
              {result.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 truncate">{result.title}</p>
              <p className="text-sm text-neutral-600 truncate">{result.subtitle}</p>
            </div>
            <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>
      
      {/* View All */}
      <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200">
        <button className="w-full py-2 text-sm font-medium text-ocean-600 hover:text-ocean-700">
          View all {results.length} results →
        </button>
      </div>
    </div>
  )}
</div>

<style jsx>{`
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slide-down { animation: slide-down 0.2s ease-out; }
`}</style>
```

---

## 📊 DATA VISUALIZATION

### Modern Chart Card
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="text-2xl font-bold text-neutral-900">Marketplace Activity</h3>
      <p className="text-sm text-neutral-600">Daily transactions over the last 30 days</p>
    </div>
    
    {/* Time Filter */}
    <div className="flex gap-2">
      {['7D', '30D', '90D', '1Y'].map(period => (
        <button
          key={period}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            selectedPeriod === period
              ? 'bg-ocean-gradient text-white shadow-lg'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  </div>
  
  {/* Chart */}
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line
          type="monotone"
          dataKey="transactions"
          stroke="#0ea5e9"
          strokeWidth={3}
          dot={{ fill: '#0ea5e9', r: 5 }}
          activeDot={{ r: 7, fill: '#0369a1' }}
          fill="url(#colorGradient)"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
```

---

## 🎪 SPECIAL EFFECTS

### Particle Background Effect
```tsx
// Add to hero section for dynamic background
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div className="particles-container">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${15 + Math.random() * 10}s`
        }}
      ></div>
    ))}
  </div>
</div>

<style jsx>{`
  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: float-particle infinite ease-in-out;
  }
  
  @keyframes float-particle {
    0%, 100% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) translateX(50px);
      opacity: 0;
    }
  }
`}</style>
```

### Cursor Trail Effect
```tsx
// Custom cursor for interactive areas
const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
const [isHovering, setIsHovering] = useState(false);

useEffect(() => {
  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };
  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);

<div className="custom-cursor-container">
  {/* Custom Cursor */}
  <div
    className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
    style={{
      left: `${cursorPosition.x}px`,
      top: `${cursorPosition.y}px`
    }}
  ></div>
</div>

<style jsx>{`
  .custom-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid #0ea5e9;
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s, border-color 0.3s;
    z-index: 9999;
  }
  
  .custom-cursor.hovering {
    width: 40px;
    height: 40px;
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
  }
`}</style>
```

---

## 📱 MOBILE-FIRST RESPONSIVE PATTERNS

### Responsive Grid System
```tsx
{/* Auto-responsive Grid - No media queries needed */}
<div className="grid gap-6" style={{
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))'
}}>
  {items.map(item => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>

{/* Responsive Padding/Spacing */}
<div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
  {/* Content scales with screen size */}
</div>

{/* Responsive Typography */}
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
  Responsive Heading
</h1>
```

### Mobile Drawer Menu
```tsx
<div className={`fixed inset-y-0 left-0 w-80 bg-white/90 backdrop-blur-2xl shadow-2xl transform transition-transform duration-300 z-50 ${
  isOpen ? 'translate-x-0' : '-translate-x-full'
}`}>
  {/* Header */}
  <div className="flex items-center justify-between p-6 border-b border-neutral-200">
    <div className="flex items-center gap-3">
      <img src="/Zambales Logo/64px-Seal_of_Province_of_Zambales.svg.png" className="w-10 h-10" />
      <span className="font-bold text-lg">MunicipLink</span>
    </div>
    <button onClick={() => setIsOpen(false)} className="w-10 h-10 bg-neutral-100 hover:bg-neutral-200 rounded-xl flex items-center justify-center transition-colors">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
  
  {/* Navigation */}
  <nav className="p-6 space-y-2">
    {menuItems.map((item, i) => (
      <a
        key={i}
        href={item.url}
        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-ocean-50 transition-colors group"
      >
        <div className="w-10 h-10 bg-ocean-100 rounded-xl flex items-center justify-center group-hover:bg-ocean-gradient group-hover:text-white transition-colors">
          {item.icon}
        </div>
        <span className="font-medium text-neutral-700 group-hover:text-ocean-600">{item.label}</span>
      </a>
    ))}
  </nav>
</div>

{/* Backdrop */}
{isOpen && (
  <div 
    className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-40 animate-fade-in"
    onClick={() => setIsOpen(false)}
  ></div>
)}
```

---

## 🎬 PAGE TRANSITIONS

### Route Transition Animations
```tsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={router.pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {/* Page content */}
  </motion.div>
</AnimatePresence>
```

### Stagger Children Animation
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <ItemCard item={item} />
    </motion.div>
  ))}
</motion.div>
```

---

## 🎨 ACCESSIBILITY & UX

### Focus States
```css
/* Modern Focus Rings */
.focus-modern:focus {
  outline: none;
  ring: 4px;
  ring-color: rgba(14, 165, 233, 0.2);
  ring-offset: 2px;
  border-color: #0ea5e9;
}

/* Skip to Content Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0ea5e9;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 8px 0;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Dark Mode Support
```tsx
// Automatic dark mode based on system preference
<div className="dark:bg-neutral-900 dark:text-white">
  <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6">
    {/* Content adapts to dark mode */}
  </div>
</div>

// Custom dark mode toggle
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

---

## 🚀 PERFORMANCE OPTIMIZATIONS

### Image Optimization
```tsx
// Lazy loading with blur placeholder
<img
  src={item.image}
  alt={item.title}
  loading="lazy"
  className="w-full h-full object-cover blur-sm transition-all duration-300"
  onLoad={(e) => e.target.classList.remove('blur-sm')}
/>

// Progressive image loading
<div className="relative aspect-square bg-neutral-200">
  <img
    src={item.thumbnailLow}
    alt={item.title}
    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
  />
  <img
    src={item.thumbnailHigh}
    alt={item.title}
    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
    onLoad={(e) => e.target.style.opacity = 1}
    style={{ opacity: 0 }}
  />
</div>
```

---

## 📦 COMPLETE COMPONENT LIBRARY STRUCTURE

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx           # Modern button variants
│   │   ├── Card.tsx             # Glass/neumorphic cards
│   │   ├── Input.tsx            # Floating label inputs
│   │   ├── Modal.tsx            # Glassmorphic modals
│   │   ├── Toast.tsx            # Notification system
│   │   └── Dropdown.tsx         # Animated dropdowns
│   ├── layout/
│   │   ├── Header.tsx           # Floating navigation
│   │   ├── Footer.tsx           # Modern footer
│   │   ├── Sidebar.tsx          # Mobile drawer
│   │   └── Container.tsx        # Responsive containers
│   ├── marketplace/
│   │   ├── FeedCard.tsx         # Instagram-style cards
│   │   ├── ItemForm.tsx         # Multi-step form
│   │   └── SearchBar.tsx        # Live search
│   └── effects/
│       ├── ParticleBackground.tsx
│       ├── CursorTrail.tsx
│       └── PageTransition.tsx
├── styles/
│   ├── globals.css              # Global styles & animations
│   └── tailwind.config.js       # Custom Tailwind config
└── utils/
    ├── animations.ts            # Reusable animation variants
    └── constants.ts             # Design tokens
```

---

## 🎯 IMPLEMENTATION CHECKLIST

### Phase 1: Foundation
- [ ] Set up Tailwind with custom config
- [ ] Create design token system
- [ ] Build base UI components
- [ ] Implement responsive grid system

### Phase 2: Core Features
- [ ] Modern hero section with parallax
- [ ] Glassmorphic navigation
- [ ] Marketplace feed layout
- [ ] Form components with validation

### Phase 3: Enhancements
- [ ] Add micro-interactions
- [ ] Implement loading states
- [ ] Create notification system
- [ ] Add page transitions

### Phase 4: Polish
- [ ] Optimize images
- [ ] Add accessibility features
- [ ] Implement dark mode
- [ ] Performance testing

---

## 💎 KEY DESIGN PRINCIPLES

1. **Always Animated**: Every interaction should have smooth transitions
2. **Depth & Layers**: Use glassmorphism, shadows, and gradients for depth
3. **Responsive First**: Mobile experience is as important as desktop
4. **Performance Matters**: Beautiful but fast - optimize everything
5. **Accessible**: Keyboard navigation, screen readers, high contrast
6. **Consistent**: Use design tokens for colors, spacing, typography
7. **Modern**: Stay current with web design trends
8. **Purposeful**: Every animation and effect serves the UX

---

This modern design system transforms MunicipLink Zambales into a cutting-edge, interactive platform that rivals top consumer apps while maintaining government credibility and local cultural identity.

---

## 🎨 COMPLETE PAGE TEMPLATES

### 1. Homepage - Full Modern Layout
```tsx
export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white">
      {/* Floating Navigation */}
      <FloatingNav />
      
      {/* Hero Section with Parallax */}
      <ParallaxHero />
      
      {/* Quick Stats Section */}
      <section className="py-16 -mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '👥', label: 'Active Users', value: '12,450', trend: '+12.5' },
              { icon: '🛍️', label: 'Items Listed', value: '3,289', trend: '+8.3' },
              { icon: '📄', label: 'Documents Issued', value: '5,678', trend: '+15.2' },
              { icon: '🏘️', label: 'Municipalities', value: '13', trend: '0' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50 hover:scale-105 transition-transform cursor-pointer group"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                <p className="text-sm text-neutral-600 mb-2">{stat.label}</p>
                {stat.trend !== '0' && (
                  <div className="flex items-center gap-1">
                    <span className="text-forest-600 text-sm font-medium">↑ {stat.trend}%</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Sections - Bento Grid */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[300px]">
          {/* Latest Announcements - Large */}
          <div className="md:col-span-4 md:row-span-2 bg-ocean-gradient rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Latest Announcements</h2>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors">
                  View All →
                </button>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 hover:bg-white/20 transition-all cursor-pointer">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">Community Health Initiative</h3>
                        <p className="text-sm text-ocean-100 line-clamp-2">
                          Free health screening available at all municipal health centers this week
                        </p>
                        <p className="text-xs text-ocean-200 mt-2">2 hours ago • Iba</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="md:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {['Request Document', 'List Item', 'Report Issue'].map(action => (
                  <button key={action} className="w-full px-4 py-3 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 rounded-xl font-medium transition-colors text-left">
                    {action} →
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Municipality Selector */}
          <div className="md:col-span-2 bg-forest-gradient rounded-3xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Your Municipality</h3>
            <select className="w-full px-4 py-3 bg-white/20 backdrop-blur-md rounded-xl text-white font-medium border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50">
              <option>Select Municipality</option>
              <option>Iba</option>
              <option>Olongapo City</option>
              <option>Subic</option>
            </select>
          </div>
          
          {/* Featured Marketplace */}
          <div className="md:col-span-3 bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Featured Items</h3>
              <button className="text-ocean-600 hover:text-ocean-700 font-medium text-sm">
                See More →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map(i => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-square bg-neutral-200 rounded-xl mb-2 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-ocean-200 to-forest-200 group-hover:scale-110 transition-transform duration-300"></div>
                  </div>
                  <p className="font-medium text-sm truncate">Item Name</p>
                  <p className="text-xs text-neutral-600">For Lending</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Events Calendar */}
          <div className="md:col-span-3 bg-sunset-gradient rounded-3xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {[
                { date: 'OCT 15', event: 'Municipal Cleanup Drive' },
                { date: 'OCT 20', event: 'Business Permits Renewal' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-xl p-3">
                  <div className="w-12 h-12 bg-white/30 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <p className="text-xs font-medium">{item.date.split(' ')[0]}</p>
                    <p className="text-lg font-bold">{item.date.split(' ')[1]}</p>
                  </div>
                  <p className="font-medium text-sm">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials/Community Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Community Stories</h2>
            <p className="text-lg text-neutral-600">Real experiences from our residents</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-ocean-200 rounded-full"></div>
                  <div>
                    <p className="font-bold">Maria Santos</p>
                    <p className="text-sm text-neutral-600">Subic Resident</p>
                  </div>
                </div>
                <p className="text-neutral-700 mb-4">
                  "MunicipLink made it so easy to request my barangay clearance. I got it in just 2 days!"
                </p>
                <div className="flex text-sunset-500">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <ModernFooter />
    </div>
  );
}
```

### 2. Marketplace Feed Page
```tsx
export default function MarketplacePage() {
  const [filter, setFilter] = useState('all');
  const [municipality, setMunicipality] = useState('all');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <FloatingNav />
      
      {/* Page Header */}
      <div className="pt-32 pb-8 bg-ocean-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold mb-4">Marketplace</h1>
          <p className="text-xl text-ocean-100 max-w-2xl">
            Share, trade, and connect with your community. Buy, sell, lend, or donate items locally.
          </p>
        </div>
      </div>
      
      {/* Filters Bar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Transaction Type Filter */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All Items', icon: '🏪' },
                { value: 'sell', label: 'For Sale', icon: '💰' },
                { value: 'lend', label: 'For Lending', icon: '🤝' },
                { value: 'donate', label: 'Free/Donate', icon: '🎁' }
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => setFilter(type.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filter === type.value
                      ? 'bg-ocean-gradient text-white shadow-lg scale-105'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
            
            {/* Municipality Filter */}
            <select
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              className="px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl font-medium focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10 outline-none"
            >
              <option value="all">All Municipalities</option>
              <option value="iba">Iba</option>
              <option value="olongapo">Olongapo City</option>
              <option value="subic">Subic</option>
            </select>
            
            {/* Post Button */}
            <button className="ml-auto px-6 py-2 bg-forest-gradient text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg">
              + Post Item
            </button>
          </div>
        </div>
      </div>
      
      {/* Feed Layout - Two Column */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3, 4, 5].map(i => (
              <InstagramStyleCard key={i} />
            ))}
            
            {/* Load More */}
            <div className="text-center py-8">
              <button className="px-8 py-4 bg-white/70 backdrop-blur-xl border-2 border-ocean-200 hover:border-ocean-500 text-ocean-600 rounded-2xl font-medium transition-all hover:scale-105">
                Load More Items
              </button>
            </div>
          </div>
          
          {/* Sidebar - Trending & Categories */}
          <div className="space-y-6">
            {/* Trending Items */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50 sticky top-36">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🔥 Trending Now
              </h3>
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-ocean-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-neutral-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">Item Name</p>
                      <p className="text-xs text-neutral-600">Category</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Categories */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '🏠', label: 'Home' },
                  { icon: '⚡', label: 'Electronics' },
                  { icon: '👔', label: 'Clothing' },
                  { icon: '🎮', label: 'Toys' },
                  { icon: '📚', label: 'Books' },
                  { icon: '🔧', label: 'Tools' }
                ].map(cat => (
                  <button key={cat.label} className="px-3 py-2 bg-neutral-50 hover:bg-ocean-50 rounded-xl text-sm font-medium transition-colors">
                    <span className="mr-1">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Document Request Portal
```tsx
export default function DocumentRequestPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-forest-50">
      <FloatingNav />
      
      {/* Header */}
      <div className="pt-32 pb-16 text-center">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-ocean-gradient rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl">
              📄
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-ocean-600 to-forest-600">
            Document Request Portal
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Request official documents online. Digital copies available with secure QR verification.
          </p>
        </div>
      </div>
      
      {/* Form Container */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[
                { num: 1, label: 'Document Type' },
                { num: 2, label: 'Personal Info' },
                { num: 3, label: 'Requirements' },
                { num: 4, label: 'Review & Submit' }
              ].map((s, i) => (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      step >= s.num
                        ? 'bg-ocean-gradient text-white shadow-lg scale-110'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}>
                      {step > s.num ? '✓' : s.num}
                    </div>
                    <p className={`text-sm mt-2 font-medium ${
                      step >= s.num ? 'text-ocean-600' : 'text-neutral-500'
                    }`}>
                      {s.label}
                    </p>
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                      step > s.num ? 'bg-ocean-500' : 'bg-neutral-200'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Form Content */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Step 1: Document Type */}
            {step === 1 && (
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">Select Document Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Barangay Clearance', desc: 'For employment, travel, or business', icon: '📋', fee: '₱50' },
                    { title: 'Certificate of Residency', desc: 'Proof of residence', icon: '🏠', fee: '₱30' },
                    { title: 'Certificate of Indigency', desc: 'For medical or educational aid', icon: '💙', fee: 'Free' },
                    { title: 'Business Permit', desc: 'New or renewal', icon: '🏪', fee: '₱200' },
                    { title: 'Cedula', desc: 'Community tax certificate', icon: '🎫', fee: '₱30' },
                    { title: 'Building Permit', desc: 'Construction authorization', icon: '🏗️', fee: '₱500' }
                  ].map(doc => (
                    <button
                      key={doc.title}
                      className="group text-left p-6 bg-neutral-50 hover:bg-ocean-50 border-2 border-transparent hover:border-ocean-500 rounded-2xl transition-all hover:scale-105"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{doc.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 group-hover:text-ocean-600 transition-colors">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-neutral-600 mb-2">{doc.desc}</p>
                          <span className="inline-block px-3 py-1 bg-forest-100 text-forest-700 text-xs font-medium rounded-full">
                            Fee: {doc.fee}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 2: Personal Information */}
            {step === 2 && (
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        className="peer w-full px-4 pt-6 pb-2 border-2 border-neutral-200 rounded-xl focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10 transition-all outline-none"
                        placeholder=" "
                      />
                      <label className="absolute left-4 top-2 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-ocean-600">
                        First Name
                      </label>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        className="peer w-full px-4 pt-6 pb-2 border-2 border-neutral-200 rounded-xl focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10 transition-all outline-none"
                        placeholder=" "
                      />
                      <label className="absolute left-4 top-2 text-xs text-neutral-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-ocean-600">
                        Last Name
                      </label>
                    </div>
                  </div>
                  
                  {/* More fields... */}
                  
                  <div className="relative">
                    <textarea
                      rows={4}
                      className="peer w-full px-4 pt-6 pb-2 border-2 border-neutral-200 rounded-xl focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10 transition-all outline-none resize-none"
                      placeholder=" "
                    ></textarea>
                    <label className="absolute left-4 top-2 text-xs text-neutral-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-ocean-600">
                      Complete Address
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between px-8 py-6 bg-neutral-50 border-t border-neutral-200">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl font-medium transition-colors"
                >
                  ← Previous
                </button>
              )}
              <button
                onClick={() => setStep(step + 1)}
                className={`px-8 py-3 bg-ocean-gradient text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg ${
                  step === 1 ? 'ml-auto' : ''
                }`}
              >
                {step === totalSteps ? 'Submit Request' : 'Continue →'}
              </button>
            </div>
          </div>
          
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: '⚡', title: 'Fast Processing', desc: 'Get digital copy in 24-48 hours' },
              { icon: '🔒', title: 'Secure & Verified', desc: 'QR code authentication' },
              { icon: '📱', title: 'Track Status', desc: 'Real-time updates via SMS/Email' }
            ].map(info => (
              <div key={info.title} className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/50">
                <div className="text-4xl mb-3">{info.icon}</div>
                <h3 className="font-bold mb-2">{info.title}</h3>
                <p className="text-sm text-neutral-600">{info.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Municipality Directory Page
```tsx
export default function MunicipalityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-white">
      <FloatingNav />
      
      {/* Hero */}
      <div className="pt-32 pb-16 bg-forest-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/Nature.jpg" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">13 Municipalities of Zambales</h1>
          <p className="text-xl text-forest-100 max-w-2xl mx-auto">
            Discover local services, announcements, and connect with your community
          </p>
        </div>
      </div>
      
      {/* Interactive Map Placeholder */}
      <div className="container mx-auto px-4 -mt-12 relative z-10 mb-16">
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <div className="aspect-video bg-gradient-to-br from-ocean-100 to-forest-100 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-700 mb-2">🗺️ Interactive Map</p>
              <p className="text-neutral-600">Click on a municipality to explore</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Municipality Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            'Iba', 'Botolan', 'Cabangan', 'Candelaria', 'Castillejos',
            'Masinloc', 'Olongapo City', 'Palauig', 'San Antonio',
            'San Felipe', 'San Marcelino', 'San Narciso', 'Santa Cruz', 'Subic'
          ].map((municipality, i) => (
            <div
              key={municipality}
              className="group bg-white hover:bg-ocean-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              {/* Municipal Seal */}
              <div className="relative h-48 bg-gradient-to-br from-ocean-100 to-forest-100 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                  {/* Seal would go here */}
                  <span className="text-4xl">🏛️</span>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-ocean-gradient opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white font-bold text-xl">Explore →</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-ocean-600 transition-colors">
                  {municipality}
                </h3>
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>Population: {Math.floor(Math.random() * 50000 + 10000).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📢</span>
                    <span>{Math.floor(Math.random() * 20 + 5)} Active Announcements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🛍️</span>
                    <span>{Math.floor(Math.random() * 100 + 20)} Marketplace Items</span>
                  </div>
                </div>
                
                <button className="mt-4 w-full py-2 bg-ocean-100 group-hover:bg-ocean-gradient text-ocean-700 group-hover:text-white rounded-xl font-medium transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 5. User Profile/Dashboard
```tsx
export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-ocean-50">
      <FloatingNav />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 sticky top-24">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-ocean-gradient rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    JD
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-forest-500 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1">Juan Dela Cruz</h2>
                <p className="text-sm text-neutral-600">Iba, Zambales</p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-ocean-100 text-ocean-700 rounded-full text-xs font-medium">
                  <span>⭐</span> Verified Resident
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-sm text-neutral-600">Items Posted</span>
                  <span className="font-bold text-ocean-600">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-sm text-neutral-600">Transactions</span>
                  <span className="font-bold text-forest-600">8</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="text-sm text-neutral-600">Documents</span>
                  <span className="font-bold text-sunset-600">5</span>
                </div>
              </div>
              
              {/* Menu */}
              <nav className="space-y-2">
                {[
                  { icon: '👤', label: 'Profile', active: true },
                  { icon: '📄', label: 'My Documents' },
                  { icon: '🛍️', label: 'My Listings' },
                  { icon: '💬', label: 'Messages' },
                  { icon: '⚙️', label: 'Settings' }
                ].map(item => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      item.active
                        ? 'bg-ocean-gradient text-white shadow-lg'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Banner */}
            <div className="bg-ocean-gradient text-white rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Welcome back, Juan! 👋</h1>
                <p className="text-ocean-100 mb-4">Here's what's happening in your community today</p>
                <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-medium transition-colors">
                  + Post New Item
                </button>
              </div>
            </div>
            
            {/* Activity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '📬', label: 'Pending Requests', count: 3, color: 'ocean' },
                { icon: '✅', label: 'Completed', count: 12, color: 'forest' },
                { icon: '⏳', label: 'In Progress', count: 2, color: 'sunset' }
              ].map(stat => (
                <div
                  key={stat.label}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50 hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <p className="text-3xl font-bold text-neutral-900 mb-1">{stat.count}</p>
                  <p className="text-sm text-neutral-600">{stat.label}</p>
                </div>
              ))}
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-2xl font-bold">Recent Activity</h2>
              </div>
              
              <div className="divide-y divide-neutral-200">
                {[
                  { type: 'document', title: 'Barangay Clearance', status: 'Ready for pickup', time: '2 hours ago', icon: '📄', color: 'forest' },
                  { type: 'marketplace', title: 'Someone inquired about your Laptop', status: 'New message', time: '5 hours ago', icon: '💬', color: 'ocean' },
                  { type: 'document', title: 'Business Permit', status: 'Under review', time: '1 day ago', icon: '📋', color: 'sunset' },
                  { type: 'marketplace', title: 'Your item "Bicycle" was marked as lent', status: 'Transaction completed', time: '2 days ago', icon: '✅', color: 'forest' }
                ].map((activity, i) => (
                  <div key={i} className="p-6 hover:bg-neutral-50 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${activity.color}-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-neutral-900 mb-1">{activity.title}</h3>
                        <p className="text-sm text-neutral-600 mb-2">{activity.status}</p>
                        <p className="text-xs text-neutral-500">{activity.time}</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-ocean-100 text-ocean-700 rounded-lg text-sm font-medium transition-opacity">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-neutral-50 text-center">
                <button className="text-ocean-600 hover:text-ocean-700 font-medium">
                  View All Activity →
                </button>
              </div>
            </div>
            
            {/* My Listings */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Listings</h2>
                <button className="px-4 py-2 bg-ocean-100 text-ocean-700 rounded-xl font-medium hover:bg-ocean-200 transition-colors">
                  + Add New
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="group bg-neutral-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                      <div className="aspect-video bg-gradient-to-br from-ocean-200 to-forest-200"></div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold">Item Name</h3>
                          <span className="px-2 py-1 bg-forest-100 text-forest-700 text-xs rounded-full">Active</span>
                        </div>
                        <p className="text-sm text-neutral-600 mb-3">For Lending • 24 views</p>
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-ocean-100 text-ocean-700 rounded-lg text-sm font-medium hover:bg-ocean-200 transition-colors">
                            Edit
                          </button>
                          <button className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-300 transition-colors">
                            •••
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 REUSABLE COMPONENT LIBRARY

### Modern Button Component
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  children,
  onClick
}) => {
  const variants = {
    primary: 'bg-ocean-gradient text-white shadow-lg hover:scale-105',
    secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
    ghost: 'bg-transparent text-ocean-600 hover:bg-ocean-50',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:scale-105'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-medium transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2 justify-center
      `}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
```

### Card Component
```tsx
interface CardProps {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  children,
  className = ''
}) => {
  const variants = {
    default: 'bg-white shadow-lg',
    glass: 'bg-white/70 backdrop-blur-xl shadow-xl border border-white/50',
    gradient: 'bg-ocean-gradient text-white shadow-2xl',
    elevated: 'bg-white shadow-2xl hover:shadow-3xl'
  };
  
  return (
    <div
      className={`
        ${variants[variant]}
        rounded-3xl
        ${hover ? 'hover:scale-105 transition-transform duration-300 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
```

### Modal Component
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative bg-ocean-gradient text-white px-8 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="px-8 py-6 bg-neutral-50 border-t border-neutral-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
```

### Input Component
```tsx
interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  error,
  icon,
  value,
  onChange
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          {icon}
        </div>
      )}
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`
          peer w-full px-4 pt-6 pb-2
          ${icon ? 'pl-12' : ''}
          border-2 rounded-xl
          transition-all outline-none
          ${error 
            ? 'border-red-500 focus:ring-red-500/10' 
            : 'border-neutral-200 focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10'
          }
        `}
      />
      
      <label className={`
        absolute ${icon ? 'left-12' : 'left-4'} top-2
        text-xs transition-all
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
        peer-focus:top-2 peer-focus:text-xs
        ${error ? 'text-red-500' : 'text-neutral-500 peer-focus:text-ocean-600'}
      `}>
        {label}
      </label>
      
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};
```

---

## 🎬 ANIMATION UTILITIES

### Tailwind Animation Extensions
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    }
  }
}
```

### React Animation Hooks
```tsx
// useScrollAnimation.ts
import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return { ref, isVisible };
};

// Usage:
const MyComponent = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      Content appears on scroll!
    </div>
  );
};
```

---

## 🎯 IMPLEMENTATION PRIORITY

### Week 1: Foundation
- [ ] Setup Tailwind with extended config
- [ ] Create base component library (Button, Card, Input, Modal)
- [ ] Build floating navigation
- [ ] Implement responsive grid system

### Week 2: Core Pages
- [ ] Modern homepage with hero
- [ ] Marketplace feed page
- [ ] Document request portal
- [ ] Municipality directory

### Week 3: User Features
- [ ] User dashboard
- [ ] Profile management
- [ ] Item listing forms
- [ ] Document tracking

### Week 4: Polish & Optimization
- [ ] Add all micro-interactions
- [ ] Implement loading states
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Accessibility audit

---

## 📱 MOBILE APP CONSIDERATIONS

### Progressive Web App (PWA) Features
```json
// manifest.json
{
  "name": "MunicipLink Zambales",
  "short_name": "MunicipLink",
  "description": "Your Digital Bridge to Community Services",
  "theme_color": "#0ea5e9",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Native-like Interactions
- Pull-to-refresh on mobile
- Swipe gestures for navigation
- Bottom sheet modals
- Native-feeling transitions
- Haptic feedback (vibration API)
- Offline support with service workers

---

## 🚀 PERFORMANCE OPTIMIZATION CHECKLIST

- [ ] Image lazy loading with blur placeholders
- [ ] Code splitting by route
- [ ] Dynamic imports for heavy components
- [ ] Minimize bundle size (tree shaking)
- [ ] Use React.memo for expensive components
- [ ] Implement virtual scrolling for long lists
- [ ] Optimize animations (use transform/opacity)
- [ ] Compress images (WebP format)
- [ ] Enable GZIP/Brotli compression
- [ ] Use CDN for static assets
- [ ] Implement caching strategies
- [ ] Reduce initial JavaScript payload

---

**This modern design system creates a premium, interactive experience that positions MunicipLink Zambales as a forward-thinking, tech-enabled government platform while maintaining cultural authenticity and community trust.**