// MOTION SYSTEM IMPLEMENTATION GUIDE
// =================================
// This file demonstrates exact usage of the Wearix-style motion system
// for your Next.js ecommerce site.

// ============================================================================
// 1. PRODUCT CARD WITH STAGGER + HOVER
// ============================================================================
// File: src/components/ProductCard.tsx (DONE ✓)

import { motion } from "framer-motion";
import { hoverVariants, itemVariants } from "@/lib/motion";

export default function ProductCard({ product }) {
  return (
    <motion.div variants={itemVariants}>
      <Link href={`/shop/${product.slug}`}>
        <motion.div
          className="relative aspect-[3/4] overflow-hidden"
          initial="initial"
          whileHover="hover"
          variants={hoverVariants}
        >
          <Image src={product.images?.[0]} />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// 2. PRODUCT GRID WITH STAGGERED REVEAL
// ============================================================================
// File: src/components/ProductGrid.tsx (DONE ✓)

import { motion } from "framer-motion";
import { containerVariants } from "@/lib/motion";

export default function ProductGrid({ products }) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      variants={containerVariants}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </motion.div>
  );
}

// ============================================================================
// 3. SECTION REVEAL ON SCROLL
// ============================================================================
// Usage: Use the AnimatedSection wrapper component for any section
// File: src/components/AnimatedSection.tsx (DONE ✓)

import { AnimatedSection, AnimatedItem } from "@/components/AnimatedSection";

export function MyPage() {
  return (
    <>
      {/* Featured section with staggered children */}
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 py-16">
        <AnimatedItem className="mb-8">
          <h2>Featured Products</h2>
        </AnimatedItem>
        <ProductGrid products={products} />
      </AnimatedSection>

      {/* Another section */}
      <AnimatedSection className="mx-auto w-full max-w-7xl px-4 py-16">
        <AnimatedItem className="mb-8">
          <h2>New Arrivals</h2>
        </AnimatedItem>
        <ProductGrid products={newArrivals} />
      </AnimatedSection>
    </>
  );
}

// ============================================================================
// 4. HEADER MOBILE MENU WITH OVERLAY + SLIDE-IN
// ============================================================================
// File: src/components/Header.tsx (DONE ✓)

import { motion, AnimatePresence } from "framer-motion";
import { overlayVariants, menuVariants } from "@/lib/motion";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header>
      {/* ... header content ... */}

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay fade */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Panel slide-in from right */}
            <motion.div
              className="fixed right-0 top-16 z-40 w-64 border-l border-border bg-background"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Menu content */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

// ============================================================================
// 5. ANNOUNCEMENT TICKER WITH MARQUEE + PAUSE ON HOVER
// ============================================================================
// File: src/components/AnnouncementTicker.tsx (DONE ✓)

export default function AnnouncementTicker({ messages }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="bg-accent text-accent-foreground overflow-hidden">
      <div
        className="mx-auto flex h-10 items-center justify-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Marquee animation - pauses on hover via CSS class */}
        <div className={`flex-1 overflow-hidden ${!hovered ? 'animate-marquee' : ''}`}>
          <div className="whitespace-nowrap">{content}</div>
        </div>
      </div>
    </div>
  );
}

// CSS added to globals.css:
// @keyframes marquee {
//   0% { transform: translateX(0); }
//   100% { transform: translateX(-100%); }
// }
//
// @layer utilities {
//   .animate-marquee {
//     animation: marquee 20s linear infinite;
//   }
//
//   .hover\:animation-pause:hover {
//     animation-play-state: paused;
//   }
// }

// ============================================================================
// 6. TABS WITH ANIMATED UNDERLINE INDICATOR
// ============================================================================
// File: src/components/CollectionTabs.tsx (DONE ✓)

import { motion } from "framer-motion";

export default function CollectionTabs({ tabs, value }) {
  return (
    <div className="flex items-center gap-2">
      {tabs.map((t) => {
        const active = t.value === value;

        return (
          <Link key={t.value} href={href}>
            {/* Tab button */}
            {/* Animated underline with layoutId for smooth morph */}
            {active && (
              <motion.div
                layoutId="tab-underline"
                className="absolute inset-0 rounded-lg border-2 border-accent"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}

// ============================================================================
// 7. PDP GALLERY WITH IMAGE CROSSFADE
// ============================================================================
// File: src/app/(site)/shop/[handle]/page.tsx (Example)

import { motion, AnimatePresence } from "framer-motion";
import { imageVariants } from "@/lib/motion";

export default function ProductDetailPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      {/* Main image with crossfade */}
      <div className="relative aspect-square overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={product.images[selectedIndex]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnail gallery */}
      <div className="flex gap-2 mt-4">
        {product.images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`w-20 h-20 border rounded ${
              idx === selectedIndex ? "border-accent" : "border-border"
            }`}
          >
            <img src={img} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 8. PAGE LOAD ANIMATION
// ============================================================================
// File: src/app/layout.tsx (Wrap pages)

import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={pageVariants}
        >
          {children}
        </motion.div>
      </body>
    </html>
  );
}

// ============================================================================
// AVAILABLE VARIANTS REFERENCE
// ============================================================================
// From: src/lib/motion.ts

// pageVariants
// - Page load: fade in + y slide (0->1 opacity, y 12px->0)
// - Duration: 300ms easeOut
// - Usage: Wrap entire page content

// sectionVariants
// - Section reveal on scroll with stagger
// - Stagger: 80ms between children
// - Usage: whileInView on section containers

// itemVariants
// - Individual item animation (fade + y slide)
// - Used in staggered containers
// - Duration: 300ms easeOut

// hoverVariants
// - Product image scale to 1.05
// - Duration: 250ms easeOut
// - Usage: whileHover on image containers

// containerVariants
// - Grid container with staggered children
// - Stagger: 80ms, delay: 100ms
// - Usage: whileInView on grid containers

// overlayVariants
// - Overlay fade in/out (200ms)
// - Usage: Modal/menu overlays

// menuVariants
// - Panel slide-in from right
// - Duration: 300ms easeOut
// - Exit: slide-out + fade (300ms easeIn)

// imageVariants
// - Image crossfade
// - Duration: 400ms fade in, 200ms fade out
// - Usage: PDP gallery image transitions

// ============================================================================
// MIGRATION CHECKLIST
// ============================================================================

// [✓] Add framer-motion to package.json
// [✓] Create src/lib/motion.ts with all variants
// [✓] Update src/app/globals.css with marquee animations
// [✓] Update ProductCard with motion (hover effect)
// [✓] Update ProductGrid with stagger container
// [✓] Update Header with animated mobile menu
// [✓] Update AnnouncementTicker with marquee
// [✓] Update CollectionTabs with animated underline
// [✓] Create AnimatedSection wrapper component
// [ ] Update shop/[handle]/page.tsx for PDP gallery crossfade
// [ ] Wrap pages with layout-level page animations
// [ ] Test all animations on mobile/desktop
// [ ] Performance check (monitor CPU/GPU usage)

// ============================================================================
// PERFORMANCE TIPS
// ============================================================================

// 1. Use `once: true` on whileInView for sections (trigger once)
// 2. Use `margin: "0px 0px -100px 0px"` for early trigger
// 3. Limit number of animated elements on screen at once
// 4. Use GPU-accelerated properties (opacity, transform)
// 5. Avoid animating layout/width/height (use transform instead)
// 6. Test on real devices, not just DevTools
// 7. Use layoutId carefully (can cause jank if overused)
// 8. Consider reduceMotion for accessibility

// ============================================================================
