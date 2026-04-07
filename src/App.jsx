import { useState, useEffect, useMemo } from 'react'
import './index.css'

const CONTINENT_IMAGES = {
  Europe: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
  Asia: 'https://images.unsplash.com/photo-1540864393664-07e3a39e3f73?auto=format&fit=crop&w=800&q=80',
  Americas: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
  Africa: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
  Oceania: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80'
}

const STATUES = ['Dreaming', 'Planning', 'Booked', 'Completed']

function App() {
  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem('premium_destinations')
    if (saved) return JSON.parse(saved)
    return []
  })

  // Form State
  const [location, setLocation] = useState('')
  const [continent, setContinent] = useState('Europe')
  const [notes, setNotes] = useState('')
  const [cost, setCost] = useState('')
  const [status, setStatus] = useState('Dreaming')
  const [priority, setPriority] = useState(3)
  
  // UI State
  const [filter, setFilter] = useState('All')
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('premium_destinations', JSON.stringify(destinations))
  }, [destinations])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!location.trim()) return
    
    // Fetch a real photo from Wikipedia based on the location name
    let fetchedImageUrl = null;
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location)}`);
      const data = await res.json();
      if (data.thumbnail && data.thumbnail.source) {
        // Wikipedia thumbnails usually have the width at the end of the URL (e.g. .../320px-image.jpg)
        // We can request a larger size by replacing the px value, or just use the original originalimage if available
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
      priority,
      dateAdded: new Date().toISOString(),
      imageUrl: fetchedImageUrl
    }
    
    setDestinations(prev => [newDest, ...prev])
    
    // Reset form
    setLocation('')
    setNotes('')
    setCost('')
    setStatus('Dreaming')
    setPriority(3)
    setIsFormOpen(false)
  }

  const removeDestination = (id) => {
    setDestinations(prev => prev.filter(dest => dest.id !== id))
  }

  const updateStatus = (id, newStatus) => {
    setDestinations(prev => prev.map(dest => 
      dest.id === id ? { ...dest, status: newStatus } : dest
    ))
  }

  const filteredDestinations = destinations.filter(dest => {
    if (filter === 'All') return true;
    if (STATUES.includes(filter)) return dest.status === filter;
    return dest.continent === filter;
  })

  // Analytics Calculation
  const stats = useMemo(() => {
    const totalCost = destinations.reduce((sum, dest) => sum + dest.cost, 0);
    const bookedCost = destinations.filter(d => d.status === 'Booked' || d.status === 'Completed')
                                   .reduce((sum, dest) => sum + dest.cost, 0);
    const completedCount = destinations.filter(d => d.status === 'Completed').length;
    const progress = destinations.length ? Math.round((completedCount / destinations.length) * 100) : 0;
    
    return { totalCost, bookedCost, completedCount, progress }
  }, [destinations])

  return (
    <div className="premium-layout">
      {/* Background gradients */}
      <div className="bg-glow top-right"></div>
      <div className="bg-glow bottom-left"></div>

      <div className="sidebar">
        <div className="brand">
          <div className="logo-mark"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg></div>
          Nexus Travel Base
        </div>
        
        <nav className="nav-menu">
          <div className="nav-label">Overview</div>
          {['All', ...STATUES].map(f => (
            <button 
              key={f} 
              className={`nav-item ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              <span className={`status-dot ${f.toLowerCase()}`}></span>
              {f}
              <span className="count">
                {f === 'All' ? destinations.length : destinations.filter(d => d.status === f).length}
              </span>
            </button>
          ))}
          
          <div className="nav-label mt-4">Regions</div>
          {['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'].map(f => (
            <button 
              key={f} 
              className={`nav-item ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </nav>
        
        <button className="primary-action" onClick={() => setIsFormOpen(!isFormOpen)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Destination
        </button>
      </div>

      <main className="main-content">
        <header className="page-header">
          <h1>{filter === 'All' ? 'Command Center' : filter}</h1>
          <div className="user-profile">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=1a1a1a" alt="User" />
          </div>
        </header>

        {/* Bento Dashboard */}
        <section className="bento-dashboard">
          <div className="bento-card spotlight">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div className="bento-data">
              <span className="label">Total Est. Budget</span>
              <h2>${stats.totalCost.toLocaleString()}</h2>
            </div>
            <div className="trend positive">+ Booked: ${stats.bookedCost.toLocaleString()}</div>
          </div>
          
          <div className="bento-card">
            <div className="bento-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="bento-data">
              <span className="label">World Dominance</span>
              <h2>{stats.progress}%</h2>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${stats.progress}%`}}></div>
            </div>
          </div>
          
          <div className="bento-card mini">
            <span className="label">Next Up</span>
            <h3>{destinations.find(d => d.status === 'Planning')?.location || 'No trips planned'}</h3>
          </div>
        </section>

        {isFormOpen && (
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
                  
                  <div className="form-group">
                    <label>Priority (1-5)</label>
                    <input 
                      type="range" 
                      min="1" max="5" 
                      value={priority}
                      onChange={(e) => setPriority(Number(e.target.value))}
                    />
                    <div className="priority-display">{'★'.repeat(priority)}</div>
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
        )}

        <div className="data-grid">
          {filteredDestinations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌍</div>
              <h3>No targets acquired</h3>
              <p>Initialize a new location target using the sidebar action.</p>
            </div>
          ) : (
            filteredDestinations.map(dest => (
              <div key={dest.id} className="data-card">
                <div className="card-hero" style={{backgroundImage: `url(${dest.imageUrl || CONTINENT_IMAGES[dest.continent]})`}}>
                  <div className="card-gradient"></div>
                  <div className="card-top">
                    <span className={`status-badge ${dest.status.toLowerCase()}`}>{dest.status}</span>
                    <button className="del-btn" onClick={() => removeDestination(dest.id)}>
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                  <div className="card-bottom">
                    <h2>{dest.location}</h2>
                    <div className="card-meta">
                      <span>{dest.continent}</span>
                      <span className="dot">•</span>
                      <span>{'★'.repeat(dest.priority)}</span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {dest.notes && <p className="notes">{dest.notes}</p>}
                  
                  <div className="card-footer">
                    <div className="cost">${dest.cost.toLocaleString()}</div>
                    <div className="actions">
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.location)}`} target="_blank" rel="noreferrer" className="action-btn" title="View Map">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                      </a>
                      <select 
                        className="status-selector" 
                        value={dest.status} 
                        onChange={(e) => updateStatus(dest.id, e.target.value)}
                      >
                        {STATUES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default App
