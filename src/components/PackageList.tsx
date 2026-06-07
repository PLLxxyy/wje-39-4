import { Package, FilterStatus, Tag, FilterTag } from '../types';
import { statusColor, statusLabel, statusBg } from '../utils/helpers';
import TagManager from './TagManager';
import { Tag as TagIcon } from 'lucide-react';

interface Props {
  packages: Package[];
  tags: Tag[];
  filter: FilterStatus;
  tagFilter: FilterTag;
  onFilterChange: (f: FilterStatus) => void;
  onTagFilterChange: (f: FilterTag) => void;
  onSelect: (pkg: Package) => void;
  onAddTag: (name: string, color: string) => void;
  onRemoveTag: (tagId: string) => void;
  selectedId?: string;
}

export default function PackageList({
  packages,
  tags,
  filter,
  tagFilter,
  onFilterChange,
  onTagFilterChange,
  onSelect,
  onAddTag,
  onRemoveTag,
  selectedId,
}: Props) {
  const filtered = packages.filter((p) => {
    const statusMatch = filter === 'all' || p.status === filter;
    const tagMatch = tagFilter === 'all' || p.tagIds.includes(tagFilter);
    return statusMatch && tagMatch;
  });

  const filters: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'transit', label: '运输中' },
    { key: 'delivered', label: '已签收' },
    { key: 'exception', label: '异常' },
  ];

  const tagFilters: { key: FilterTag; label: string; color?: string }[] = [
    { key: 'all', label: '全部标签' },
    ...tags.map((t) => ({ key: t.id, label: t.name, color: t.color })),
  ];

  const getTagById = (id: string) => tags.find((t) => t.id === id);

  return (
    <div className="w-72 bg-slate-800/90 border-r border-slate-700 flex flex-col">
      <div className="p-3 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-200">包裹列表</h2>
          <TagManager tags={tags} onAdd={onAddTag} onRemove={onRemoveTag} />
        </div>
        <div className="flex gap-1 flex-wrap mb-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                filter === f.key ? 'bg-slate-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {tagFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => onTagFilterChange(f.key)}
                className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                  tagFilter === f.key
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {f.color && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: f.color }}
                  />
                )}
                {!f.color && <TagIcon className="w-3 h-3" />}
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            暂无符合条件的包裹
          </div>
        ) : (
          filtered.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => onSelect(pkg)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedId === pkg.id
                  ? 'border-blue-500 bg-slate-700/80'
                  : 'border-slate-700 bg-slate-800 hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-slate-300">{pkg.trackingNo}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${statusBg[pkg.status]}`}>
                  {statusLabel[pkg.status]}
                </span>
              </div>
              <div className="text-xs text-slate-400 mb-2">
                {pkg.currentCity} → {pkg.destinationCity}
              </div>
              {pkg.tagIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {pkg.tagIds.map((tagId) => {
                    const tag = getTagById(tagId);
                    if (!tag) return null;
                    return (
                      <span
                        key={tagId}
                        className="text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: `${tag.color}25`, color: tag.color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pkg.progress}%`, backgroundColor: statusColor[pkg.status] }}
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">进度 {pkg.progress}%</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
