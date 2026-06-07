import { Package, Tag } from '../types';
import { statusColor, statusLabel } from '../utils/helpers';
import { X, MapPin, User, Calendar, Package as PackageIcon, Tag as TagIcon } from 'lucide-react';

interface Props {
  pkg: Package | null;
  tags: Tag[];
  onClose: () => void;
  onToggleTag: (packageId: string, tagId: string) => void;
}

export default function DetailCard({ pkg, tags, onClose, onToggleTag }: Props) {
  if (!pkg) return null;

  const getTagById = (id: string) => tags.find((t) => t.id === id);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-80 bg-slate-800/95 border border-slate-600 rounded-xl shadow-2xl p-4 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PackageIcon className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-200">{pkg.trackingNo}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>收件人：{pkg.recipient}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>地址：{pkg.address}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>当前城市：{pkg.currentCity} → {pkg.destinationCity}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>预计送达：{pkg.estimatedDelivery}</span>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="flex items-center gap-1.5 mb-2">
            <TagIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">标签</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const isActive = pkg.tagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => onToggleTag(pkg.id, tag.id)}
                  className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 transition-all ${
                    isActive ? '' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${tag.color}30` : `${tag.color}15`,
                    color: tag.color,
                    boxShadow: isActive
                      ? `0 0 0 1px ${tag.color}, 0 0 0 3px #1e293b`
                      : 'none',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {pkg.tagIds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {pkg.tagIds.map((tagId) => {
            const tag = getTagById(tagId);
            if (!tag) return null;
            return (
              <span
                key={tagId}
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${tag.color}25`, color: tag.color }}
              >
                {tag.name}
              </span>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <span
          className="px-2 py-0.5 rounded text-xs text-white font-medium"
          style={{ backgroundColor: statusColor[pkg.status] }}
        >
          {statusLabel[pkg.status]}
        </span>
        <div className="flex-1 bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pkg.progress}%`, backgroundColor: statusColor[pkg.status] }}
          />
        </div>
        <span className="text-xs text-slate-400">{pkg.progress}%</span>
      </div>
    </div>
  );
}
