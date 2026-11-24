export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  placeholder?: boolean;
};

export const faqs: FaqItem[] = [
  {
    id: 'how-development-works',
    question: 'How does product development work with My Rare Aesthetics?',
    answer:
      'Projects typically begin with a consultation to understand your idea, goals and timeline. From there we move through research, concept development, formulation support and coordinated next steps toward evaluation and production readiness.',
  },
  {
    id: 'consultation-bookings',
    question: 'How do I book a consultation?',
    answer:
      'You can book a consultation through our booking page or contact form. Once a Calendly link is configured, you will be able to select an available date and time and receive confirmation automatically.',
    placeholder: true,
  },
  {
    id: 'formulation-timelines',
    question: 'How long does formulation typically take?',
    answer:
      'Timelines vary by product complexity, testing requirements and project scope. After discovery, we outline realistic milestones so you understand expected stages and dependencies. [Client to confirm typical timeline ranges.]',
    placeholder: true,
  },
  {
    id: 'manufacturing-support',
    question: 'Do you support manufacturing as well as formulation?',
    answer:
      'Yes. Manufacturing support is part of our offering — including production planning conversations, manufacturer coordination and packaging/manufacturing sourcing support where needed.',
  },
  {
    id: 'product-testing',
    question: 'Can you help with product testing?',
    answer:
      'We support formulation testing and clinical evaluation pathway planning, helping coordinate appropriate testing approaches for your product type and launch goals.',
  },
  {
    id: 'regulatory-support',
    question: 'What regulatory support do you provide?',
    answer:
      'We provide consulting support around regulatory considerations, documentation needs and labelling checkpoints relevant to your intended markets. Specific market requirements should be confirmed for each project.',
  },
  {
    id: 'packaging-sourcing',
    question: 'Can you help source packaging?',
    answer:
      'Yes. Packaging and manufacturing sourcing support is available to help identify options aligned with your brand presentation, budget and production pathway.',
  },
  {
    id: 'project-costs',
    question: 'How are project costs determined?',
    answer:
      'Costs depend on scope of services, product complexity and project duration. After an initial consultation we can outline a clearer view of recommended stages and associated investment. [Detailed pricing to be confirmed with the business.]',
    placeholder: true,
  },
];
