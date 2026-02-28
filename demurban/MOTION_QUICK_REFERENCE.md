# Motion System Quick Reference

## Installed
- [x] framer-motion v12.0.0 added to package.json
- [x] src/lib/motion.ts - All reusable variants
- [x] Marquee animations added to globals.css
- [x] AnimatedSection wrapper component created

## Updated Components
- [x] ProductCard - Hover scale effect (1.05, 250ms)
- [x] ProductGrid - Staggered reveal (80ms stagger)
- [x] Header - Mobile menu with overlay fade + slide-in
- [x] AnnouncementTicker - Marquee loop with pause on hover
- [x] CollectionTabs - Animated underline indicator (layoutId)

## Quick Usage

### Section Reveal on Scroll
```tsx
import { AnimatedSection, AnimatedItem } from "@/components/AnimatedSection";

<AnimatedSection className="mx-auto max-w-7xl px-4 py-16">
  <AnimatedItem className="mb-8">
    <h2>Title</h2>
  </AnimatedItem>
  <ProductGrid products={products} />
</AnimatedSection>
```

### Page Load Animation
```tsx
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

<motion.div initial="hidden" animate="visible" variants={pageVariants}>
  {children}
</motion.div>
```

### Product Card Hover
Already implemented - just use ProductCard normally, hover scales image to 1.05

### Marquee Ticker
Already implemented - AnnouncementTicker has marquee loop with pause on hover

### Animated Tabs
Already implemented - CollectionTabs has animated underline indicator

## Timings (Wearix Standard)
- Page load: 300ms easeOut
- Section reveal: 300ms per item, 80ms stagger
- Hover effects: 250ms easeOut
- Menu animations: 300ms easeOut
- Marquee: 20s linear infinite

## Next Steps
1. Update shop/[handle]/page.tsx for PDP gallery crossfade (imageVariants)
2. Wrap pages with layout-level page animations
3. Test all animations on mobile/desktop
4. Performance monitoring

## Files to Reference
- `src/lib/motion.ts` - All variants
- `MOTION_IMPLEMENTATION_GUIDE.md` - Detailed examples
- `src/components/AnimatedSection.tsx` - Wrapper component
- `src/app/globals.css` - Marquee animations
