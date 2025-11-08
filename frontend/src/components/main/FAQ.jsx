import React from 'react'

const faqs = [
  {
    q: 'What does DeepShield do?',
    a: 'DeepShield analyzes short videos (up to 30 seconds) to detect whether a video contains deepfake content using our trained ML models.',
  },
  {
    q: 'How long can the uploaded video be?',
    a: 'Videos must be 30 seconds or shorter. Longer videos are rejected to keep analysis quick and to limit storage requirements.',
  },
  {
    q: 'Is my video stored?',
    a: 'Yes — to improve our services and for audit/review purposes we may store uploaded videos and related metadata. See our Privacy Policy for details on retention and deletion.',
  },
  {
    q: 'How accurate is the detection?',
    a: 'Accuracy depends on many factors (quality, compression, lighting). We continuously improve models but do not guarantee 100% accuracy. Results should be used as guidance, not definitive proof.',
  },
  {
    q: 'Can I delete my data?',
    a: 'Yes. Contact us via the email provided in the Privacy Policy and we will process data deletion requests in accordance with our policy and applicable laws.',
  },
]

const FAQ = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((item) => (
          <div key={item.q} className="border rounded-md p-4 bg-white shadow-sm">
            <h3 className="font-semibold">{item.q}</h3>
            <p className="mt-2 text-sm text-gray-700">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQ