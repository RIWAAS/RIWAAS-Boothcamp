import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Heart, Brain, Zap, Moon, Sun, Wind, Waves, TreePine, Mountain } from 'lucide-react';
import { User } from '../types';

interface DhyanProps {
  user: User | null;
}

interface MeditationSession {
  id: string;
  name: string;
  duration: number;
  type: 'breathing' | 'mindfulness' | 'sleep' | 'focus' | 'stress-relief' | 'body-scan';
  description: string;
  audioUrl?: string;
  icon: React.ComponentType<any>;
  color: string;
  bgGradient: string;
}

interface AmbientSound {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  audioUrl: string;
  color: string;
}

const Dhyan: React.FC<DhyanProps> = ({ user }) => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAmbient, setSelectedAmbient] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState(10);
  const [showCustomTimer, setShowCustomTimer] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  const meditationSessions: MeditationSession[] = [
    {
      id: '1',
      name: 'Deep Breathing',
      duration: 5,
      type: 'breathing',
      description: 'Focus on your breath to calm your mind and reduce stress',
      icon: Wind,
      color: 'text-blue-600',
      bgGradient: 'from-blue-400 to-cyan-400',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: '2',
      name: 'Mindful Awareness',
      duration: 10,
      type: 'mindfulness',
      description: 'Develop present-moment awareness and mental clarity',
      icon: Brain,
      color: 'text-purple-600',
      bgGradient: 'from-purple-400 to-pink-400',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: '3',
      name: 'Sleep Meditation',
      duration: 15,
      type: 'sleep',
      description: 'Gentle guidance to help you fall asleep peacefully',
      icon: Moon,
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-400 to-purple-400',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: '4',
      name: 'Focus Enhancement',
      duration: 20,
      type: 'focus',
      description: 'Sharpen your concentration and mental focus',
      icon: Zap,
      color: 'text-yellow-600',
      bgGradient: 'from-yellow-400 to-orange-400',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: '5',
      name: 'Stress Relief',
      duration: 12,
      type: 'stress-relief',
      description: 'Release tension and find inner peace',
      icon: Heart,
      color: 'text-green-600',
      bgGradient: 'from-green-400 to-emerald-400',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: '6',
      name: 'Body Scan',
      duration: 25,
      type: 'body-scan',
      description: 'Progressive relaxation through body awareness',
      icon: Sun,
      color: 'text-orange-600',
      bgGradient: 'from-orange-400 to-red-400',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    }
  ];

  const ambientSounds: AmbientSound[] = [
    {
      id: 'rain',
      name: 'Rain',
      icon: Waves,
      audioUrl: 'https://www.soundjay.com/misc/sounds/rain-01.wav',
      color: 'text-blue-500'
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      icon: Waves,
      audioUrl: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.wav',
      color: 'text-cyan-500'
    },
    {
      id: 'forest',
      name: 'Forest',
      icon: TreePine,
      audioUrl: 'https://www.soundjay.com/misc/sounds/forest-1.wav',
      color: 'text-green-500'
    },
    {
      id: 'mountain',
      name: 'Mountain Wind',
      icon: Mountain,
      audioUrl: 'https://www.soundjay.com/misc/sounds/wind-1.wav',
      color: 'text-gray-500'
    }
  ];

  useEffect(() => {
    if (isPlaying && selectedSession) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const totalDuration = showCustomTimer ? customDuration * 60 : selectedSession.duration * 60;
          
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, selectedSession, customDuration, showCustomTimer]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAmbientSound = (soundId: string) => {
    if (selectedAmbient === soundId) {
      setSelectedAmbient(null);
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
    } else {
      setSelectedAmbient(soundId);
      const sound = ambientSounds.find(s => s.id === soundId);
      if (sound && ambientAudioRef.current) {
        ambientAudioRef.current.src = sound.audioUrl;
        ambientAudioRef.current.loop = true;
        ambientAudioRef.current.play().catch(console.error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!selectedSession) return 0;
    const totalDuration = showCustomTimer ? customDuration * 60 : selectedSession.duration * 60;
    return (currentTime / totalDuration) * 100;
  };

  const totalDuration = selectedSession ? (showCustomTimer ? customDuration * 60 : selectedSession.duration * 60) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse-custom">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-30 animate-pulse-custom"></div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            DHYAN Meditation
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Find inner peace and mental clarity through guided meditation
          </p>
          <div className="mt-4 sm:mt-6 text-sm sm:text-base text-purple-600 dark:text-purple-400 font-medium">
            Welcome back, {user?.name || 'Mindful Soul'} 🧘‍♀️
          </div>
        </div>

        {!selectedSession ? (
          <>
            {/* Meditation Sessions Grid */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 lg:mb-8 text-center">
                Choose Your Practice
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {meditationSessions.map((session, index) => {
                  const Icon = session.icon;
                  return (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${session.bgGradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className="relative p-4 sm:p-6 lg:p-8 text-white">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{session.duration} min</span>
                          </div>
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                          {session.name}
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed">
                          {session.description}
                        </p>
                        <div className="mt-4 sm:mt-6 flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 capitalize">
                            {session.type.replace('-', ' ')}
                          </span>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Timer Section */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8 sm:mb-12">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                Custom Meditation Timer
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                    Duration:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(parseInt(e.target.value) || 10)}
                    className="w-16 sm:w-20 px-2 sm:px-3 py-1 sm:py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                  />
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">minutes</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedSession({
                      id: 'custom',
                      name: 'Custom Timer',
                      duration: customDuration,
                      type: 'mindfulness',
                      description: 'Your personalized meditation session',
                      icon: Clock,
                      color: 'text-purple-600',
                      bgGradient: 'from-purple-400 to-indigo-400'
                    });
                    setShowCustomTimer(true);
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  Start Custom Session
                </button>
              </div>
            </div>

            {/* Ambient Sounds */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                Ambient Sounds
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {ambientSounds.map((sound) => {
                  const Icon = sound.icon;
                  const isActive = selectedAmbient === sound.id;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => handleAmbientSound(sound.id)}
                      className={`group relative p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                        isActive
                          ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-xl'
                          : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${isActive ? 'text-white' : sound.color}`} />
                        <span className="text-xs sm:text-sm lg:text-base font-medium text-center">
                          {sound.name}
                        </span>
                        {isActive && (
                          <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-white/50 animate-pulse-custom"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Meditation Player */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/20 dark:border-gray-700/20">
              {/* Session Header */}
              <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${selectedSession.bgGradient} rounded-full flex items-center justify-center shadow-xl`}>
                    <selectedSession.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                  {selectedSession.name}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 px-4">
                  {selectedSession.description}
                </p>
              </div>

              {/* Progress Circle */}
              <div className="flex items-center justify-center mb-6 sm:mb-8 lg:mb-12">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                      className={`${selectedSession.color} transition-all duration-1000 ease-out`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                      {formatTime(totalDuration - currentTime)}
                    </div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400">
                      remaining
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 lg:space-x-8 mb-6 sm:mb-8">
                <button
                  onClick={handleReset}
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-lg"
                >
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-600 dark:text-gray-300" />
                </button>
                
                <button
                  onClick={handlePlayPause}
                  className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${selectedSession.bgGradient} rounded-full flex items-center justify-center hover:shadow-2xl transition-all transform hover:scale-105 shadow-xl`}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                  ) : (
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white ml-1" />
                  )}
                </button>
                
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-lg"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </div>

              {/* Back Button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setSelectedSession(null);
                    setIsPlaying(false);
                    setCurrentTime(0);
                    setShowCustomTimer(false);
                  }}
                  className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
                >
                  ← Back to Sessions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Audio Element */}
        <audio ref={ambientAudioRef} className="hidden" />
      </div>
    </div>
  );
};

export default Dhyan;