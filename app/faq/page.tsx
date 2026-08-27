'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, Heart, Users, Handshake, ArrowUpRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: 'About ELI7 Foundation',
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'bg-[#C62828] text-white',
    items: [
      {
        question: 'What is the ELI7 Foundation?',
        answer: 'The Extend Love Initiative Foundation (ELI7 Foundation) is a women-led, youth-centred nonprofit organization operating nationwide across Nigeria. We focus on empowering vulnerable populations, persons with disabilities, and underserved communities through education, healthcare access, welfare support, and inclusion advocacy.',
      },
      {
        question: 'What does "ELI7" stand for?',
        answer: 'ELI7 stands for "Extend Love Initiative." The "7" represents completeness and wholeness — reflecting our commitment to holistic community transformation across all areas of human development.',
      },
      {
        question: 'Where does ELI7 Foundation operate?',
        answer: 'We operate nationwide Starting from where we are: Bauchi State and across Nigeria, with active programs in Bauchi State and expanding reach into other regions through partner networks and field volunteers. Our digital programs also extend our impact beyond physical locations.',
      },
      {
        question: 'Who leads the ELI7 Foundation?',
        answer: 'The foundation is led by Amarachi Sunday (Director of Operations), supported by a diverse Board of Trustees with that align with our organizational goals. The organization is proudly women-led at the executive level.',
      },
      {
        question: 'Is ELI7 Foundation a registered organization?',
        answer: 'Yes. The ELI7 Foundation is officially registered with the appropriate government bodies in Nigeria. We maintain full compliance with regulatory requirements and operate with transparency in all financial and programmatic activities.',
      },
    ],
  },
  {
    title: 'Donations & Funding',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-[#00897B] text-white',
    items: [
      {
        question: 'How can I donate to ELI7 Foundation?',
        answer: 'You can donate through our website\'s donation page, or reach out to us directly via email at eli7foundation@gmail.com. We accept one-time and recurring donations. All contributions go directly toward funding community programs, welfare distributions, and educational initiatives.',
      },
      {
        question: 'Is my donation tax-deductible?',
        answer: 'Donor tax benefits depend on your country of residence and local tax laws. We can provide official receipts and documentation for your records. Please consult a tax professional in your jurisdiction for specific guidance.',
      },
      {
        question: 'How is my donation used?',
        answer: '100% of donations are channeled into program delivery — including food relief packages, sanitary kits, educational materials, digital literacy bootcamps, and healthcare support. We maintain detailed tracking and can provide impact reports upon request.',
      },
      {
        question: 'Can I specify what my donation funds?',
        answer: 'Yes. You can direct your donation toward a specific program area (e.g., education, welfare, healthcare, disability inclusion) when making your contribution. Simply indicate your preference during the donation process or contact us directly.',
      },
      {
        question: 'Does ELI7 accept in-kind donations?',
        answer: 'Absolutely. We welcome in-kind donations such as educational supplies, sanitary products, clothing, food items, and medical supplies. Contact us at eli7foundation@gmail.com to coordinate logistics.',
      },
    ],
  },
  {
    title: 'Volunteering',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-[#C62828] text-white',
    items: [
      {
        question: 'How do I become a volunteer?',
        answer: 'Visit our Volunteer page and fill out the application form. We\'ll review your skills, availability, and interests, then match you with relevant programs. Our team will reach out to onboard you into our volunteer network.',
      },
      {
        question: 'What kind of volunteer opportunities are available?',
        answer: 'We offer both on-ground and remote opportunities — including field distributions, community workshops, digital literacy teaching, mentorship, social media management, content creation, grant writing, and administrative support.',
      },
      {
        question: 'Do I need prior experience to volunteer?',
        answer: 'Not at all. We welcome anyone with a genuine passion for community impact. Whether you\'re a student, professional, retiree, or simply someone who cares — your time and energy make a real difference.',
      },
      {
        question: 'Can I volunteer remotely?',
        answer: 'Yes. Many of our volunteers support us remotely through digital skills training, social media management, content development, research, and administrative tasks. Geography is not a barrier to making an impact with ELI7.',
      },
    ],
  },
  {
    title: 'Partnerships',
    icon: <Handshake className="w-5 h-5" />,
    color: 'bg-[#00897B] text-white',
    items: [
      {
        question: 'How can my organization partner with ELI7?',
        answer: 'Visit our Partner page or contact us directly. We collaborate with corporations, NGOs, government agencies, faith-based organizations, and academic institutions. We\'ll discuss alignment, scope, and co-creation of impact frameworks.',
      },
      {
        question: 'What types of partnerships does ELI7 offer?',
        answer: 'We offer programmatic partnerships, CSR collaborations, grant-funded joint initiatives, skills-based volunteering partnerships, media and awareness partnerships, and in-kind resource sharing. Each partnership is structured around mutual goals and measurable outcomes.',
      },
      {
        question: 'Does ELI7 partner with international organizations?',
        answer: 'Yes. We are open to collaborating with international development agencies, diaspora networks, and global foundations whose missions align with ours. Our programs are designed to be scalable across cross-border frameworks.',
      },
    ],
  },
];

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-2 border-[#0A0A0A] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left bg-[#FFFFFE] hover:bg-[#F4F1EA] transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-sm md:text-base text-[#293241] pr-4">{item.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#C62828] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 pt-0 text-sm text-[#0A0A0A]/80 leading-relaxed border-t border-[#0A0A0A]/10">
          <p className="pt-4">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, number>>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems((prev) => {
      const next = { ...prev };
      if (next[key] !== undefined) {
        delete next[key];
      } else {
        next[key] = itemIndex;
      }
      return next;
    });
  };

  const isOpen = (categoryIndex: number, itemIndex: number) => {
    return openItems[`${categoryIndex}-${itemIndex}`] !== undefined;
  };

  const totalQuestions = faqData.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="min-h-screen py-16 px-6 max-w-4xl mx-auto space-y-16">

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#C62828] text-white font-bold text-xs uppercase px-3.5 py-1.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A]">
          <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#293241] font-['Bricolage_Grotesque'] tracking-tight leading-tight">
          Got Questions?
        </h1>
        <p className="text-lg text-[#0A0A0A]/80 max-w-2xl mx-auto leading-relaxed">
          Find answers to the most common questions about our foundation, donations, volunteering, and partnerships. Can&apos;t find what you&apos;re looking for? Reach out directly.
        </p>
        <div className="inline-flex items-center gap-2 bg-[#F4F1EA] border-2 border-[#0A0A0A] px-4 py-2 text-sm font-bold text-[#293241]">
          {totalQuestions} questions across {faqData.length} categories
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-12">
        {faqData.map((category, catIndex) => (
          <section key={catIndex} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${category.color} border-2 border-[#0A0A0A] flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A]`}>
                {category.icon}
              </div>
              <h2 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
                {category.title}
              </h2>
            </div>

            <div className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <AccordionItem
                  key={itemIndex}
                  item={item}
                  isOpen={isOpen(catIndex, itemIndex)}
                  onToggle={() => toggleItem(catIndex, itemIndex)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA Bottom */}
      <div className="bg-[#FFFFFE] border-2 border-[#0A0A0A] shadow-[10px_10px_0px_#0A0A0A] p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <h3 className="text-2xl font-extrabold text-[#293241] font-['Bricolage_Grotesque']">
              Still have questions?
            </h3>
            <p className="text-sm text-[#0A0A0A]/80 leading-relaxed">
              We&apos;re always happy to hear from you. Whether it&apos;s a question about our programs, a partnership inquiry, or just a hello — don&apos;t hesitate to reach out.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#C62828] text-white font-bold text-sm uppercase px-6 py-3.5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Contact Us <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 bg-[#00897B] text-white font-bold text-sm uppercase px-6 py-3.5 border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:bg-[#293241] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <Heart className="w-4 h-4 fill-current" /> Donate
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}