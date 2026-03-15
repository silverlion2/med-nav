import React from 'react';
import { Home, CheckCircle2 } from 'lucide-react';
import { questions } from '../data/content';
import { useAppContext } from '../context/AppContext';

export const WizardView = () => {
  const { 
    wizardStep, setWizardStep, 
    formData, handleOptionSelect, 
    startCalculation, resetToHome 
  } = useAppContext();

  const q = questions[wizardStep] || questions[0];
  const progress = ((wizardStep + 1) / questions.length) * 100;

  return (
    <div className="flex-1 w-full bg-gray-50 flex flex-col overflow-y-auto">
      <div className="h-1.5 bg-gray-200 w-full shrink-0 sticky top-0 z-10">
        <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="p-6 flex-1 flex flex-col relative">
        <button onClick={resetToHome} className="absolute top-4 right-6 text-gray-400 p-2 bg-white rounded-full shadow-sm active:bg-gray-100"><Home size={16} /></button>
        <div className="text-sm text-orange-500 font-medium mb-2 shrink-0">Step {wizardStep + 1} of {questions.length}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-snug pr-8">{q.title}</h2>
        <div className="space-y-3 flex-1 pb-6">
          {q.options.map((opt, idx) => {
            const isSelected = q.multi ? (formData[q.id] || []).includes(opt) : formData[q.id] === opt;
            return (
              <button key={idx} onClick={() => handleOptionSelect(q.id, opt, q.multi)} className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${isSelected ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200'}`}>
                <span className="font-medium">{opt}</span>
                {isSelected && <CheckCircle2 size={20} className="text-orange-500 shrink-0" />}
              </button>
            );
          })}
        </div>
        {q.multi && (
          <button 
            onClick={() => wizardStep < questions.length - 1 ? setWizardStep(wizardStep + 1) : startCalculation()} 
            className="mt-4 w-full bg-gray-800 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform"
          >
            下一步
          </button>
        )}
      </div>
    </div>
  );
};
