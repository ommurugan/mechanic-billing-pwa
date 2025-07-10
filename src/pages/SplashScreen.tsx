
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        navigate('/auth');
      }, 500); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center animate-fade-in px-4">
        <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-2xl animate-scale-in p-4">
          <img 
            src="/lovable-uploads/79150a38-d99d-4155-a317-dc31ab547426.png" 
            alt="OM MURUGAN AUTO WORKS" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">OM MURUGAN</h1>
        <p className="text-lg md:text-xl text-blue-100">AUTO BILL GURU</p>
        <div className="mt-8">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
