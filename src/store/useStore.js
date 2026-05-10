import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      destinations: [],
      theme: 'dark', // default theme
      
      // Theme actions
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      // Destination actions
      addDestination: (destination) => set((state) => ({ 
        destinations: [destination, ...state.destinations] 
      })),
      
      removeDestination: (id) => set((state) => ({
        destinations: state.destinations.filter(d => d.id !== id)
      })),
      
      updateStatus: (id, status) => set((state) => ({
        destinations: state.destinations.map(d => d.id === id ? { ...d, status } : d)
      })),

      toggleLike: (id) => set((state) => ({
        destinations: state.destinations.map(d => d.id === id ? { ...d, liked: !d.liked } : d)
      }))
    }),
    {
      name: 'destinations-storage',
    }
  )
);

export default useStore;