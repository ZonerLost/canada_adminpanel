import React, { useState } from "react";

const entries = [
  {
    q: "🤝 What is LatinoConnect Canada?",
    a: `LatinoConnect Canada is a Tinder-style job matching platform that connects Latin American workers with Canadian employers. It originally focused on caregivers and domestic workers but has now expanded to include a wide range of industries such as healthcare, construction, hospitality, cleaning, and technology.`,
  },
  {
    q: "📲 How does it work?",
    a: `1. Create your profile (as a worker or employer).\n2. Browse available profiles and swipe (like) the ones that interest you.\n3. You can only chat if there's a mutual match.\n4. Use it for free with limited features, or subscribe to unlock premium options.`,
  },
  {
    q: "💳 What’s included in the free version?",
    a: `- View worker or employer profiles.\n- Send a limited number of likes.\n- Match if both parties like each other.`,
  },
  {
    q: "🔓 What do I get with a subscription?",
    a: `- Unlimited likes.\n- See who liked your profile.\n- Boosted visibility.\n- Full access to chat after matching.\n\nPricing:\n- Employers: US$19.95/month\n- Workers: US$19.95 one-time payment to publish profile`,
  },
  {
    q: "🧰 What kinds of jobs are available?",
    a: `In addition to domestic and caregiver roles, the platform now includes:\n- Healthcare (nurses, assistants, technicians)\n- Construction (laborers, electricians, masons)\n- Hospitality and cleaning\n- Technology (developers, IT support)\n- Cooking, transport, logistics, and more`,
  },
  {
    q: "🛂 Can you help with immigration?",
    a: `Yes. We assist with:\n- Official immigration programs (Caregiver Pilot Program and others)\n- Work permits\n- Legal documentation for employers and workers`,
  },
  {
    q: "🔐 Is the platform secure?",
    a: `Yes. All profiles are reviewed, and we strictly protect your data under our privacy policy.`,
  },
  {
    q: "🌎 Which countries can register?",
    a: `Mainly from Latin America: Dominican Republic, Colombia, Mexico, Peru, Ecuador, Honduras, El Salvador, and others.`,
  },
  {
    q: "🗣️ What languages is the platform available in?",
    a: `The platform is fully bilingual: English and Spanish.`,
  },
  {
    q: "❌ Can I cancel my subscription?",
    a: `Yes, you can cancel at any time from your profile. No extra fees.`,
  },
  {
    q: "🚀 What makes LatinoConnect Canada unique?",
    a: `- Modern Tinder-style interface: match before chatting\n- Focus on Latin American talent\n- Multi-sector expansion (not just caregivers)\n- Reliable immigration support\n- User-friendly and affordable, no expensive intermediaries`,
  },
  {
    q: "🛂 Immigration to Canada & Caregiver Pilot Program – FAQ",
    a: `See the following questions for more details below.`,
  },
  {
    q: "🧑‍👩‍👧 Can I bring my spouse and/or children when I immigrate?",
    a: `Yes — in many immigration pathways (including the new caregiver/home‑care worker pilot streams) you may be able to include your spouse or common‑law partner and dependent children in your application or arrange for them to accompany you.\n\n- If you apply under a caregiver or home‑care worker pilot and qualify, your family members can often come with you. Your spouse/partner may receive an open work permit and your children may be eligible for study permits while you settle in Canada.\n- Eligibility to bring family depends on the specific program, your job offer, and meeting other criteria such as language and financial requirements.\n- Always declare family members properly in your application, and be prepared to demonstrate proof of funds to support them.\n- We recommend verifying this directly with IRCC or consulting a licensed immigration consultant or lawyer to ensure proper inclusion of your family members.`,
  },
  {
    q: "🧑‍💼 How much can a caregiver expect to make on average per year in Canada?",
    a: `A caregiver in Canada typically earns a wage that depends on the province or territory, the employer (household vs. agency), and whether live-in or live-out accommodations are provided. On average, caregivers can expect to earn between CAD $30,000 and CAD $40,000 per year, before taxes. In some provinces or with additional duties (e.g., caring for persons with disabilities, children plus home help), the annual income may exceed CAD $45,000.\n\nKeep in mind that cost of living, accommodation, and whether meals or housing are included will affect your net income. Always confirm wage, hours, benefits, and living arrangements before accepting a job offer.`,
  },
  {
    q: "🇨🇦 Can I immigrate to Canada through LatinoConnect?",
    a: `Yes. If you're selected by a Canadian employer and meet the eligibility criteria, you may apply through official immigration programs like the Home Child Care Provider Pilot or Home Support Worker Pilot.`,
  },
  {
    q: "📋 What is the Caregiver Pilot Program?",
    a: `It’s a Canadian government program that allows qualified foreign caregivers to come to Canada on a work permit and eventually apply for permanent residency if they meet the work experience and job offer requirements.`,
  },
  {
    q: "👩‍⚕️ What do I need to qualify as a caregiver?",
    a: `- Relevant experience in child care, elder care, or support for people with medical needs.\n- Minimum English level: CLB 5 (through IELTS, CELPIP, etc.).\n- High school diploma or higher.\n- A valid job offer from a Canadian employer.`,
  },
  {
    q: "📄 Does LatinoConnect help with the immigration process?",
    a: `Yes. We guide you through:\n- Profile and eligibility review.\n- Matching with employers interested in sponsoring.\n- Referral to licensed immigration consultants or lawyers if needed.`,
  },
  {
    q: "💰 What are the costs involved?",
    a: `LatinoConnect charges a flat fee (US$19.95) for workers to publish their profile. Immigration processing fees, language tests, biometrics, and visa costs are additional and must be paid by the worker or employer. We are transparent about all fees.`,
  },
  {
    q: "⏳ How long does the immigration process take?",
    a: `Once you have a valid job offer and submit your complete application, processing can take anywhere from 6 to 12 months depending on your case.`,
  },
  {
    q: "🧑‍⚖️ What if I don’t qualify for the caregiver program?",
    a: `LatinoConnect can also help you explore other work opportunities that may lead to a job offer under a different visa category, such as LMIA or a general work permit.`,
  },
  {
    q: "👔 Canadian Employers – Frequently Asked Questions",
    a: `See below for employer-focused answers.`,
  },
  {
    q: "🤔 How does the app help me find reliable workers?",
    a: `LatinoConnect Canada allows you to browse a curated pool of pre-screened Latin American candidates for roles in caregiving, construction, healthcare, hospitality, tech, and more. You swipe through worker profiles and only connect when there's a mutual interest (match).`,
  },
  {
    q: "💼 What types of workers can I find on the app?",
    a: `You can find candidates for:\n- Child care and elder care\n- Housekeeping and cleaning\n- Construction and maintenance\n- Hospitality and food services\n- IT, remote support, and digital services\n- General labor and logistics`,
  },
  {
    q: "💳 How much does it cost for employers?",
    a: `Employers pay US$19.95/month to:\n- View full candidate profiles\n- Send unlimited likes\n- See who liked their job post\n- Unlock chat and build direct connections after matching`,
  },
  {
    q: "📝 What is required of me if I want to sponsor a foreign worker?",
    a: `If you decide to hire someone who is not yet in Canada, you may need to:\n- Provide a formal job offer (with contract).\n- Prove your business or household can pay a fair wage.\n- Submit documents for an LMIA (Labour Market Impact Assessment), unless exempt.\n- Work with a licensed immigration consultant or lawyer for paperwork.\n- Be prepared to assist the worker with relocation and onboarding.`,
  },
  {
    q: "📄 Do I need an LMIA to hire a foreign worker?",
    a: `In most cases, yes. However, under the Caregiver Pilot Program and other immigration streams, some LMIA exemptions apply. We can guide you or refer you to legal partners who can help determine the best route.`,
  },
  {
    q: "📆 How long does it take to bring a worker to Canada?",
    a: `After submitting a complete application and job offer, immigration processing can take between 6–12 months. It's essential to plan ahead and communicate clearly with your selected candidate.`,
  },
  {
    q: "🛡️ Is hiring through LatinoConnect legal and safe?",
    a: `Yes. We comply with Canadian labor and immigration guidelines. You’ll always be in control of who you hire and how far you go in the process. We also connect you with trusted immigration professionals if you need help.`,
  },
  {
    q: "🔍 Can I find workers already in Canada?",
    a: `Yes. Some candidates are already residing in Canada and are available for immediate interviews or hire. Their profiles will indicate this status.`,
  },
  {
    q: "📞 What if I need help or legal support?",
    a: `We offer optional access to vetted immigration consultants and HR advisors who can assist with job offers, LMIA preparation, and government compliance. We’re here to support your hiring journey.`,
  },
  {
    q: "⚠️ Disclaimer",
    a: `LatinoConnect is an independent job-matching platform and is not affiliated with Immigration, Refugees and Citizenship Canada (IRCC) or any Canadian government agency. We only provide general assistance and information based on publicly available immigration programs. Applicants should verify all information directly with IRCC or consult a licensed immigration consultant or lawyer in Canada. If you do not already have one, we would be happy to refer you to a qualified professional.`,
  },
];

function Entry({ item, open, onToggle }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-black/5 transition`}
        style={{ background: "var(--surface)" }}
      >
        <span className="font-medium">{item.q}</span>
        <span className="ml-4 text-muted">{open ? "−" : "+"}</span>
      </button>

      <div
        className={`px-4 pt-0 pb-4 overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="whitespace-pre-line text-sm text-muted pt-3">
          {item.a}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          FAQ — LatinoConnect Canada
        </h1>
        <p className="text-muted mb-6">
          Common questions and answers about the platform and immigration
          support.
        </p>

        <div className="space-y-3">
          {entries.map((e, i) => (
            <div
              key={i}
              className={`transform transition duration-300 ${
                openIndex === i ? "scale-100" : "hover:scale-[1.01]"
              }`}
            >
              <Entry
                item={e}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
