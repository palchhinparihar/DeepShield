import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi'

const faqs = [
  {
    q: 'What is DeepShield?',
    a: 'DeepShield is an AI-based tool that detects whether a video has been digitally manipulated or created using deepfake techniques. It uses a hybrid deep learning model built with XceptionNet and GRU layers for temporal consistency analysis.',
  },
  {
    q: 'What type of videos can I upload?',
    a: 'You can upload short video clips (up to 30 seconds) for fast and accurate analysis. The system automatically extracts key frames to evaluate visual and motion inconsistencies.',
  },
  {
    q: 'Are my uploaded videos stored?',
    a: 'Uploaded videos are temporarily processed on our secure server. Anonymized data may be retained to improve model accuracy and audit fairness — but no personal data is ever shared.',
  },
  {
    q: 'How reliable are the results?',
    a: 'Our model performs strongly on benchmark datasets, but like all AI systems, it is probabilistic. Results provide a confidence score and should be used for awareness, not legal or forensic proof.',
  },
  {
    q: 'Can I request deletion of my data?',
    a: 'Yes. If you wish to remove your uploaded content or metadata, please contact our team at contact@deepshield.ai. We comply with standard data removal and privacy guidelines.',
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full md:w-[80%] mx-auto px-4 py-12">
      <h1 className="text-5xl md:text-7xl text-center font-bold flex items-center justify-center gap-1 md:gap-3 mb-10 text-purple-200">
        Frequently Asked Questions
        <FiHelpCircle size={80} className="hidden lg:block" />
      </h1>

      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div
            data-aos="fade-up"
            key={item.q}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl shadow-md transition-all duration-200"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left p-5 focus:outline-none"
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">{item.q}</h3>
              {openIndex === index ? (
                <FiChevronUp className="text-purple-500 cursor-pointer" size={22} />
              ) : (
                <FiChevronDown className="text-purple-500 cursor-pointer" size={22} />
              )}
            </button>

            <div
              className={`px-5 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed pb-5">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQ;