import { useState, useEffect, useCallback } from 'react';
import { Package, Tag } from '../types';
import { generatePackages, movePackages, defaultTags } from '../utils/mockData';

const TAGS_STORAGE_KEY = 'logistics-tags';
const PACKAGE_TAGS_STORAGE_KEY = 'logistics-package-tags';

function loadTags(): Tag[] {
  try {
    const stored = localStorage.getItem(TAGS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return defaultTags;
}

function saveTags(tags: Tag[]) {
  try {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
  } catch (e) {}
}

function loadPackageTags(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(PACKAGE_TAGS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return {};
}

function savePackageTags(packageTags: Record<string, string[]>) {
  try {
    localStorage.setItem(PACKAGE_TAGS_STORAGE_KEY, JSON.stringify(packageTags));
  } catch (e) {}
}

export function usePackages(refreshInterval = 3000) {
  const [packages, setPackages] = useState<Package[]>(() => {
    const initial = generatePackages(20);
    const savedPackageTags = loadPackageTags();
    return initial.map(pkg => ({
      ...pkg,
      tagIds: savedPackageTags[pkg.id] ?? pkg.tagIds,
    }));
  });

  const [tags, setTags] = useState<Tag[]>(() => loadTags());

  useEffect(() => {
    saveTags(tags);
  }, [tags]);

  useEffect(() => {
    const packageTags: Record<string, string[]> = {};
    packages.forEach(pkg => {
      packageTags[pkg.id] = pkg.tagIds;
    });
    savePackageTags(packageTags);
  }, [packages]);

  const refresh = useCallback(() => {
    setPackages((prev) => movePackages(prev));
  }, []);

  useEffect(() => {
    const timer = setInterval(refresh, refreshInterval);
    return () => clearInterval(timer);
  }, [refresh, refreshInterval]);

  const addTag = useCallback((name: string, color: string) => {
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name,
      color,
    };
    setTags((prev) => [...prev, newTag]);
  }, []);

  const removeTag = useCallback((tagId: string) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    setPackages((prev) =>
      prev.map((pkg) => ({
        ...pkg,
        tagIds: pkg.tagIds.filter((id) => id !== tagId),
      }))
    );
  }, []);

  const togglePackageTag = useCallback((packageId: string, tagId: string) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === packageId
          ? {
              ...pkg,
              tagIds: pkg.tagIds.includes(tagId)
                ? pkg.tagIds.filter((id) => id !== tagId)
                : [...pkg.tagIds, tagId],
            }
          : pkg
      )
    );
  }, []);

  return { packages, tags, refresh, addTag, removeTag, togglePackageTag };
}
