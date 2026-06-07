import { useState, useEffect } from 'react';
import { Package, FilterStatus, FilterTag } from './types';
import { usePackages } from './hooks/usePackages';
import StatsBar from './components/StatsBar';
import PackageList from './components/PackageList';
import MapView from './components/MapView';
import DetailCard from './components/DetailCard';

function App() {
  const { packages, tags, addTag, removeTag, togglePackageTag } = usePackages(3000);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [tagFilter, setTagFilter] = useState<FilterTag>('all');
  const [selected, setSelected] = useState<Package | null>(null);

  useEffect(() => {
    if (selected) {
      const updated = packages.find((p) => p.id === selected.id);
      if (updated) {
        setSelected(updated);
      }
    }
  }, [packages]);

  const handleSelect = (pkg: Package) => {
    const updated = packages.find((p) => p.id === pkg.id);
    setSelected(updated ?? pkg);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <StatsBar packages={packages} tags={tags} />
      <div className="flex-1 flex overflow-hidden">
        <PackageList
          packages={packages}
          tags={tags}
          filter={filter}
          tagFilter={tagFilter}
          onFilterChange={setFilter}
          onTagFilterChange={setTagFilter}
          onSelect={handleSelect}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          selectedId={selected?.id}
        />
        <div className="flex-1 relative">
          <MapView
            packages={packages}
            selectedId={selected?.id}
            onSelect={handleSelect}
          />
          <DetailCard
            pkg={selected}
            tags={tags}
            onClose={() => setSelected(null)}
            onToggleTag={togglePackageTag}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
