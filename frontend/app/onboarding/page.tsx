"use client";

import { useState } from 'react';
import RoadmapView from '@/components/RoadmapView';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Layout, Server, Layers, BrainCircuit, Settings, Smartphone, Compass, 
  Sprout, Zap, Network, LayoutTemplate, Database, Bot, CloudCog, 
  MonitorPlay, FileText, Wrench, MousePointerClick, 
  Coffee, Clock, Timer, Rocket 
} from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/grid-feature-cards';

const ROLES = [
  { id: 'frontend', label: 'Frontend Developer', icon: Layout },
  { id: 'backend', label: 'Backend Developer', icon: Server },
  { id: 'fullstack', label: 'Full Stack Developer', icon: Layers },
  { id: 'ai', label: 'AI Engineer', icon: BrainCircuit },
  { id: 'devops', label: 'DevOps Engineer', icon: Settings },
  { id: 'mobile', label: 'Mobile Developer', icon: Smartphone },
  { id: 'unsure', label: 'Not sure yet', icon: Compass },
];

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'Includes core fundamentals and foundational programming concepts.', icon: Sprout },
  { id: 'intermediate', label: 'Intermediate', description: 'Skips basic topics. Jumps straight into frameworks and advanced tooling.', icon: Zap },
  { id: 'advanced', label: 'Advanced', description: 'Heavily includes system design, architecture, and scaling principles.', icon: Network },
];

const INTEREST_AREAS = [
  { id: 'web_interfaces', label: 'Building web interfaces', icon: LayoutTemplate },
  { id: 'apis_servers', label: 'Working with APIs & servers', icon: Database },
  { id: 'ml_ai', label: 'Machine learning & AI', icon: Bot },
  { id: 'infra_deploy', label: 'Infrastructure & deployment', icon: CloudCog },
  { id: 'mobile_apps', label: 'Mobile apps', icon: Smartphone },
];

const LEARNING_STYLES = [
  { id: 'video', label: 'Watching videos', description: 'High-quality YouTube courses and visual walkthroughs.', icon: MonitorPlay },
  { id: 'documentation', label: 'Reading docs', description: 'Deep-dives into official documentation and texts.', icon: FileText },
  { id: 'project_based', label: 'Building projects', description: 'Project-based tutorials focused on building real apps.', icon: Wrench },
  { id: 'interactive', label: 'Interactive', description: 'Hands-on quizzes and interactive learning environments.', icon: MousePointerClick },
];

const TIME_COMMITMENTS = [
  { id: 5, label: '1–5 hours', description: 'Slower, relaxed pacing', icon: Coffee },
  { id: 10, label: '5–10 hours', description: 'Steady, consistent progress', icon: Clock },
  { id: 20, label: '10–20 hours', description: 'Fast, accelerated progression', icon: Timer },
  { id: 40, label: '20+ hours', description: 'Intense immersive learning', icon: Rocket },
];

export default function Onboarding() {
  const [step, setStep] = useState(0); // 0: Start, 1: Role, 2: Experience, 3: Interest, 4: Style, 5: Time Commitment
  const [formData, setFormData] = useState({
    role_goal: '',
    experience_level: '',
    interest_area: '',
    learning_style: '',
    time_commitment: 0, // initially 0 or not selected
  });
  const [loading, setLoading] = useState(false);
  const [uiPayload, setUiPayload] = useState<{roadmap: any, resources: any[], progress: any} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time_commitment) {
      alert("Please select a time commitment to proceed.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setUiPayload(data);
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = (roleId: string) => {
    setFormData({ ...formData, role_goal: roleId });
    setStep(2);
  };

  const handleExperienceSelection = (expId: string) => {
    setFormData({ ...formData, experience_level: expId });
    setStep(3);
  };

  const handleInterestSelection = (intId: string) => {
    setFormData({ ...formData, interest_area: intId });
    setStep(4);
  };

  const handleLearningStyleSelection = (styleId: string) => {
    setFormData({ ...formData, learning_style: styleId });
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      {uiPayload ? (
        <div className="w-full max-w-7xl mx-auto py-12">
           <RoadmapView roadmap={uiPayload.roadmap} />
        </div>
      ) : step === 0 ? (
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <AnimatedContainer>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-thin tracking-tight text-zinc-900 text-balance">
              Build Your Developer Roadmap
            </h1>
            <p className="text-xl md:text-2xl text-zinc-500 leading-relaxed mt-8 max-w-2xl mx-auto">
              Answer a few quick questions and get a personalized learning roadmap with curated resources.
            </p>
          </AnimatedContainer>
          <AnimatedContainer delay={0.2} className="pt-8 relative z-20">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center rounded-none bg-zinc-900 text-white px-10 py-6 font-thin text-xl hover:bg-zinc-800 transition-colors shadow-2xl shadow-zinc-900/20"
            >
              Start
              <ArrowRight className="ml-3 w-6 h-6" />
            </button>
          </AnimatedContainer>
        </div>
      ) : step === 1 ? (
        <div className="w-full max-w-4xl mx-auto py-12">
          <AnimatedContainer className="text-center mb-12">
            <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 block">Step 1 of 5</span>
            <h2 className="text-3xl md:text-5xl font-thin tracking-tight text-zinc-900">What role do you want to become?</h2>
            <p className="text-zinc-500 mt-4 text-lg">Select your target career path to customize the curriculum.</p>
          </AnimatedContainer>

          <AnimatedContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelection(role.id)}
                  className="group relative flex flex-col items-center justify-center p-8 bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="mb-4 p-4 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-900 transition-colors duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 text-center">{role.label}</h3>
                  {role.id === 'unsure' && (
                    <span className="text-xs text-zinc-400 mt-2 font-medium tracking-wide uppercase">We'll help you decide</span>
                  )}
                </button>
              );
            })}
          </AnimatedContainer>
        </div>
      ) : step === 2 ? (
        <div className="w-full max-w-4xl mx-auto py-12">
          <AnimatedContainer className="text-center mb-12">
            <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 block">Step 2 of 5</span>
            <h2 className="text-3xl md:text-5xl font-thin tracking-tight text-zinc-900">What is your experience level?</h2>
            <p className="text-zinc-500 mt-4 text-lg">This determines the fundamental depth of your roadmap.</p>
          </AnimatedContainer>

          <AnimatedContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXPERIENCE_LEVELS.map((exp) => {
              const Icon = exp.icon;
              return (
                <button
                  key={exp.id}
                  onClick={() => handleExperienceSelection(exp.id)}
                  className="group flex flex-col text-left p-8 bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="mb-6 self-start p-4 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-900 transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">{exp.label}</h3>
                  <p className="text-zinc-500 leading-relaxed font-light">{exp.description}</p>
                </button>
              );
            })}
          </AnimatedContainer>
          
          <AnimatedContainer delay={0.3} className="mt-12 text-center">
            <button 
              onClick={() => setStep(1)}
              className="text-sm font-bold tracking-widest text-zinc-400 uppercase underline hover:text-zinc-900 transition-colors"
            >
              Back to Role Selection
            </button>
          </AnimatedContainer>
        </div>
      ) : step === 3 ? (
        <div className="w-full max-w-4xl mx-auto py-12">
          <AnimatedContainer className="text-center mb-12">
            <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 block">Step 3 of 5</span>
            <h2 className="text-3xl md:text-5xl font-thin tracking-tight text-zinc-900">What interests you the most?</h2>
            <p className="text-zinc-500 mt-4 text-lg">This helps us refine your roadmap with powerful specializations.</p>
          </AnimatedContainer>

          <AnimatedContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INTEREST_AREAS.map((interest) => {
              const Icon = interest.icon;
              return (
                <button
                  key={interest.id}
                  onClick={() => handleInterestSelection(interest.id)}
                  className="group relative flex flex-col items-center justify-center p-8 bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="mb-4 p-4 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-900 transition-colors duration-300 rounded-full">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 text-center">{interest.label}</h3>
                </button>
              );
            })}
          </AnimatedContainer>

          <AnimatedContainer delay={0.3} className="mt-12 text-center">
            <button 
              onClick={() => setStep(2)}
              className="text-sm font-bold tracking-widest text-zinc-400 uppercase underline hover:text-zinc-900 transition-colors"
            >
              Back to Experience Level
            </button>
          </AnimatedContainer>
        </div>
      ) : step === 4 ? (
        <div className="w-full max-w-4xl mx-auto py-12">
          <AnimatedContainer className="text-center mb-12">
            <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 block">Step 4 of 5</span>
            <h2 className="text-3xl md:text-5xl font-thin tracking-tight text-zinc-900">How do you prefer learning?</h2>
            <p className="text-zinc-500 mt-4 text-lg">We map exact resources based on how you consume information.</p>
          </AnimatedContainer>

          <AnimatedContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEARNING_STYLES.map((style) => {
              const Icon = style.icon;
              return (
                <button
                  key={style.id}
                  onClick={() => handleLearningStyleSelection(style.id)}
                  className="group flex items-center text-left p-6 bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="mr-6 shrink-0 p-4 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-900 transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">{style.label}</h3>
                    <p className="text-zinc-500 font-light text-sm">{style.description}</p>
                  </div>
                </button>
              );
            })}
          </AnimatedContainer>

          <AnimatedContainer delay={0.3} className="mt-12 text-center">
            <button 
              onClick={() => setStep(3)}
              className="text-sm font-bold tracking-widest text-zinc-400 uppercase underline hover:text-zinc-900 transition-colors"
            >
              Back to Interest Area
            </button>
          </AnimatedContainer>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto py-12">
          <AnimatedContainer className="text-center mb-10">
            <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 block">Step 5 of 5</span>
            <h2 className="text-3xl md:text-5xl font-thin tracking-tight text-zinc-900">Time Commitment</h2>
            <p className="text-zinc-500 mt-4 text-lg">Define your learning pace to generate a perfectly constrained path.</p>
          </AnimatedContainer>

          <AnimatedContainer delay={0.2}>
            <div className="bg-white shadow-xl shadow-zinc-200/50 border border-zinc-200 rounded-none p-8 md:p-10 relative z-20">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-10">
                <div className="bg-zinc-50 p-4 border border-zinc-200 flex flex-col justify-center relative group">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">Role</span>
                  <span className="text-sm font-bold text-zinc-900 truncate">
                    {ROLES.find(r => r.id === formData.role_goal)?.label || 'Not Selected'}
                  </span>
                  <button type="button" onClick={() => setStep(1)} className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-zinc-900 uppercase underline opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-50/90 pl-2">Edit</button>
                </div>
                <div className="bg-zinc-50 p-4 border border-zinc-200 flex flex-col justify-center relative group">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">XP</span>
                  <span className="text-sm font-bold text-zinc-900 truncate">
                    {EXPERIENCE_LEVELS.find(e => e.id === formData.experience_level)?.label || 'Not Selected'}
                  </span>
                  <button type="button" onClick={() => setStep(2)} className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-zinc-900 uppercase underline opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-50/90 pl-2">Edit</button>
                </div>
                <div className="bg-zinc-50 p-4 border border-zinc-200 flex flex-col justify-center relative group">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">Interest</span>
                  <span className="text-sm font-bold text-zinc-900 truncate">
                    {INTEREST_AREAS.find(i => i.id === formData.interest_area)?.label || 'Not Selected'}
                  </span>
                  <button type="button" onClick={() => setStep(3)} className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-zinc-900 uppercase underline opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-50/90 pl-2">Edit</button>
                </div>
                <div className="bg-zinc-50 p-4 border border-zinc-200 flex flex-col justify-center relative group">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">Style</span>
                  <span className="text-sm font-bold text-zinc-900 truncate">
                    {LEARNING_STYLES.find(l => l.id === formData.learning_style)?.label || 'Not Selected'}
                  </span>
                  <button type="button" onClick={() => setStep(4)} className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-zinc-900 uppercase underline opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-50/90 pl-2">Edit</button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TIME_COMMITMENTS.map((time) => {
                    const Icon = time.icon;
                    const isSelected = formData.time_commitment === time.id;
                    return (
                      <button
                        type="button"
                        key={time.id}
                        onClick={() => setFormData({...formData, time_commitment: time.id})}
                        className={`group relative flex flex-col items-start p-6 border transition-all duration-300 text-left ${
                          isSelected 
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20' 
                            : 'bg-white border-zinc-200 hover:border-zinc-900 text-zinc-900 shadow-sm hover:shadow-md hover:-translate-y-1'
                        }`}
                      >
                        <div className={`mb-4 p-3 rounded-none transition-colors duration-300 ${
                          isSelected ? 'bg-white/10 text-white' : 'bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-900'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">{time.label}</h3>
                        <p className={`text-sm font-light leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>{time.description}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full py-7 text-xl font-thin rounded-none bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-2xl shadow-zinc-900/20 h-auto"
                    disabled={loading || !formData.time_commitment}
                  >
                    {loading ? 'Synthesizing Path...' : 'Generate Roadmap'}
                  </Button>
                </div>
              </form>
            </div>
          </AnimatedContainer>
        </div>
      )}
    </div>
  );
}
