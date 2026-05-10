import { CONTINENT_IMAGES } from '../utils/constants';

export default function Leaderboard({ leaderboard }) {
  if (leaderboard.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏆</div>
        <h3>No rankings yet</h3>
        <p>Complete some trips and give them a score to see them here.</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-fullscreen" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem'}}>
      {leaderboard.map((trip, idx) => (
        <div key={trip.id} style={{
          display: 'flex', alignItems: 'center', background: 'var(--bg-ele)', 
          padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)',
          boxShadow: idx === 0 ? '0 0 20px rgba(234, 179, 8, 0.15)' : 'none',
          position: 'relative', overflow: 'hidden'
        }}>
          {idx === 0 && <div style={{position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#eab308'}}></div>}
          {idx === 1 && <div style={{position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#9ca3af'}}></div>}
          {idx === 2 && <div style={{position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#b45309'}}></div>}
          
          <div style={{fontSize: '2rem', fontWeight: 'bold', minWidth: '60px', color: idx === 0 ? '#eab308' : idx === 1 ? '#9ca3af' : idx === 2 ? '#b45309' : 'var(--text-secondary)'}}>
            #{idx + 1}
          </div>
          
          <div style={{
            width: '80px', height: '80px', borderRadius: '12px', 
            backgroundImage: `url(${trip.imageUrl || CONTINENT_IMAGES[trip.continent]})`, 
            backgroundSize: 'cover', backgroundPosition: 'center', marginRight: '1.5rem'
          }}></div>
          
          <div style={{flex: 1}}>
            <h2 style={{margin: '0 0 0.5rem 0', fontSize: '1.5rem'}}>{trip.location}</h2>
            {trip.feedback && <p style={{margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic'}}>&quot;{trip.feedback}&quot;</p>}
          </div>
          
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: '2.5rem', fontWeight: '900', color: 'var(--status-comp)', lineHeight: 1}}>
              {trip.score}<span style={{fontSize: '1.2rem', color: 'var(--text-secondary)'}}>/10</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}