import React from 'react'
import { FiBookOpen, FiCheckCircle } from 'react-icons/fi'

const points = [
  'DeepShield is an AI-powered deepfake detection tool built to identify manipulated or synthetic media in seconds.',
  'The system uses advanced computer vision and temporal modeling techniques to analyze facial movements, textures, and inconsistencies across video frames.',
  'You can upload short videos (up to 30 seconds) for quick analysis - optimized for speed and accuracy on limited compute.',
  'Results include a confidence score and visual feedback to help you understand how authentic your content likely is.',
]

const About = () => {
  return (
    <section className="w-full md:w-[80%] mx-auto px-4 py-12">
      <h1 data-aos="fade-in" className="text-5xl md:text-7xl text-center font-bold flex items-center justify-center gap-1 md:gap-5 mb-8 text-purple-200">
        About DeepShield
        <FiBookOpen size={80} className="hidden lg:block" />
      </h1>

      <div>
        <div data-aos="fade-out" className="bg-white dark:bg-gray-800 shadow-md rounded-lg pt-10 pb-8 text-center px-5">
          <p className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            DeepShield empowers individuals, journalists, and organizations to verify the authenticity of digital media in an age of misinformation.
          </p>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Using an AI model inspired by <strong>XceptionNet</strong> and <strong>GRU</strong> architectures, DeepShield captures both spatial and temporal cues from video sequences to detect deepfakes with high precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 my-10">
          {points.map((p, index) => (
            <article
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              key={p}
            >
              <div
                className="bg-gray-50 h-full dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 md:p-8 min-h-[120px] flex items-start gap-4 hover:scale-105 transition-transform duration-300 group"
              >
                <FiCheckCircle className="text-purple-500 group-hover:text-purple-700 group-hover:animate-bounce mt-1 shrink-0" size={30} />
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300">{p}</p>
              </div>
            </article>
          ))}
        </div>

        <div data-aos="fade-in" className="text-sm md:text-base text-gray-700 dark:text-gray-300">
          <p>
            <strong>How it works:</strong> DeepShield extracts key frames from your video, processes them through a
            convolutional and recurrent neural network pipeline, and outputs a confidence score between <strong>0 (real)</strong> and <strong>1 (fake)</strong>.
            The entire inference runs on our optimized backend for rapid results.
          </p>

          <p className="mt-2">
            <strong>Transparency:</strong> This tool is designed for awareness and educational use - it does not store user videos permanently.
            Only anonymized metadata may be used to improve detection accuracy over time.
          </p>

          <p className="mt-2">
            <strong>Contact:</strong> Have feedback or partnership ideas? Reach out at{" "}
            <a href="mailto:palchhinparihar@gmail.com" className="text-blue-500">
              palchhinparihar@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

export default About;