import React, { useState, useEffect } from 'react';
import { Dumbbell, Activity, Menu, Clock, Plus, Play, Pause, RotateCcw, Check, X } from 'lucide-react';

// Mock Sidebar component
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  if (!sidebarOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white" onClick={e => e.stopPropagation()}>
        <div className="p-4">
          <h2 className="text-xl font-bold text-[#111827]">Wellness Hub</h2>
        </div>
      </div>
    </div>
  );
};

const Exercise = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [routines, setRoutines] = useState([
    { id: 1, title: '6-min Desk Stretch', duration: 6, steps: ['Neck rolls', 'Shoulder shrugs', 'Wrist circles', 'Back stretch'] },
    { id: 2, title: '12-min Energizer', duration: 12, steps: ['Jumping jacks', 'Bodyweight squats', 'High knees', 'Lunges'] },
    { id: 3, title: '8-min Calm Body Reset', duration: 8, steps: ['Cat-cow', 'Child pose', 'Forward fold', 'Deep breathing'] },
  ]);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ title: '', duration: 5, steps: [''] });

  // Timer logic - runs every second when active
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startSession = (routine) => {
    setCurrentRoutine(routine);
    setCurrentStepIndex(0);
    const timePerStep = Math.floor((routine.duration * 60) / routine.steps.length);
    setTimeLeft(timePerStep);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentRoutine && currentStepIndex < currentRoutine.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      const timePerStep = Math.floor((currentRoutine.duration * 60) / currentRoutine.steps.length);
      setTimeLeft(timePerStep);
      setIsRunning(true);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    setIsRunning(false);
    setCurrentRoutine(null);
    setCurrentStepIndex(0);
    setTimeLeft(0);
  };

  const resetTimer = () => {
    if (currentRoutine) {
      const timePerStep = Math.floor((currentRoutine.duration * 60) / currentRoutine.steps.length);
      setTimeLeft(timePerStep);
      setIsRunning(false);
    }
  };

  const addRoutine = () => {
    if (newRoutine.title && newRoutine.steps.filter(s => s.trim()).length > 0) {
      const routine = {
        id: Date.now(),
        title: newRoutine.title,
        duration: newRoutine.duration,
        steps: newRoutine.steps.filter(s => s.trim())
      };
      setRoutines([...routines, routine]);
      setNewRoutine({ title: '', duration: 5, steps: [''] });
      setShowAddModal(false);
    }
  };

  const addStep = () => {
    setNewRoutine({ ...newRoutine, steps: [...newRoutine.steps, ''] });
  };

  const updateStep = (index, value) => {
    const updated = [...newRoutine.steps];
    updated[index] = value;
    setNewRoutine({ ...newRoutine, steps: updated });
  };

  const removeStep = (index) => {
    if (newRoutine.steps.length > 1) {
      setNewRoutine({ ...newRoutine, steps: newRoutine.steps.filter((_, i) => i !== index) });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#eaf1f5]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-72 min-h-screen">
        <div className="lg:hidden sticky top-0 z-30 bg-[#eaf1f5]/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:'#c8ced1'}}>
            <button onClick={()=>setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-[#f2f7eb]"><Menu className="w-6 h-6 text-[#2e2f34]"/></button>
            <div className="flex items-center space-x-2"><Activity className="w-5 h-5 text-[#3d9098]"/><span className="font-semibold text-[#2e2f34]">Exercise</span></div>
            <div className="w-6"/>
          </div>
        </div>

        <main className="p-6 space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-[#3d9098] p-3 rounded-xl"><Dumbbell className="w-8 h-8 text-white"/></div>
              <div>
                <h1 className="text-3xl font-bold text-[#2e2f34]">Light Exercises</h1>
                <p className="text-[#767272]">Quick routines to refresh body and mind</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border" style={{borderColor:'#c8ced1'}}>
              {currentRoutine ? (
                <div>
                  <h3 className="text-lg font-bold text-[#2e2f34] mb-4">Active Session: {currentRoutine.title}</h3>
                  <div className="rounded-lg bg-[#eaf1f5] p-6">
                    <div className="text-center mb-6">
                      <p className="text-sm text-[#767272] mb-2">Step {currentStepIndex + 1} of {currentRoutine.steps.length}</p>
                      <p className="text-2xl font-bold text-[#2e2f34] mb-4">{currentRoutine.steps[currentStepIndex]}</p>
                      <div className="text-5xl font-bold text-[#3d9098] mb-4">{formatTime(timeLeft)}</div>
                      <div className="w-full bg-white rounded-full h-2 mb-4">
                        <div className="bg-[#2dc8ca] h-2 rounded-full transition-all" style={{width: `${((currentStepIndex + 1) / currentRoutine.steps.length) * 100}%`}}/>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setIsRunning(!isRunning)} className="flex-1 bg-[#2dc8ca] text-white py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center gap-2">
                        {isRunning ? <><Pause className="w-5 h-5"/>Pause</> : <><Play className="w-5 h-5"/>Resume</>}
                      </button>
                      <button onClick={resetTimer} className="px-4 bg-[#767272] text-white rounded-lg hover:opacity-90"><RotateCcw className="w-5 h-5"/></button>
                      <button onClick={nextStep} className="flex-1 bg-[#3d9098] text-white py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center gap-2">
                        {currentStepIndex < currentRoutine.steps.length - 1 ? <>Next Step</> : <><Check className="w-5 h-5"/>Complete</>}
                      </button>
                    </div>
                    <button onClick={completeSession} className="w-full mt-3 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-50">End Session</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-[#2e2f34] mb-4">Select a Routine to Start</h3>
                  <div className="rounded-lg bg-[#eaf1f5] p-6 text-center">
                    <Activity className="w-16 h-16 text-[#8d949d] mx-auto mb-4"/>
                    <p className="text-[#767272]">Choose a routine from the list to begin your exercise session</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 border" style={{borderColor:'#c8ced1'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2e2f34]">My Routines</h3>
                <button onClick={() => setShowAddModal(true)} className="p-2 bg-[#2dc8ca] text-white rounded-lg hover:opacity-90"><Plus className="w-4 h-4"/></button>
              </div>
              <div className="space-y-3">
                {routines.map(r => (
                  <div key={r.id} className="p-3 rounded-lg border hover:bg-[#f2f7eb]" style={{borderColor:'#c8ced1'}}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-[#2e2f34]">{r.title}</p>
                      <div className="flex items-center space-x-1 text-xs text-[#767272]"><Clock className="w-3 h-3"/><span>{r.duration} min</span></div>
                    </div>
                    <p className="text-xs text-[#767272] mb-2">{r.steps.length} steps</p>
                    <button onClick={() => startSession(r)} disabled={currentRoutine !== null} className="w-full bg-[#2dc8ca] text-white py-1.5 rounded text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">Start Session</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#2e2f34]">Add New Routine</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-[#f2f7eb] rounded"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2e2f34] mb-2">Routine Name</label>
                <input type="text" value={newRoutine.title} onChange={(e) => setNewRoutine({...newRoutine, title: e.target.value})} placeholder="e.g., Morning Stretch" className="w-full px-3 py-2 border rounded-lg" style={{borderColor:'#c8ced1'}}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2e2f34] mb-2">Total Duration (minutes)</label>
                <input type="number" min="1" value={newRoutine.duration} onChange={(e) => setNewRoutine({...newRoutine, duration: parseInt(e.target.value) || 5})} className="w-full px-3 py-2 border rounded-lg" style={{borderColor:'#c8ced1'}}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2e2f34] mb-2">Exercise Steps</label>
                {newRoutine.steps.map((step, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" value={step} onChange={(e) => updateStep(index, e.target.value)} placeholder={`Step ${index + 1}`} className="flex-1 px-3 py-2 border rounded-lg" style={{borderColor:'#c8ced1'}}/>
                    {newRoutine.steps.length > 1 && (
                      <button onClick={() => removeStep(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4"/></button>
                    )}
                  </div>
                ))}
                <button onClick={addStep} className="w-full py-2 border-2 border-dashed rounded-lg text-sm text-[#767272] hover:bg-[#f2f7eb]" style={{borderColor:'#c8ced1'}}>+ Add Step</button>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 border rounded-lg font-semibold hover:bg-[#f2f7eb]" style={{borderColor:'#c8ced1'}}>Cancel</button>
                <button onClick={addRoutine} className="flex-1 py-2 bg-[#2dc8ca] text-white rounded-lg font-semibold hover:opacity-90">Add Routine</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercise;