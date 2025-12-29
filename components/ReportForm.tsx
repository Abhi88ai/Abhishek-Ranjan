
import React, { useState, useRef } from 'react';
import { analyzeIssue } from '../services/geminiService';
import { CivicIssue, IssueStatus, IssuePriority } from '../types';

interface ReportFormProps {
  onSuccess: (issue: CivicIssue) => void;
  onCancel: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSuccess, onCancel }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState('Detecting location...');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      }, () => {
        setLocation('Location unavailable');
      });
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      const aiResult = await analyzeIssue(description, image || undefined);
      
      const newIssue: CivicIssue = {
        id: Math.random().toString(36).substr(2, 9),
        type: aiResult.issue_type,
        priority: aiResult.priority,
        status: IssueStatus.REPORTED,
        department: aiResult.department,
        summary: aiResult.summary,
        location: location,
        timestamp: new Date().toISOString(),
        imageUrl: image || undefined,
        confidence: aiResult.confidence
      };

      onSuccess(newIssue);
    } catch (error) {
      console.error("Submission error", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-w-2xl mx-auto">
      <div className="p-6 bg-indigo-50 border-b border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-900">New Civic Report</h2>
        <p className="text-indigo-600 text-sm">Help improve your city. AI will process your report.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            What is the issue?
          </label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="Describe the problem in detail (e.g., 'Large pothole on 5th Ave near the library')..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Attach Evidence (Optional)
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-indigo-400 transition-all"
          >
            {image ? (
              <div className="relative inline-block">
                <img src={image} alt="Report preview" className="max-h-48 rounded-lg shadow-md" />
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImage(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                >
                  <i className="fa-solid fa-times w-5 h-5"></i>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <i className="fa-solid fa-camera text-4xl text-slate-300"></i>
                <p className="text-slate-500 text-sm">Tap to upload a photo</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <i className="fa-solid fa-location-dot text-indigo-500"></i>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Location</p>
            <p className="text-sm font-medium text-slate-700">{location}</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-[2] py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i>
                AI is analyzing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane"></i>
                Submit Report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
