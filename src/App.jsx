import { useState, useMemo, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import useStore from './store/useStore'
import { STATUES } from './utils/constants'

// Components
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Leaderboard from './components/Leaderboard'
import DataGrid from './components/DataGrid'
import NewTargetModal from './components/NewTargetModal'

import './index.css'

function App() {
  const { 
    destinations, 
    addDestination, 
    removeDestination, 
    updateStatus,
    updateDestination,
    theme, 
    toggleTheme 
  } = useStore()

  // Apply theme to body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // UI State
  const [filter, setFilter] = useState('All')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filteredDestinations = destinations.filter(dest => {
    if (filter === 'All' || filter === 'Leaderboard') return true;
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

  const nextUpTrip = useMemo(() => {
    const pending = destinations.filter(d => ['Booked', 'Planning'].includes(d.status));
    if (!pending.length) return null;

    return pending.sort((a, b) => {
      if (a.status === 'Booked' && b.status !== 'Booked') return -1;
      if (b.status === 'Booked' && a.status !== 'Booked') return 1;

      const dateA = a.startDate ? new Date(a.startDate).getTime() : Infinity;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : Infinity;
      return dateA - dateB;
    })[0];
  }, [destinations])

  const leaderboard = useMemo(() => {
    return destinations
      .filter(d => d.status === 'Completed' && d.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [destinations])

  return (
    <div className="premium-layout">
      {/* Background gradients */}
      <div className="bg-glow top-right"></div>
      <div className="bg-glow bottom-left"></div>

      <Sidebar 
        filter={filter} 
        setFilter={setFilter} 
        destinations={destinations} 
        isFormOpen={isFormOpen} 
        setIsFormOpen={setIsFormOpen} 
        STATUES={STATUES} 
      />

      <main className="main-content">
        <header className="page-header">
          <h1>{filter === 'All' ? 'Command Center' : filter === 'Leaderboard' ? 'Hall of Fame 🏆' : filter}</h1>
          <div className="user-profile" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={toggleTheme} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=1a1a1a" alt="User" />
          </div>
        </header>

        {filter !== 'Leaderboard' && (
          <Dashboard stats={stats} nextUpTrip={nextUpTrip} />
        )}

        {filter === 'Leaderboard' ? (
          <Leaderboard leaderboard={leaderboard} />
        ) : (
          <DataGrid 
            destinations={filteredDestinations}
            updateStatus={updateStatus}
            updateDestination={updateDestination}
            removeDestination={removeDestination}
            STATUES={STATUES}
          />
        )}

        <NewTargetModal 
          isFormOpen={isFormOpen} 
          setIsFormOpen={setIsFormOpen} 
          addDestination={addDestination} 
        />
      </main>
    </div>
  );
}

export default App;
