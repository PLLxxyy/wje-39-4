import { useState } from 'react';
import { Tag } from '../types';
import { Plus, X, Tag as TagIcon, Settings } from 'lucide-react';

interface Props {
  tags: Tag[];
  onAdd: (name: string, color: string) => void;
  onRemove: (tagId: string) => void;
}

const presetColors = [
  '#ef4444', '#f59e0b', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#10b981', '#f97316', '#a855f7',
];

export default function TagManager({ tags, onAdd, onRemove }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(presetColors[0]);

  const handleSubmit = () => {
    if (newName.trim()) {
      onAdd(newName.trim(), newColor);
      setNewName('');
      setNewColor(presetColors[0]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
      >
        <Settings className="w-3.5 h-3.5" />
        标签管理
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200">标签管理</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {tags.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">暂无标签</p>
              ) : (
                tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <TagIcon
                        className="w-3.5 h-3.5"
                        style={{ color: tag.color }}
                      />
                      <span className="text-xs text-slate-300">{tag.name}</span>
                    </div>
                    <button
                      onClick={() => onRemove(tag.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-700 pt-3">
              <p className="text-xs text-slate-400 mb-2">新建标签</p>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="标签名称"
                className="w-full px-2 py-1.5 text-xs bg-slate-700 border border-slate-600 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-2"
              />
              <div className="flex gap-1 flex-wrap mb-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewColor(color)}
                    className={`w-6 h-6 rounded transition-transform ${
                      newColor === color ? 'ring-2 ring-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!newName.trim()}
                className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                添加标签
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
