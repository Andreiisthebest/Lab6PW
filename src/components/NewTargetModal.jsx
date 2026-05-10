import { useState } from 'react';
import { STATUES } from '../utils/constants';

export default function NewTargetModal({ isFormOpen, setIsFormOpen, addDestination }) {
  const [location, setLocation] = useState('');
  const [continent, setContinent] = useState('Europe');
  const [notes, setNotes] = useState('');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState('Dreaming');
  const [startDate, setStartDate] = useState('');

  if (!isFormOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    
    let fetchedImageUrl = null;
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location)}`);
      const data = await res.json();
      if (data.thumbnail && data.thumbnail.source) {
        fetchedImageUrl = data.originalimage ? data.originalimage.source : data.thumbnail.source;
      }
    } catch (err) {
      console.error("Failed to fetch image", err);
    }

    const newDest = { 
      id: Date.now(), 
      location, 
      continent, 
      notes,
      cost: parseFloat(cost) || 0,
      status,
      startDate,
      score: 0,
      feedback: '',
      dateAdded: new Date().toISOString(),
      imageUrl: fetchedImageUrl
    };
    
    addDestination(newDest);
    
    // Reset form
    setLocation('');
    setNotes('');
    setCost('');
    setStatus('Dreaming');
    setStartDate('');
    setIsFormOpen(false);
  };

  return (
    <div className="modal-overlay">
      <div className="form-modal">
        <div className="modal-header">
          <h2>New Intel</h2>
          <button className="close-btn" onClick={() => setIsFormOpen(false)}>×</button>
        </div>
        <form onSubmit={handleAdd} className="nexus-form">
          <div className="form-grid">
            <div className="form-group span-2">
              <label>Location Target</label>
              <input 
                type="text" 
                placeholder="e.g. Kyoto, Japan" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required 
              />
            </div>

            <div className="form-group span-2">
              <label>Start Date (optional)</label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Region</label>
              <select value={continent} onChange={(e) => setContinent(e.target.value)}>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Americas">Americas</option>
                <option value="Africa">Africa</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Est. Cost ($)</label>
              <input 
                type="number" 
                placeholder="1500" 
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            
            <div className="form-group span-2">
              <label>Mission Notes</label>
              <textarea 
                placeholder="Key obj: Explore bamboo forest, eat ramen." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => setIsFormOpen(false)}>Cancel</button>
            <button type="submit" className="btn-solid">Initialize Target</button>
          </div>
        </form>
      </div>
    </div>
  );
}