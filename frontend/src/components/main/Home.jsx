import { FiArrowRight, FiUnlock } from 'react-icons/fi';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      await loginWithRedirect({
        appState: { returnTo: '/upload' },
      });
    } else {
      navigate('/upload');
    }
  };

  return (
    <main>
      <div className="px-6 w-full min-h-[92vh] flex flex-col justify-center items-center">
        <h1 data-aos="fade-in" className="text-5xl md:text-7xl text-center font-bold flex items-center justify-center gap-1 md:gap-3 mb-8">
          Welcome to DeepShield
          <FiUnlock size={80} className="hidden md:block" />
        </h1>
        <p data-aos="fade-out" className="text-base md:text-lg text-center text-gray-400 mb-6">
          Upload videos and check if they are deepfakes (fake videos) or not.
        </p>
        <button
          data-aos="fade-up"
          onClick={handleStart}
          className="flex justify-center items-center gap-1.5 cursor-pointer text-base md:text-xl group border-2 border-purple-500 text-purple-500 px-4 py-2 rounded-xl font-bold hover:text-white hover:bg-purple-600 transition duration-300"
        >
          {isLoading ? "Starting" : "Start"}
          <FiArrowRight size={22} className="group-hover:animate-pulse" />
        </button>
      </div>
    </main>
  )
}