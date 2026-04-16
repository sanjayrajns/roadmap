"use client";

import { useState, useEffect } from 'react';
import Workspace from '@/components/workspace/Workspace';
import GeneratingScreen from '@/components/GeneratingScreen';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Layout, Server, Layers, BrainCircuit, Settings, Smartphone, Compass, 
  Sprout, Zap, Network, LayoutTemplate, Database, Bot, CloudCog, 
  MonitorPlay, FileText, Wrench, MousePointerClick, 
  Coffee, Clock, Timer, Rocket 
} from 'lucide-react';
import { AnimatedContainer } from '@/components/ui/grid-feature-cards';
import { Search, Filter, X } from 'lucide-react';
import { getStepContent, getOptionLabel } from '@/lib/onboarding-content';

const ROLE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'role', label: 'Careers' },
  { id: 'skill', label: 'Skills' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'data-ai', label: 'AI & Data' },
];

const ROLES = [
  // Role-Based
  { id: 'frontend', label: 'Frontend Developer', icon: Layout, category: 'role' },
  { id: 'backend', label: 'Backend Developer', icon: Server, category: 'role' },
  { id: 'fullstack', label: 'Full Stack Developer', icon: Layers, category: 'role' },
  { id: 'devops', label: 'DevOps Engineer', icon: Settings, category: 'role' },
  { id: 'ai-engineer', label: 'AI Engineer', icon: BrainCircuit, category: 'data-ai' },
  { id: 'data-scientist', label: 'AI & Data Scientist', icon: Bot, category: 'data-ai' },
  { id: 'android', label: 'Android Developer', icon: Smartphone, category: 'role' },
  { id: 'ios', label: 'iOS Developer', icon: Smartphone, category: 'role' },
  { id: 'software-architect', label: 'Software Architect', icon: Network, category: 'role' },
  { id: 'cyber-security', icon: Settings, label: 'Cyber Security', category: 'role' },
  { id: 'ux-design', icon: Layout, label: 'UX Designer', category: 'role' },
  { id: 'qa', icon: Settings, label: 'QA Engineer', category: 'role' },
  { id: 'blockchain', icon: Network, label: 'Blockchain Developer', category: 'role' },
  
  // Skill-Based
  { id: 'react', label: 'React', icon: LayoutTemplate, category: 'skill' },
  { id: 'vue', label: 'Vue.js', icon: LayoutTemplate, category: 'skill' },
  { id: 'angular', label: 'Angular', icon: LayoutTemplate, category: 'skill' },
  { id: 'javascript', label: 'JavaScript', icon: FileText, category: 'skill' },
  { id: 'typescript', label: 'TypeScript', icon: FileText, category: 'skill' },
  { id: 'node', label: 'Node.js', icon: Server, category: 'skill' },
  { id: 'python', label: 'Python', icon: FileText, category: 'skill' },
  { id: 'java', label: 'Java', icon: Server, category: 'skill' },
  { id: 'go', label: 'Go', icon: Server, category: 'skill' },
  { id: 'rust', label: 'Rust', icon: Settings, category: 'skill' },
  { id: 'sql', label: 'SQL', icon: Database, category: 'skill' },
  { id: 'postgresql', label: 'PostgreSQL', icon: Database, category: 'skill' },
  { id: 'mongodb', label: 'MongoDB', icon: Database, category: 'skill' },
  { id: 'aws', label: 'AWS', icon: CloudCog, category: 'skill' },
  { id: 'docker', label: 'Docker', icon: Settings, category: 'skill' },
  { id: 'kubernetes', label: 'Kubernetes', icon: Network, category: 'skill' },
  { id: 'nextjs', label: 'Next.js', icon: Layers, category: 'skill' },
  { id: 'prompt-engineering', label: 'Prompt Engineering', icon: BrainCircuit, category: 'data-ai' },
  
  // Beginners
  { id: 'frontend-beginner', label: 'Frontend Beginner', icon: Sprout, category: 'beginner' },
  { id: 'backend-beginner', label: 'Backend Beginner', icon: Sprout, category: 'beginner' },
  { id: 'devops-beginner', label: 'DevOps Beginner', icon: Sprout, category: 'beginner' },
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
  const [step, setStep] = useState(0); 
  const [formData, setFormData] = useState({
    role_goal: '',
    experience_level: '',
    interest_area: '',
    learning_style: '',
    time_commitment: 0,
  });
  const [loading, setLoading] = useState(false);
  const [uiPayload, setUiPayload] = useState<{roadmap: any, resources: any[], progress: any} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredRoles = ROLES.filter(role => {
    const matchesSearch = role.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || role.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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

  if (loading) {
    return (
      <GeneratingScreen
        role={formData.role_goal}
        experience={formData.experience_level}
        interest={formData.interest_area}
        learningStyle={formData.learning_style}
        timeCommitment={formData.time_commitment}
      />
    );
  }

  if (uiPayload) {
    return (
      <Workspace
        roadmap={uiPayload.roadmap}
        resources={uiPayload.resources}
        initialProgress={uiPayload.progress}
      />
    );
  }

  const stepContent = getStepContent(formData.role_goal, step);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      {step === 0 ? (
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
        <div className="w-full max-w-5xl mx-auto py-12">
          <AnimatedContainer className="text-center mb-8">
            <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4 block">Step 1 of 5</span>
            <h2 className="text-3xl md:text-5xl font-thin tracking-tight text-zinc-900">What do you want to learn?</h2>
            <p className="text-zinc-500 mt-4 text-lg">Select a target career or a specific skill to generate your roadmap.</p>
          </AnimatedContainer>

          {/* Search and Filters */}
          <AnimatedContainer delay={0.1} className="mb-10 space-y-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search roles or skills (e.g. React, Backend, AI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-none focus:outline-none focus:border-zinc-900 transition-colors text-lg"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {ROLE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                    activeCategory === cat.id
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </AnimatedContainer>

          <AnimatedContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRoles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelection(role.id)}
                  className="group relative flex flex-col items-center justify-center p-6 bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="mb-4 p-4 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-900 transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 text-center uppercase tracking-wide">{role.label}</h3>
                  <span className="text-[10px] text-zinc-400 mt-2 font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Select Path</span>
                </button>
              );
            })}
            {filteredRoles.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-zinc-400 text-lg">No matches found for "{searchQuery}"</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('all');}}
                  className="mt-4 text-sm font-bold text-zinc-900 uppercase underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </AnimatedContainer>
        </div>
      ) : step === 2 ? (
        <div className="w-full max-w-4xl mx-auto py-12 relative z-10 text-center">
          <div className="mb-12">
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4 block">Contextual Depth</span>
            <h2 className="text-3xl md:text-6xl font-thin tracking-tighter text-zinc-900">{stepContent.title}</h2>
            <p className="text-zinc-500 mt-4 text-lg font-light">{stepContent.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stepContent.options.map((exp: any) => {
              const Icon = exp.icon;
              return (
                <button
                  key={exp.id}
                  onClick={() => handleExperienceSelection(exp.id)}
                  className="group flex flex-col text-left p-8 bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="mb-6 self-start p-4 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-900 transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">{exp.label}</h3>
                  <p className="text-zinc-500 leading-relaxed font-light text-sm">{exp.description}</p>
                </button>
              );
            })}
          </div>
          
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
        <div className="w-full max-w-4xl mx-auto py-12 relative z-10 text-center">
          <div className="mb-12">
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4 block">Personalization</span>
            <h2 className="text-3xl md:text-6xl font-thin tracking-tighter text-zinc-900">{stepContent.title}</h2>
            <p className="text-zinc-500 mt-4 text-lg font-light">{stepContent.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stepContent.options.map((interest: any) => {
              const Icon = interest.icon;
              return (
                <button
                  key={interest.id}
                  onClick={() => handleInterestSelection(interest.id)}
                  className="group relative flex flex-col items-center justify-center p-8 bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="mb-4 p-4 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-900 transition-colors duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 text-center uppercase tracking-wider">{interest.label}</h3>
                </button>
              );
            })}
          </div>

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
        <div className="w-full max-w-4xl mx-auto py-12 relative z-10 text-center">
          <div className="mb-12">
            <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4 block">Learning Mode</span>
            <h2 className="text-3xl md:text-6xl font-thin tracking-tighter text-zinc-900">{stepContent.title}</h2>
            <p className="text-zinc-500 mt-4 text-lg font-light">{stepContent.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stepContent.options.map((style: any) => {
              const Icon = style.icon;
              return (
                <button
                  key={style.id}
                  onClick={() => handleLearningStyleSelection(style.id)}
                  className="group flex items-center text-left p-6 bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="mr-6 shrink-0 p-4 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-900 transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">{style.label}</h3>
                    <p className="text-zinc-500 font-light text-sm leading-relaxed">{style.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

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
                    {getOptionLabel(formData.role_goal, 2, formData.experience_level)}
                  </span>
                  <button type="button" onClick={() => setStep(2)} className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-zinc-900 uppercase underline opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-50/90 pl-2">Edit</button>
                </div>
                <div className="bg-zinc-50 p-4 border border-zinc-200 flex flex-col justify-center relative group">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">Interest</span>
                  <span className="text-sm font-bold text-zinc-900 truncate">
                    {getOptionLabel(formData.role_goal, 3, formData.interest_area)}
                  </span>
                  <button type="button" onClick={() => setStep(3)} className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-zinc-900 uppercase underline opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-50/90 pl-2">Edit</button>
                </div>
                <div className="bg-zinc-50 p-4 border border-zinc-200 flex flex-col justify-center relative group">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">Style</span>
                  <span className="text-sm font-bold text-zinc-900 truncate">
                    {getOptionLabel(formData.role_goal, 4, formData.learning_style)}
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
                    disabled={!formData.time_commitment}
                  >
                    Generate Roadmap
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
