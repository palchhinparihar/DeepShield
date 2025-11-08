import React from 'react'

const points = [
  'DeepShield is an AI-first tool that helps detect manipulated (deepfake) videos quickly and reliably.',
  'Users can upload videos up to 30 seconds long for analysis. Short duration helps keep processing fast and storage minimal.',
  'Results are probabilistic — the tool provides a detection score and a short explanation, but is not a legal determination.',
  'Uploaded videos and derived metadata may be stored to improve the service and to provide audit trails; see Privacy Policy for details.',
]

const About = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">About DeepShield</h1>
      <p className="text-sm text-gray-700 mb-6">DeepShield uses state-of-the-art machine learning models to analyze short video clips and detect signs of manipulation. Our goal is to provide an easy-to-use, fast analysis tool to help people and organizations spot potential deepfakes.</p>

      <ul className="list-disc pl-5 space-y-3">
        {points.map((p) => (
          <li key={p} className="text-sm text-gray-700">{p}</li>
        ))}
      </ul>

      <div className="mt-6 text-sm text-gray-700">
        <p><strong>How it works:</strong> We extract frames and features from the uploaded video, run them through trained detection models, and produce a score and short rationale for the result.</p>
        <p className="mt-2"><strong>Upload limits:</strong> Videos must be 30 seconds or shorter. The UI enforces this limit and longer uploads will be rejected client-side.</p>
        <p className="mt-2"><strong>Contact:</strong> For support, email <a href="mailto:support@deepshield.example" className="text-blue-600">support@deepshield.example</a>.</p>
      </div>
    </section>
  )
}

export default About