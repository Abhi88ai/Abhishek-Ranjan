
import React from 'react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'report' | 'dashboard') => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fa-solid fa-shield-halved text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
              Civic Cyber <span className="text-indigo-600">Crew</span>
            </span>
          </div>

          <nav className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                currentView === 'dashboard' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate('report')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Report Issue
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
