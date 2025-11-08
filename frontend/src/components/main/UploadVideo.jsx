import React, { useState, useRef, useEffect } from "react";
import { FiActivity, FiPlusCircle, FiTrash2, FiVideo } from "react-icons/fi";

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [duration, setDuration] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const previewRef = useRef(null); // track current object URL so we can revoke it when replaced
  const fileInputRef = useRef(null);

  // disclaimers shown to the user
  const disclaimers = [
    "Uploaded videos and derived data may be stored for improving the service and auditing.",
    "Detection models are not 100% accurate - results are probabilistic guidance, not legal proof.",
  ];

  const reset = () => {
    setFile(null);
    // revoke any preview blob URL we previously created
    if (previewRef.current) {
      try {
        URL.revokeObjectURL(previewRef.current);
      } catch (e) {
        // ignore
      }
      previewRef.current = null;
    }
    setPreview(null);
    setDuration(null);
    setError(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (e) => {
    setError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    if (!f.type.startsWith("video/")) {
      setError("Please select a video file.");
      return;
    }

    const url = URL.createObjectURL(f);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.src = url;
    v.onloadedmetadata = () => {
      const secs = v.duration;
      setDuration(secs);
      if (secs > 30) {
        // too long — revoke the blob we created for the metadata check
        try {
          URL.revokeObjectURL(url);
        } catch (e) {}
        setError("Video is longer than 30 seconds. Please select a shorter clip.");
        return;
      }
      setFile(f);
      // revoke any previous preview URL and keep track of the new one
      if (previewRef.current) {
        try {
          URL.revokeObjectURL(previewRef.current);
        } catch (e) {}
      }
      previewRef.current = url;
      setPreview(url);
    };
    v.onerror = () => {
      setError("Could not read video metadata. Try a different file or browser.");
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    if (!file) {
      setError("Please choose a video before submitting.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("video", file);

      // send to backend analyze endpoint - adapt URL to your server
      const res = await fetch("/api/predict", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const data = await res.json();
      // expected: { label: 'fake'|'real', score: 0.92, details: '...' }
      setResult(data);
    } catch (err) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  console.log("Render UploadVideo", { file, preview, duration, error, uploading, result });

  // When the preview URL changes, ensure the <video> element reloads and
  // revoke the blob when the component unmounts.
  useEffect(() => {
    if (videoRef.current && preview) {
      // some browsers need an explicit load() to pick up a new object URL
      try {
        videoRef.current.load();
      } catch (e) {}
    }
    return () => {};
  }, [preview]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        try {
          URL.revokeObjectURL(previewRef.current);
        } catch (e) {}
        previewRef.current = null;
      }
    };
  }, []);

  return (
    <section className="w-full md:w-[80%] mx-auto px-10 md:px-4 py-8">
      <h1 className="text-5xl md:text-7xl text-center font-bold mt-5 flex items-center justify-center gap-1 md:gap-5 mb-8 text-purple-200">
        Upload a short video
        <FiVideo size={80} className="hidden md:block mt-1.5" />
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`w-full min-h-[200px] md:min-h-[250px] mb-5 bg-gray-800 rounded-xl flex flex-col justify-center items-center hover:shadow-lg hover:shadow-purple-400 transition duration-300 ${file ? "opacity-90 cursor-not-allowed" : ""}`}>
          <label
            htmlFor="input-video"
            className="flex flex-col font-medium items-center gap-2 cursor-pointer"
            title="Upload a video (max 30 seconds)"
          >
            <FiPlusCircle size={50} className="text-blue-400" />
            <span className="text-base md:text-xl">Upload a Video</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFile}
            ref={fileInputRef}
            className="hidden"
            id="input-video"
            disabled={uploading}
          />

          <p className="text-orange-300 font-medium mt-2">Maximum upload length: 30 seconds.</p>
        </div>

        {error && <div className="text-sm text-center text-red-600">{error}</div>}

        {preview && (
          <div className="w-full min-h-[200px] md:min-h-[250px] mt-7 mb-8 px-4 md:px-0 bg-gray-800 rounded-xl flex flex-col justify-center items-center hover:shadow-lg hover:shadow-purple-400 transition duration-300 ">
            <video
              key={preview}
              ref={videoRef}
              src={preview}
              controls
              onLoadedData={() => console.log('video onLoadedData, src=', videoRef.current && videoRef.current.currentSrc)}
              onError={(e) => { console.error('video preview error', e); setError('Preview failed to load the video file.'); }}
              className="w-full md:w-[80%] min-h-[200px] rounded-xl mx-auto mt-4"
            />
            {/* debug: show blob URL so you can inspect it in the page */}
            <p className="text-sm text-center text-gray-400 mt-2 break-all"><span className="font-semibold">Preview URL:</span> {preview}</p>
            <p className="text-sm text-center text-gray-400 my-5 rounded-xl"><span className="font-semibold">Duration:</span> {duration ? duration.toFixed(2) : "--"} seconds</p>
          </div>
        )}

        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            type="submit"
            disabled={uploading || !file}
            className="flex justify-center items-center text-base md:text-lg gap-2 px-4 py-2.5 rounded-md border font-bold border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white disabled:bg-gray-800 disabled:border-none disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiActivity size={22} />
            {uploading ? 'Analyzing…' : 'Analyze Video'}
          </button>

          <button type="button" onClick={reset} className="flex justify-center items-center text-base md:text-lg gap-2 px-4 py-2 rounded-md border font-bold border-red-600 text-red-600 bg-black hover:text-white hover:bg-red-600 cursor-pointer">
            <FiTrash2 size={22} />
            Clear
          </button>
        </div>
      </form>

      <div className="flex flex-col justify-center items-center my-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Important disclaimers</h2>
        <ul className="text-sm text-center text-gray-400 space-y-2">
          {disclaimers.map((d) => (
            <p key={d}>- {d}</p>
          ))}
        </ul>
      </div>

      {result && (
        <div className="w-full min-h-[200px] mb-5 bg-gray-100 rounded-xl flex flex-col justify-center items-center hover:border-2 hover:border-blue-500 transition duration-300">
          <h3 className="font-semibold">Result</h3>
          <p className="mt-2">Label: <strong>{result.label}</strong></p>
          {typeof result.score === 'number' && (
            <p>Confidence: {(result.score * 100).toFixed(1)}%</p>
          )}
          {result.details && <p className="mt-2 text-sm text-gray-500">{result.details}</p>}
        </div>
      )}

      <div className="w-full md:w-[65%] mx-auto mt-8 text-xs text-center px-6 py-5 md:px-2 md:py-2 rounded-full bg-gray-800 text-gray-200">
        <p>By uploading, you agree that DeepShield may store and use the uploaded video and derived metadata in accordance with our <a href="/privacy-policy" className="text-blue-400">Privacy Policy</a>.</p>
      </div>
    </section>
  );
};

export default UploadVideo;