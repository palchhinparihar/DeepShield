import React from 'react'

const sections = [
  {
    title: 'Overview',
    body: 'DeepShield provides automated deepfake detection for short videos. We are committed to protecting your privacy while providing accurate analysis services.',
  },
  {
    title: 'What we collect',
    body: 'When you upload a video we may collect the video file, a generated analysis report (labels/scores), timestamps, and basic metadata (file size, format). We do not collect unrelated personal files from your device.',
  },
  {
    title: 'Storage and retention',
    body: 'Uploaded videos and derived data may be stored securely to improve models, audit results, and comply with legal obligations. Retention periods vary; you can request deletion as described below.',
  },
  {
    title: 'Usage limits and processing',
    body: 'Uploads are limited to 30 seconds per video. We process videos to produce a detection result and may keep anonymized data for research and model improvement.',
  },
  {
    title: 'Your rights',
    body: 'You may request access, correction, or deletion of your data. To submit a request, contact us at privacy@deepshield.example (replace with your support email). We will respond within a reasonable timeframe and in accordance with applicable law.',
  },
  {
    title: 'Security',
    body: 'We use industry-standard technical and organizational safeguards to protect stored data. However, no system is 100% secure; avoid uploading extremely sensitive content if concerned.',
  },
]

const PrivacyPolicy = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-6">
        {sections.map((s) => (
          <article key={s.title} className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="font-semibold mb-2">{s.title}</h2>
            <p className="text-sm text-gray-700">{s.body}</p>
          </article>
        ))}

        <article className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="font-semibold mb-2">Contact</h2>
          <p className="text-sm text-gray-700">If you have privacy questions or want to request deletion, email: <a href="mailto:privacy@deepshield.example" className="text-blue-600">palchhinparihar@gmail.com</a>.</p>
        </article>
      </div>
    </section>
  )
}

export default PrivacyPolicy