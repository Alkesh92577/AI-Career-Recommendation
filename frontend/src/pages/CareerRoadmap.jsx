import { useEffect, useState } from "react";
import studentService from "../services/studentService";
import careerRoadmapService from "../services/careerRoadmapService";
import roadmapProgressService from "../services/roadmapProgressService";

function CareerRoadmap() {
  const [roadmap, setRoadmap] = useState([]);
  const [progress, setProgress] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [finalCareer, setFinalCareer] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (text, type) => {
    setMessage(text); setMessageType(type);
    window.clearTimeout(showMessage.timer);
    showMessage.timer = window.setTimeout(() => { setMessage(""); setMessageType(""); }, 3000);
  };

  const normalize = (data) => Array.isArray(data) ? [...data].sort((a,b) => Number(a.stepNumber||0)-Number(b.stepNumber||0)) : [];

  const loadData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User not found. Please login again.");
      const student = await studentService.getByUserId(userId);
      if (!student?.id) throw new Error("Complete your profile first.");
      const id = Number(student.id);
      setStudentId(id); localStorage.setItem("studentId", String(id));

      let rows = await careerRoadmapService.getByStudentId(id);
      if (!Array.isArray(rows) || rows.length === 0) rows = await careerRoadmapService.generate(id);
      rows = normalize(rows);
      setRoadmap(rows);

      const savedCareer = localStorage.getItem("latestPredictedCareer")?.trim() || rows[0]?.career || "";
      setFinalCareer(savedCareer);
      if (savedCareer) localStorage.setItem("latestPredictedCareer", savedCareer);

      const savedProgress = await roadmapProgressService.getByStudentId(id);
      setProgress(Array.isArray(savedProgress) ? savedProgress : []);
    } catch (e) {
      console.error("ROADMAP LOAD ERROR:", e);
      showMessage(e.response?.data?.message || e.response?.data?.error || e.message || "Career roadmap is not loading.", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const isCompleted = (id) => progress.some(p => Number(p.roadmapId) === Number(id) && p.completed === true);

  const handleComplete = async (roadmapId) => {
    if (!studentId) return showMessage("Student ID not found.", "error");
    const completed = !isCompleted(roadmapId);
    try {
      const saved = await roadmapProgressService.updateProgress(studentId, Number(roadmapId), completed);
      setProgress(prev => {
        const exists = prev.some(p => Number(p.roadmapId) === Number(roadmapId));
        return exists ? prev.map(p => Number(p.roadmapId) === Number(roadmapId) ? saved : p) : [...prev, saved];
      });
      showMessage(completed ? "Step completed and saved! ✓" : "Step marked incomplete.", "success");
    } catch (e) {
      console.error("PROGRESS SAVE ERROR:", e);
      showMessage(e.response?.data?.message || e.response?.data?.error || e.message || "Progress is not saving.", "error");
    }
  };

  const handleGenerate = async () => {
    if (!studentId) return showMessage("Student profile not found.", "error");
    if (generating) return;
    const career = localStorage.getItem("latestPredictedCareer")?.trim();
    if (!career) return showMessage("Generate a career prediction first.", "error");
    try {
      setGenerating(true); setRoadmap([]); setProgress([]);
      const rows = normalize(await careerRoadmapService.generate(studentId));
      if (!rows.length) throw new Error("The backend returned an empty roadmap.");
      setRoadmap(rows); setFinalCareer(rows[0]?.career || career);
      const saved = await roadmapProgressService.getByStudentId(studentId);
      setProgress(Array.isArray(saved) ? saved : []);
      showMessage("🎉 New Career Roadmap successfully generated!", "success");
    } catch (e) {
      console.error("ROADMAP GENERATE ERROR:", e);
      showMessage(e.response?.data?.message || e.response?.data?.error || e.message || "The roadmap is not being generated.", "error");
    } finally { setGenerating(false); }
  };

  if (loading) return <div className="page-container"><div className="form-card"><h2>Loading Career Roadmap...</h2></div></div>;

  return (
    <div className="page-container">
      <div className="page-header"><h1>🗺️ Career Roadmap</h1><p>A personalized learning roadmap based on your recommended career.</p></div>
      {message && <div className={messageType === "success" ? "success-message" : "error-message"}>{message}</div>}

      <div className="profile-completion-card" style={{marginBottom:"25px"}}>
        <div><h2>🎯 {finalCareer || "Career Roadmap"}</h2><p>Your personalized learning path based on your AI career recommendation.</p></div>
      </div>

      <div className="form-card">
        <h2>🚀 Learning Roadmap</h2>
        <p style={{color:"#64748b",marginTop:"10px"}}>Learning path for <strong>{finalCareer || "your recommended career"}</strong></p>
        {!roadmap.length ? <p>A learning roadmap is not available yet.</p> : (
          <div style={{marginTop:"25px"}}>
            {roadmap.map(step => {
              const completed = isCompleted(step.id);
              return <div key={step.id} style={{display:"flex",gap:"20px",marginBottom:"20px"}}>
                <div style={{minWidth:"50px",height:"50px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:completed?"#22c55e":"#6366f1",color:"white",fontWeight:"bold",fontSize:"18px"}}>{completed?"✓":step.stepNumber}</div>
                <div style={{flex:1,padding:"20px",borderRadius:"14px",border:completed?"2px solid #22c55e":"1px solid #e5e7eb",background:completed?"#f0fdf4":"#f8f9ff"}}>
                  <h3 style={{marginTop:0,textDecoration:completed?"line-through":"none",color:completed?"#15803d":"#0f172a"}}>{step.topic}</h3>
                  {step.description && <p>{step.description}</p>}
                  {step.whatToLearn && <div><strong>📚 What to learn:</strong><p>{step.whatToLearn}</p></div>}
                  {step.duration && <p>⏱️ <strong>Duration:</strong> {step.duration}</p>}
                  {step.difficulty && <p>🎯 <strong>Difficulty:</strong> {step.difficulty}</p>}
                  {step.resources && <div><strong>🔗 Resources:</strong><p>{step.resources}</p></div>}
                  {step.miniProject && <div><strong>💻 Mini Project:</strong><p>{step.miniProject}</p></div>}
                  <button type="button" className="main-button" onClick={()=>handleComplete(step.id)} style={{width:"100%",minHeight:"55px",fontSize:"17px",marginTop:"15px",background:completed?"#22c55e":"linear-gradient(90deg,#6366f1,#8b5cf6)"}}>{completed?"✓ Completed - Mark Incomplete":"Mark Complete ✓"}</button>
                </div>
              </div>;
            })}
          </div>
        )}
      </div>

      <div style={{marginTop:"25px",marginBottom:"30px"}}><button type="button" className="main-button" onClick={handleGenerate} disabled={generating} style={{width:"100%",minHeight:"60px",fontSize:"18px"}}>{generating?"🤖 Generating New Roadmap...":"🔄 Generate Roadmap Again"}</button></div>
    </div>
  );
}
export default CareerRoadmap;
