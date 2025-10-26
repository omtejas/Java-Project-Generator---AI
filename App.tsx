
import React, { useState, useCallback } from 'react';
import { generateJavaCode } from './services/geminiService';
import { JavaConcept, GeneratedFile } from './types';
import Header from './components/Header';
import Checkbox from './components/Checkbox';
import Loader from './components/Loader';
import CodeDisplay from './components/CodeDisplay';

const initialConcepts: JavaConcept[] = [
  { id: 'classes', label: 'Classes' },
  { id: 'inheritance', label: 'Inheritance' },
  { id: 'exceptionHandling', label: 'Exception Handling' },
  { id: 'multiThreading', label: 'MultiThreading' },
  { id: 'fileIO', label: 'File I/O' },
  { id: 'jdbc', label: 'Database (JDBC)' },
];

const App: React.FC = () => {
  const [projectDescription, setProjectDescription] = useState<string>('A simple library management system');
  const [selectedConcepts, setSelectedConcepts] = useState<Record<string, boolean>>(
    initialConcepts.reduce((acc, concept) => ({ ...acc, [concept.id]: true }), {})
  );
  const [generatedCode, setGeneratedCode] = useState<GeneratedFile[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleConceptChange = (id: string, checked: boolean) => {
    setSelectedConcepts(prev => ({ ...prev, [id]: checked }));
  };

  const handleGenerateCode = useCallback(async () => {
    const activeConcepts = initialConcepts.filter(c => selectedConcepts[c.id]);
    if (!projectDescription.trim()) {
      setError('Please enter a project description.');
      return;
    }
    if (activeConcepts.length === 0) {
      setError('Please select at least one Java concept.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedCode(null);

    try {
      const code = await generateJavaCode(projectDescription, activeConcepts);
      setGeneratedCode(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [projectDescription, selectedConcepts]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="flex flex-col space-y-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <div>
              <label htmlFor="project-idea" className="block text-lg font-semibold mb-2 text-gray-200">
                1. Describe your Java project idea
              </label>
              <textarea
                id="project-idea"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="e.g., A simple student management system, a basic banking app..."
                className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-200"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-200">
                2. Select concepts to include
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {initialConcepts.map(concept => (
                  <Checkbox
                    key={concept.id}
                    id={concept.id}
                    label={concept.label}
                    checked={selectedConcepts[concept.id] ?? false}
                    onChange={(checked) => handleConceptChange(concept.id, checked)}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleGenerateCode}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Java Code'
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 min-h-[600px] flex flex-col">
            {isLoading && <Loader />}
            {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md text-center m-auto">{error}</div>}
            {!isLoading && !error && !generatedCode && (
              <div className="text-center text-gray-500 m-auto">
                <h3 className="text-xl font-semibold">Your generated code will appear here</h3>
                <p className="mt-2">Describe your project idea, select the concepts, and click "Generate".</p>
              </div>
            )}
            {generatedCode && <CodeDisplay files={generatedCode} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
