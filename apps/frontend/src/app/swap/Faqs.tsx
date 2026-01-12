"use client";

import { create } from "zustand";

const faqData = [
  {
    question: "How does the device swapping process work?",
    answer:
      "You submit your device details, receive an instant quote, and if you accept, you ship your device to us. After inspection, you receive your new device or payment.",
  },
  {
    question: "What information do I need to provide about my current device?",
    answer:
      "You'll need to provide the device model, condition, storage capacity, and any accessories included. Accurate details help us give you the best quote.",
  },
  {
    question: "How is the trade-in value determined?",
    answer:
      "Our AI-powered system evaluates your device based on its model, condition, market demand, and included accessories to offer a fair and competitive value.",
  },
  {
    question: "Can I trade in devices other than smartphones or PCs?",
    answer:
      "Yes! We accept a wide range of tech devices, including tablets, smartwatches, and select accessories. Check our website for the full list.",
  },
  {
    question: "Is there a limit to the number of devices I can trade in?",
    answer:
      "No, you can trade in as many devices as you wish. For bulk or business trades, please contact our support team for special arrangements.",
  },
  {
    question: "What condition does my current device need to be in?",
    answer:
      "We accept devices in various conditions, from brand new to well-used. The better the condition, the higher the trade-in value.",
  },
  {
    question: "Do I need to include accessories with my trade-in?",
    answer:
      "Including original accessories (charger, cable, box) can increase your device's value, but they are not required unless specified.",
  },
  {
    question: "How do I ship my old device to you?",
    answer:
      "Once you accept our offer, we provide a prepaid shipping label and instructions. Carefully pack your device and drop it off at the nearest courier location.",
  },
  {
    question:
      "What happens if my device doesn't match the provided details during inspection?",
    answer:
      "If there are discrepancies, we'll send you an updated offer. You can accept the new offer or request your device be returned free of charge.",
  },
  {
    question: "How long does the entire swapping process take?",
    answer:
      "Typically, the process takes 5-7 business days from shipping your device to receiving your new device or payment, depending on shipping and inspection times.",
  },
];

// Zustand store for FAQ open index
interface FaqStoreState {
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
}

const useFaqStore = create<FaqStoreState>((set) => ({
  openIndex: 0,
  setOpenIndex: (index) => set({ openIndex: index }),
}));

const FAQ = () => {
  const { openIndex, setOpenIndex } = useFaqStore();

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#037f44]">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800"
          >
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none cursor-pointer"
              onClick={() => toggleAccordion(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-body-${index}`}
              type="button"
            >
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {item.question}
              </span>
              <span className="ml-4 text-[#d7a825] text-xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div
                id={`faq-body-${index}`}
                className="px-6 pb-4 text-gray-700 dark:text-gray-300 animate-fade-in"
              >
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
