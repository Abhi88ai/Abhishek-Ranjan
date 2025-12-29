
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import PublicDashboard from './components/PublicDashboard';
import { CivicIssue, IssueStatus, IssuePriority } from './types';

const MOCK_ISSUES: CivicIssue[] = [
  {
    id: '1',
    type: 'Illegal Dumping',
    priority: IssuePriority.HIGH,
    status: IssueStatus.IN_PROGRESS,
    department: 'Sanitation',
    summary: 'Accumulated construction debris blocking sidewalk',
    location: '40.7128, -74.0060',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    confidence: 0.95
  },
  {
    id: '2',
    type: 'Broken Streetlight',
    priority: IssuePriority.MEDIUM,
    status: IssueStatus.RESOLVED,
    department: 'Utilities',
    summary: 'Single streetlight flickering near bus stop',
    location: '40.7306, -73.9352',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    confidence: 0.88
  },
  {
    id: '3',
    type: 'Water Leak',
    priority: IssuePriority.CRITICAL,
    status: IssueStatus.REPORTED,
    department: 'Water Dept',
    summary: 'Main pipe burst causing street flooding',
    location: '40.6782, -73.9442',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    confidence: 0.99
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'report' | 'dashboard'>('home');
  const [issues, setIssues] = useState<CivicIssue[]>(() => {
    const saved = localStorage.getItem('civic_issues');
    return saved ? JSON.parse(saved) : MOCK_ISSUES;
  });

  useEffect(() => {
    localStorage.setItem('civic_issues', JSON.stringify(issues));
  }, [issues]);

  const handleReportSuccess = (newIssue: CivicIssue) => {
    setIssues(prev => [newIssue, ...prev]);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={setView} currentView={view} />
      
      <main className="flex-grow">
        {view === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                  AI POWERED CIVIC RESPONSE
                </div>
                <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Your City's Problems, <br />
                  <span className="text-indigo-600">Fixed with AI.</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Civic Cyber Crew uses advanced AI to instantly understand, prioritize, and route city issues to the right authorities. Report in seconds, track in real-time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => setView('report')}
                    className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 text-lg"
                  >
                    Report an Issue
                  </button>
                  <button 
                    onClick={() => setView('dashboard')}
                    className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 hover:-translate-y-1 transition-all active:scale-95 text-lg"
                  >
                    View Public Dashboard
                  </button>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">30s</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Report Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">92%</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">AI Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">24/7</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Monitoring</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="absolute -inset-4 bg-indigo-100 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <i className="fa-solid fa-user text-slate-400"></i>
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-50 rounded-full w-1/2"></div>
                      </div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">AI Analysis Result</span>
                        <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">98% Match</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">Verified: Pothole (Critical)</p>
                      <p className="text-xs text-slate-500">Route: Municipal Roads Dept • Queue: High Priority</p>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-600 h-full w-[85%]"></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <img src="https://picsum.photos/seed/pothole/400/300" alt="Demo" className="rounded-xl w-full h-32 object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {view === 'report' && (
            <div className="animate-slideUp">
              <ReportForm 
                onSuccess={handleReportSuccess} 
                onCancel={() => setView('home')} 
              />
            </div>
          )}
          
          {view === 'dashboard' && (
            <PublicDashboard issues={issues} />
          )}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <i className="fa-solid fa-shield-halved text-white text-xl"></i>
                <span className="text-white font-bold text-xl">Civic Cyber Crew</span>
              </div>
              <p className="text-sm max-w-xs">
                Empowering citizens to report urban issues instantly using the power of Generative AI.
              </p>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-center">
            &copy; 2024 Civic Cyber Crew. Powered by Google Gemini AI.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
