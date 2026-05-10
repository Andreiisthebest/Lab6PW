import DestinationCard from './DestinationCard';

export default function DataGrid({ destinations, updateStatus, updateDestination, removeDestination, STATUES }) {
  if (destinations.length === 0) {
    return (
      <div className="data-grid">
        <div className="empty-state">
          <div className="empty-icon">🌍</div>
          <h3>No targets acquired</h3>
          <p>Initialize a new location target using the sidebar action.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-grid">
      {destinations.map(dest => (
        <DestinationCard 
          key={dest.id}
          dest={dest}
          updateStatus={updateStatus}
          updateDestination={updateDestination}
          removeDestination={removeDestination}
          STATUES={STATUES}
        />
      ))}
    </div>
  );
}