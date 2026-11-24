import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Droplets,
  Scissors,
  Palette,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Layers,
  ArrowRight,
  FlaskConical,
  HeartHandshake,
} from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Seo } from '@/components/ui/Seo';
import { Button } from '@/components/ui/button';
import { FinalCta } from '@/components/FinalCta';
import { cn } from '@/lib/utils';

const categories = [
  {
    id: 'skincare',
    number: '01',
    title: 'Premium Skincare Formulations',
    icon: Droplets,
    badge: 'Skincare',
    intro:
      'Healthy-looking skin begins with products developed with care, precision, and an understanding of skin needs. At My Rare Aesthetics, we focus on creating innovative skincare formulations designed to address different cosmetic concerns while delivering an enjoyable application experience.',
    subtitle:
      'Our skincare development capabilities include a wide range of product categories, from daily essentials to specialized treatment-inspired formulations.',
    items: [
      {
        name: 'Facial Serums',
        description:
          'Lightweight formulations featuring ingredients such as hyaluronic acid, niacinamide, vitamin C derivatives, and peptides.',
      },
      {
        name: 'Moisturizers and Face Creams',
        description:
          'Nourishing formulations designed to support skin hydration and maintain a healthy-looking skin barrier.',
      },
      {
        name: 'Facial Cleansers',
        description:
          'Gentle cleansing solutions developed to remove everyday impurities while maintaining a comfortable skin feel.',
      },
      {
        name: 'Sunscreen Formulations',
        description:
          'Sun protection product development with consideration for appropriate SPF testing, formulation stability, and applicable regulatory requirements.',
      },
      {
        name: 'Face Masks',
        description:
          'Innovative formulations designed to provide targeted cosmetic benefits and enhance skincare routines.',
      },
      {
        name: 'Exfoliating Products',
        description:
          'Formulations featuring carefully selected exfoliating ingredients to support smoother-looking skin.',
      },
      {
        name: 'Anti-Ageing Skincare',
        description:
          'Advanced cosmetic formulations designed around ingredients associated with improving the appearance of fine lines, texture, and skin hydration.',
      },
    ],
    footerNote:
      "We focus on formulation compatibility, ingredient functionality, product texture, stability, and overall user experience to develop skincare products that reflect your brand's vision.",
    image: '/images/mra-products.jpg',
  },
  {
    id: 'haircare',
    number: '02',
    title: 'Advanced Haircare Formulations',
    icon: Scissors,
    badge: 'Haircare',
    intro:
      'Beautiful-looking hair begins with the right care. Modern consumers are increasingly looking for haircare products that go beyond basic cleansing and conditioning.',
    subtitle:
      'At My Rare Aesthetics, we develop customized haircare concepts that combine carefully selected ingredients with innovative formulation approaches. Whether your brand focuses on scalp care, hair hydration, nourishment, or styling, we help transform your ideas into thoughtfully developed haircare products.',
    items: [
      {
        name: 'Shampoos',
        description:
          'Customized cleansing formulations suitable for different hair and scalp care requirements.',
      },
      {
        name: 'Conditioners',
        description:
          'Conditioning solutions designed to improve softness, manageability, and smoothness.',
      },
      {
        name: 'Hair Serums',
        description:
          'Lightweight formulations designed to enhance shine, reduce the appearance of frizz, and improve hair feel.',
      },
      {
        name: 'Hair Masks',
        description:
          'Deep-conditioning product concepts designed to support softer and more manageable hair.',
      },
      {
        name: 'Hair Oils',
        description:
          'Nourishing formulations featuring selected botanical and cosmetic oils.',
      },
      {
        name: 'Scalp Care Products',
        description:
          'Specialized formulations developed around scalp cleansing, hydration, and cosmetic care.',
      },
      {
        name: 'Hair Styling Products',
        description:
          'Innovative solutions designed to support different styling needs and hair finishes.',
      },
    ],
    footerNote:
      'Our approach emphasizes ingredient selection, formulation performance, product consistency, and sensory appeal to help brands create distinctive haircare collections.',
    image: '/images/custom-bottles.jpg',
  },
  {
    id: 'makeup',
    number: '03',
    title: 'High-Performance Makeup Formulations',
    icon: Palette,
    badge: 'Makeup',
    intro:
      'Makeup is an important expression of creativity and personal style. Today’s consumers expect cosmetic products that combine beautiful finishes, comfortable application, reliable performance, and inclusive shade options.',
    subtitle:
      'At My Rare Aesthetics, we support the development of makeup formulations that bring together aesthetics, functionality, and innovation. From everyday makeup essentials to premium luxury collections, we help brands explore product concepts that align with their desired market positioning.',
    items: [
      {
        name: 'Foundations',
        description:
          'Customizable foundation formulations with different coverage levels, textures, and finishes.',
      },
      {
        name: 'Concealers',
        description:
          'Formulations designed to provide buildable coverage and a smooth cosmetic finish.',
      },
      {
        name: 'Primers',
        description:
          'Products developed to create a suitable base for makeup application.',
      },
      {
        name: 'Lipsticks and Lip Glosses',
        description:
          'Creative lip formulations available in different finishes, textures, and shades.',
      },
      {
        name: 'Compact Powders',
        description:
          'Powder-based makeup solutions designed for a refined and comfortable finish.',
      },
      {
        name: 'Blush and Highlighters',
        description:
          'Color cosmetic formulations that enhance facial appearance with different finishes.',
      },
      {
        name: 'Eyeshadow Products',
        description:
          'Creative color formulations designed around pigmentation, texture, and blendability.',
      },
      {
        name: 'Setting Products',
        description:
          'Makeup finishing solutions developed to complement different makeup routines.',
      },
    ],
    footerNote:
      'We understand that every makeup brand has its own identity. Our development approach considers shade diversity, texture, finish, application experience, and product performance to support the creation of distinctive cosmetic collections.',
    image: '/images/mra-sheetmasks.jpg',
  },
];

const customizationPoints = [
  'Selection of suitable cosmetic ingredients.',
  'Product texture and consistency preferences.',
  'Fragrance and sensory experience.',
  'Desired cosmetic benefits and product functionality.',
  'Shade and finish development for makeup.',
  'Packaging and product compatibility considerations.',
  'Product testing and formulation refinement.',
  'Brand-specific product positioning.',
];

const ingredientCategories = [
  {
    title: 'Botanical Ingredients',
    description:
      'Plant-derived extracts and oils that offer a variety of cosmetic formulation benefits.',
    tag: 'Nature-Derived',
  },
  {
    title: 'Hydrating Ingredients',
    description:
      'Ingredients such as hyaluronic acid, glycerin, and other humectants that help support skin hydration.',
    tag: 'Moisture Lock',
  },
  {
    title: 'Functional Actives',
    description:
      'Carefully selected cosmetic ingredients such as niacinamide, peptides, and vitamin derivatives.',
    tag: 'Performance',
  },
  {
    title: 'Conditioning Ingredients',
    description:
      'Ingredients that support softness, smoothness, and manageability in haircare formulations.',
    tag: 'Silk & Shine',
  },
  {
    title: 'Emollients and Moisturizing Agents',
    description:
      'Ingredients that contribute to skin feel, softness, and formulation performance.',
    tag: 'Barrier Care',
  },
];

const qualityEvaluations = [
  'Ingredient quality and compatibility assessments.',
  'Formulation stability testing.',
  'Microbiological quality and preservation evaluation.',
  'Packaging compatibility testing.',
  'Dermatological testing where appropriate.',
  'Product performance and sensory evaluations.',
  'Regulatory and labeling compliance assessments.',
];

const sustainabilityPillars = [
  'Exploring responsibly sourced raw materials.',
  'Evaluating suitable plant-derived and alternative ingredients.',
  'Considering packaging materials with improved environmental profiles.',
  'Reducing unnecessary formulation complexity.',
  'Exploring refillable and recyclable packaging options where suitable.',
  'Supporting transparent product information and responsible cosmetic claims.',
];

const roadmapSteps = [
  {
    step: 'Step 1',
    title: 'Concept Development',
    text: 'Understanding your product idea, target audience, and brand vision.',
  },
  {
    step: 'Step 2',
    title: 'Research and Ingredient Selection',
    text: 'Identifying suitable ingredients and exploring formulation possibilities.',
  },
  {
    step: 'Step 3',
    title: 'Formulation Development',
    text: 'Creating customized product formulations based on your requirements.',
  },
  {
    step: 'Step 4',
    title: 'Sample Evaluation',
    text: 'Reviewing samples and refining the formulation based on feedback.',
  },
  {
    step: 'Step 5',
    title: 'Testing and Quality Evaluation',
    text: 'Conducting relevant product evaluations and testing according to the formulation and market requirements.',
  },
  {
    step: 'Step 6',
    title: 'Finalization and Product Preparation',
    text: 'Supporting the final development stages, including relevant documentation, packaging compatibility, and regulatory considerations.',
  },
];

export function Products() {
  const [activeTab, setActiveTab] = useState<'all' | 'skincare' | 'haircare' | 'makeup'>('all');

  const visibleCategories =
    activeTab === 'all'
      ? categories
      : categories.filter((cat) => cat.id === activeTab);

  return (
    <>
      <Seo
        title="Our Product Range | Skincare, Haircare & Makeup | My Rare Aesthetics"
        description="Explore our complete cosmetic product formulation range across skincare, haircare, and makeup. Custom cosmetic science developed in Pretoria, South Africa."
      />

      <PageHero
        eyebrow="Our Product Range"
        title="Innovation Across Skincare, Haircare & Makeup"
        description="Creating beauty products that inspire confidence through scientific research, innovative formulations, and thoughtful ingredient selection."
      />

      {/* Intro Editorial Section */}
      <Section className="pb-12 md:pb-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="font-alt text-xs uppercase tracking-[0.28em] text-deep-blue">
                Philosophy & Vision
              </span>
              <h2 className="mt-3 font-heading text-3xl font-medium text-plum sm:text-4xl md:text-5xl">
                Creating Beauty Products That Inspire Confidence
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-dark-plum/80 sm:text-lg">
                <p>
                  At My Rare Aesthetics, we believe beauty is more than a routine — it is an
                  expression of individuality, confidence, and self-care. Our product development
                  approach brings together scientific research, innovative formulations, and
                  thoughtful ingredient selection to create premium beauty solutions that meet the
                  evolving needs of today’s consumers.
                </p>
                <p>
                  We specialize in developing customized skincare, haircare, and makeup
                  formulations that help beauty entrepreneurs and established brands transform
                  their ideas into distinctive product collections.
                </p>
                <p>
                  From advanced skincare serums and nourishing hair treatments to high-performance
                  foundations and everyday makeup essentials, every product concept is approached
                  with a focus on quality, functionality, and consumer experience.
                </p>
                <p className="font-medium text-plum">
                  Our goal is to help you create products that not only complement your brand
                  identity but also establish a meaningful connection with your customers.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="relative overflow-hidden rounded-3xl border border-plum/15 bg-white p-3 shadow-xl">
                <img
                  src="/images/mra-products.jpg"
                  alt="My Rare Aesthetics Product Range"
                  className="h-full w-full rounded-2xl object-cover aspect-[4/5]"
                />
                <div className="absolute inset-x-7 bottom-7 rounded-xl border border-white/20 bg-dark-plum/85 p-5 text-white backdrop-blur-md">
                  <div className="flex items-center gap-2 text-orchid">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-alt text-xs tracking-widest uppercase">
                      Bespoke Development
                    </span>
                  </div>
                  <p className="mt-1 font-heading text-lg font-medium">
                    Your Brand. Your Vision. Our Science.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Product Categories (Skincare, Haircare, Makeup) */}
      <Section className="pt-0" id="product-pillars">
        <div className="flex flex-col items-center justify-between gap-6 border-b border-plum/15 pb-8 md:flex-row">
          <div>
            <span className="font-alt text-xs uppercase tracking-[0.28em] text-deep-blue">
              Formulation Disciplines
            </span>
            <h2 className="mt-1 font-heading text-3xl font-medium text-plum md:text-4xl">
              Explore Our Core Product Categories
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'skincare', label: '1. Skincare' },
              { id: 'haircare', label: '2. Haircare' },
              { id: 'makeup', label: '3. Makeup' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-plum text-lavender shadow-md'
                    : 'bg-orchid/20 text-dark-plum hover:bg-orchid/40'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-16">
          {visibleCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                id={cat.id}
                className="scroll-mt-28 overflow-hidden rounded-3xl border border-plum/15 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-10 md:p-12"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-plum text-lavender font-heading text-sm font-bold">
                        {cat.number}
                      </span>
                      <span className="rounded-full bg-orchid/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-plum">
                        {cat.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-2xl font-bold text-plum sm:text-3xl md:text-4xl">
                      {cat.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-dark-plum/85 sm:text-lg">
                      {cat.intro}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-plum/70">
                      {cat.subtitle}
                    </p>
                  </div>
                  <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-plum/10 text-plum md:flex">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-10">
                  <p className="font-alt text-xs uppercase tracking-[0.25em] text-deep-blue">
                    Our {cat.badge.toLowerCase()} product range includes:
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.items.map((item) => (
                      <div
                        key={item.name}
                        className="group flex flex-col justify-between rounded-2xl border border-plum/10 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-plum/30 hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-plum">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-deep-blue" />
                            <h4 className="font-heading text-base font-semibold text-plum">
                              {item.name}
                            </h4>
                          </div>
                          <p className="mt-2.5 text-xs leading-relaxed text-dark-plum/75">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 rounded-xl border-l-4 border-plum bg-orchid/15 p-4 sm:p-5">
                  <p className="text-sm italic text-dark-plum/85">{cat.footerNote}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 4. Customized Formulations for Every Brand */}
      <Section className="bg-[#fcf8fa]" id="customized-formulations">
        <Reveal>
          <div className="max-w-3xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-plum text-lavender font-heading text-xs font-bold">
              04
            </span>
            <span className="mt-3 block font-alt text-xs uppercase tracking-[0.28em] text-deep-blue">
              Tailored Solutions
            </span>
            <h2 className="mt-2 font-heading text-3xl font-medium text-plum sm:text-4xl md:text-5xl">
              Customized Formulations for Every Brand
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-dark-plum/80 sm:text-lg">
              <p>
                No two beauty brands are the same. Each has its own philosophy, target audience,
                product expectations, and market positioning. That is why we believe customized
                formulation development is essential to creating products that stand apart.
              </p>
              <p>
                At My Rare Aesthetics, we collaborate with brands to understand their requirements
                and develop product concepts that reflect their individual vision. Whether you are
                interested in developing a luxury skincare collection, a science-led haircare range,
                or an inclusive makeup line, our approach is designed to accommodate different brand
                requirements.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12">
          <p className="font-alt text-xs uppercase tracking-[0.25em] text-deep-blue">
            Customization may include:
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {customizationPoints.map((point, i) => (
              <Reveal key={point} delay={(i % 4) * 0.05}>
                <div className="h-full rounded-2xl border border-plum/10 bg-white p-6 shadow-xs transition hover:shadow-md">
                  <span className="font-heading text-xs font-semibold text-orchid">
                    0{i + 1}
                  </span>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-dark-plum">
                    {point}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-2xl border border-plum/15 bg-plum/5 p-6 text-center sm:p-8">
            <p className="font-heading text-lg font-medium text-plum">
              Our aim is to help you build a cohesive product range that communicates your brand’s
              identity and meets your customers’ expectations.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* 5. Clean, Effective & Thoughtfully Selected Ingredients */}
      <Section id="ingredients">
        <Reveal>
          <div className="max-w-3xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-plum text-lavender font-heading text-xs font-bold">
              05
            </span>
            <span className="mt-3 block font-alt text-xs uppercase tracking-[0.28em] text-deep-blue">
              Ingredient Intelligence
            </span>
            <h2 className="mt-2 font-heading text-3xl font-medium text-plum sm:text-4xl md:text-5xl">
              Clean, Effective & Thoughtfully Selected Ingredients
            </h2>
            <p className="mt-5 text-base leading-relaxed text-dark-plum/80 sm:text-lg">
              Ingredient selection is one of the most important aspects of cosmetic product
              development. Consumers are increasingly interested in understanding what goes into
              their beauty products and how those ingredients contribute to the overall formulation.
            </p>
            <p className="mt-3 text-base leading-relaxed text-dark-plum/80 sm:text-lg">
              At My Rare Aesthetics, we emphasize thoughtful ingredient selection, considering
              functionality, compatibility, safety, and intended product performance.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ingredientCategories.map((ing, i) => (
            <Reveal key={ing.title} delay={(i % 3) * 0.06}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-plum/15 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-orchid/20 px-3 py-1 text-[11px] font-semibold text-plum">
                      {ing.tag}
                    </span>
                    <FlaskConical className="h-4 w-4 text-deep-blue" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-bold text-plum">
                    {ing.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-dark-plum/75">
                    {ing.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-plum/30 bg-orchid/15 p-6 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-plum" />
              <p className="mt-4 text-sm font-medium leading-relaxed text-plum">
                We believe that effective formulations are created through a thoughtful balance of
                ingredients rather than simply including popular ingredients for marketing purposes.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 6. Quality, Safety & Product Performance & 7. Sustainable Beauty */}
      <Section dark id="quality-sustainability">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Section 6 */}
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orchid text-dark-plum font-heading text-xs font-bold">
                  06
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-orchid uppercase tracking-wider">
                  Quality Assurance
                </span>
              </div>
              <h2 className="mt-4 font-heading text-2xl font-medium text-lavender sm:text-3xl md:text-4xl">
                Quality, Safety & Product Performance
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-lavender/80 sm:text-base">
                A premium beauty product should offer more than an attractive appearance. Its
                development should consider quality, safety, stability, and the overall experience
                of the consumer. At My Rare Aesthetics, we recognize the importance of maintaining
                quality considerations throughout the formulation development process.
              </p>
              <div className="mt-8 space-y-3">
                <p className="text-xs uppercase tracking-widest text-orchid">
                  Relevant evaluations include:
                </p>
                {qualityEvaluations.map((evalItem) => (
                  <div key={evalItem} className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-orchid" />
                    <span className="text-sm text-lavender/90">{evalItem}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs leading-relaxed text-lavender/70 border-t border-white/10 pt-4">
                We also support the development of cruelty-free product concepts and responsible
                ingredient selection. Product claims such as cruelty-free, dermatologically tested,
                or sustainable are supported by appropriate verification and documentation where
                applicable.
              </p>
            </Reveal>
          </div>

          {/* Section 7 */}
          <div>
            <Reveal delay={0.15}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orchid text-dark-plum font-heading text-xs font-bold">
                  07
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-orchid uppercase tracking-wider">
                  Future-Ready
                </span>
              </div>
              <h2 className="mt-4 font-heading text-2xl font-medium text-lavender sm:text-3xl md:text-4xl">
                Sustainable Beauty & Responsible Innovation
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-lavender/80 sm:text-base">
                The future of the beauty industry is increasingly connected to sustainability and
                responsible product development. Consumers are paying closer attention to
                ingredient sourcing, packaging materials, manufacturing practices, and the
                environmental impact of the products they purchase.
              </p>
              <div className="mt-8 space-y-3">
                <p className="text-xs uppercase tracking-widest text-orchid">
                  Our development considerations include:
                </p>
                {sustainabilityPillars.map((pillar) => (
                  <div key={pillar} className="flex items-start gap-3">
                    <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-orchid" />
                    <span className="text-sm text-lavender/90">{pillar}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs leading-relaxed text-lavender/70 border-t border-white/10 pt-4">
                We believe that innovation should consider both product performance and the broader
                impact of beauty products.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* 8. From Product Concept to Your Brand Collection */}
      <Section id="development-roadmap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-plum text-lavender font-heading text-xs font-bold">
              08
            </span>
            <span className="mt-3 block font-alt text-xs uppercase tracking-[0.28em] text-deep-blue">
              Structured Methodology
            </span>
            <h2 className="mt-2 font-heading text-3xl font-medium text-plum sm:text-4xl md:text-5xl">
              From Product Concept to Your Brand Collection
            </h2>
            <p className="mt-4 text-base leading-relaxed text-dark-plum/80 sm:text-lg">
              Developing a beauty product is a journey that requires planning, research, formulation
              expertise, and collaboration. Our product development approach is designed to help
              brands navigate this journey through structured stages.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roadmapSteps.map((s, idx) => (
            <Reveal key={s.step} delay={idx * 0.06}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-plum/15 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:shadow-md">
                <div>
                  <span className="rounded-full bg-plum/10 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-plum">
                    {s.step}
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-bold text-plum">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-dark-plum/75">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 rounded-2xl border border-plum/15 bg-plum/5 p-6 text-center sm:p-8">
            <p className="text-sm font-medium text-plum sm:text-base">
              This structured approach helps transform an initial concept into a carefully developed
              product collection.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* 9. Building Beauty Brands That Stand Out & Final Callout */}
      <Section className="bg-gradient-to-b from-[#fcf8fa] to-white" id="brand-vision">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="rounded-3xl border border-plum/20 bg-white p-8 shadow-xl sm:p-12 md:p-16">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-plum text-lavender font-heading text-xs font-bold">
                  09
                </span>
                <span className="font-alt text-xs uppercase tracking-[0.28em] text-deep-blue">
                  Commercial Impact
                </span>
              </div>
              <h2 className="mt-4 font-heading text-3xl font-medium text-plum sm:text-4xl md:text-5xl">
                Building Beauty Brands That Stand Out
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-dark-plum/80 sm:text-lg">
                <p>
                  The beauty market offers countless opportunities for brands that understand their
                  customers and deliver meaningful product experiences. A successful product
                  collection should have a clear purpose, consistent quality, recognizable
                  identity, and a strong connection with its intended audience.
                </p>
                <p>
                  At My Rare Aesthetics, we aim to support beauty entrepreneurs and established
                  businesses in developing products that reflect their ambitions. Whether you are
                  creating your first three-product skincare collection or expanding into a complete
                  beauty portfolio, we believe the right combination of science, creativity, and
                  product development expertise can make a meaningful difference.
                </p>
              </div>

              <div className="mt-12 rounded-2xl border border-plum/15 bg-gradient-to-r from-plum/10 via-orchid/20 to-plum/10 p-8 text-center sm:p-10">
                <span className="font-alt text-xs uppercase tracking-[0.28em] text-deep-blue">
                  Begin Your Development
                </span>
                <h3 className="mt-3 font-heading text-2xl font-bold text-plum sm:text-3xl">
                  Discover the Possibilities with My Rare Aesthetics
                </h3>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-dark-plum/80 sm:text-base">
                  Your next beauty innovation starts with an idea. Let us help you explore its
                  possibilities. From skincare and haircare to premium makeup formulations, My Rare
                  Aesthetics brings together research, customization, and formulation development to
                  support your brand’s journey.
                </p>
                <p className="mt-4 font-heading text-xl font-bold tracking-wide text-plum">
                  Your Brand. Your Vision. Our Science.
                </p>
                <p className="mt-2 text-sm text-dark-plum/70">
                  Let’s create the next generation of beauty together. Connect with My Rare
                  Aesthetics and begin developing your unique product range today.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Button to="/book" variant="primary" className="!px-7 !py-3">
                    Book a Consultation <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button to="/contact" variant="ghost" className="!px-7 !py-3">
                    Enquire About a Project
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
