import { Package, Tag } from '../types';
import { Truck, CheckCircle, AlertTriangle, Package as PackageIcon, Tag as TagIcon } from 'lucide-react';

interface Props {
  packages: Package[];
  tags: Tag[];
}

export default function StatsBar({ packages, tags }: Props) {
  const total = packages.length;
  const transit = packages.filter((p) => p.status === 'transit').length;
  const delivered = packages.filter((p) => p.status === 'delivered').length;
  const exception = packages.filter((p) => p.status === 'exception').length;

  const getTagCount = (tagId: string) =>
    packages.filter((p) => p.tagIds.includes(tagId)).length;

  const statusItems = [
    { label: '今日发货', value: total, icon: PackageIcon, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: '在途数量', value: transit, icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: '已签收', value: delivered, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: '异常件', value: exception, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="flex flex-col gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700">
      <div className="flex gap-4">
        {statusItems.map((item) => (
          <div key={item.label} className={`flex items-center gap-3 px-4 py-2 rounded-lg ${item.bg} flex-1`}>
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <div>
              <div className="text-xs text-slate-400">{item.label}</div>
              <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
      {tags.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-700">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <TagIcon className="w-4 h-4" />
            标签统计：
          </div>
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
              <span>{tag.name}</span>
              <span className="font-semibold ml-0.5">{getTagCount(tag.id)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
