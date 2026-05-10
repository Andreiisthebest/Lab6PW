export default function Dashboard({ stats, nextUpTrip }) {
  return (
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
        <h3>{nextUpTrip?.location || 'No upcoming trips'}</h3>
        {nextUpTrip?.startDate && <span className="label" style={{marginTop: 'auto'}}>{new Date(nextUpTrip.startDate).toLocaleDateString()}</span>}
      </div>
    </section>
  );
}