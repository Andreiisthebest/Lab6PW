import { CONTINENT_IMAGES } from '../utils/constants';

export default function DestinationCard({ dest, updateStatus, updateDestination, removeDestination, STATUES }) {
  return (
    <div className="data-card">
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
            {dest.startDate && (
              <>
                <span className="dot">•</span>
                <span>{new Date(dest.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="card-body">
        {dest.notes && <p className="notes">{dest.notes}</p>}
        
        <div className="card-footer" style={{flexDirection: 'column', gap: '1rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
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
          
          {dest.status === 'Completed' && (
            <div style={{background: 'var(--bg-base)', padding: '0.75rem', borderRadius: '8px', width: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <label style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Score (1-10)</label>
                <input 
                  type="number" 
                  min="1" max="10"
                  style={{width: '60px', padding: '0.2rem', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px'}}
                  value={dest.score || ''}
                  onChange={(e) => updateDestination(dest.id, {score: Number(e.target.value)})}
                />
              </div>
              <input 
                type="text" 
                placeholder="Add feedback..."
                style={{width: '100%', padding: '0.4rem', fontSize: '0.8rem', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px'}}
                value={dest.feedback || ''}
                onChange={(e) => updateDestination(dest.id, {feedback: e.target.value})}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}