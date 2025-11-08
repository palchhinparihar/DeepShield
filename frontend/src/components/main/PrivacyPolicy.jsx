import React from 'react'
import { FiShield, FiLock } from 'react-icons/fi'

const sections = [
  {
    title: 'Overview',
    body: 'DeepShield is an AI-powered platform that detects deepfakes in short videos. We prioritize user privacy while providing reliable and transparent AI-based analysis services.',
  },
  {
    title: 'What We Collect',
    body: 'When you upload a video, we process and temporarily store the video file, analysis results (scores, labels), timestamps, and limited metadata such as duration and format. We do not access unrelated files on your device.',
  },
  {
    title: 'Storage and Retention',
    body: 'Videos and derived data are stored securely and may be retained briefly for quality assurance, research, and audit purposes. You can request deletion of your content at any time.',
  },
  {
    title: 'Usage and Processing',
    body: 'Uploads are limited to 30 seconds per video. Each upload is processed to generate a detection result. Only anonymized data may be used to retrain or improve DeepShield’s detection accuracy.',
  },
  {
    title: 'Your Rights',
    body: 'You can request access, correction, or deletion of your data at any time. To do so, contact us at privacy@deepshield.ai. We aim to respond promptly in accordance with privacy regulations.',
  },
  {
    title: 'Security Measures',
    body: 'We employ standard encryption, secure storage, and strict access control to protect your data. While we maintain high security standards, no system can be guaranteed 100% secure.',
  },
]

const PrivacyPolicy = () => {
  return (
    <section className="w-full md:w-[80%] mx-auto px-4 py-12">
      {/* Title Section */}
      <h1 className="text-5xl md:text-7xl text-center font-bold flex items-center justify-center gap-2 md:gap-3 mb-12 text-purple-200">
        Privacy Policy
        <FiLock size={70} className="hidden md:block" />
      </h1>

      {/* Card Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((s) => (
          <article
            key={s.title}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 md:p-8 hover:scale-105 transition-transform duration-300 group"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-purple-500 mb-3 flex items-center gap-2">
              <FiShield className="text-purple-500 group-hover:text-purple-700 group-hover:animate-bounce mt-1 shrink-0" size={30} />
              {s.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">{s.body}</p>
          </article>
        ))}
      </div>

      {/* Contact Card */}
      <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-purple-500 mb-2">Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
          If you have any privacy-related concerns, questions, or requests for data deletion, please contact us at{' '}
          <a href="mailto:palchhinparihar@gmail.com" className="text-blue-600">
            palchhinparihar@gmail.com
          </a>
          . We’re committed to transparency and quick responses.
        </p>
      </div>
    </section>
  )
}

export default PrivacyPolicy;