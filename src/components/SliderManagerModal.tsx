import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Check, Layers, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { SlideItem } from '../types';

interface SliderManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideItem[];
  onSaveSlides: (updatedSlides: SlideItem[]) => void;
}

export const SliderManagerModal: React.FC<SliderManagerModalProps> = ({
  isOpen,
  onClose,
  slides,
  onSaveSlides,
}) => {
  const [slideList, setSlideList] = useState<SlideItem[]>(slides);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [badge, setBadge] = useState('');
  const [badgeColor, setBadgeColor] = useState('bg-teal-500 text-slate-950');
  const [title, setTitle] = useState('');
  const [highlightText, setHighlightText] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bgGradient, setBgGradient] = useState('from-slate-900 via-teal-950 to-slate-900 border-teal-700/50');
  const [buttonText, setButtonText] = useState('Explore Services');
  const [buttonLink, setButtonLink] = useState('imei_services');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (slide: SlideItem) => {
    setEditingId(slide.id);
    setBadge(slide.badge);
    setBadgeColor(slide.badgeColor || 'bg-teal-500 text-slate-950');
    setTitle(slide.title);
    setHighlightText(slide.highlightText || '');
    setSubtitle(slide.subtitle);
    setBgGradient(slide.bgGradient);
    setButtonText(slide.buttonText);
    setButtonLink(slide.buttonLink);
    setImageUrl(slide.imageUrl || '');
  };

  const handleStartNew = () => {
    setEditingId('new');
    setBadge('NEW PROMO');
    setBadgeColor('bg-teal-500 text-slate-950');
    setTitle('DLS UNLOCKER SPECIAL');
    setHighlightText('dlsunlockerserver.site');
    setSubtitle('Instant API Server Unlocking & Carrier Whitelist Processing');
    setBgGradient('from-slate-900 via-teal-900 to-slate-950 border-teal-600/50');
    setButtonText('Order Now');
    setButtonLink('place_order');
    setImageUrl('');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId === 'new') {
      const newSlide: SlideItem = {
        id: `slide-${Date.now()}`,
        badge,
        badgeColor,
        title,
        highlightText,
        subtitle,
        bgGradient,
        buttonText,
        buttonLink,
        imageUrl: imageUrl.trim() || undefined,
        isActive: true,
      };
      const updated = [...slideList, newSlide];
      setSlideList(updated);
      onSaveSlides(updated);
    } else if (editingId) {
      const updated = slideList.map((s) =>
        s.id === editingId
          ? {
              ...s,
              badge,
              badgeColor,
              title,
              highlightText,
              subtitle,
              bgGradient,
              buttonText,
              buttonLink,
              imageUrl: imageUrl.trim() || undefined,
            }
          : s
      );
      setSlideList(updated);
      onSaveSlides(updated);
    }

    setEditingId(null);
  };

  const handleToggleActive = (id: string) => {
    const updated = slideList.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setSlideList(updated);
    onSaveSlides(updated);
  };

  const handleDeleteSlide = (id: string) => {
    const updated = slideList.filter((s) => s.id !== id);
    setSlideList(updated);
    onSaveSlides(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-0">
        {/* Header */}
        <div className="bg-teal-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-300" />
            <h3 className="text-base font-bold tracking-tight">
              Homepage Banner Customization (dlsunlockerserver.site)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-teal-700 text-teal-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Top Add Slide Button */}
          {!editingId && (
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-mono">
                Total Banners: {slideList.length}
              </span>
              <button
                onClick={handleStartNew}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                id="add-new-slide-btn"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Banner Slide</span>
              </button>
            </div>
          )}

          {/* Edit Form */}
          {editingId ? (
            <form onSubmit={handleSaveForm} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {editingId === 'new' ? 'Add New Hero Banner Slide' : 'Edit Hero Banner Slide'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. NEW SYSTEM UPDATE"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Badge Theme Color
                  </label>
                  <select
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="bg-teal-500 text-slate-950">Teal Accent</option>
                    <option value="bg-amber-400 text-slate-950">Amber Gold</option>
                    <option value="bg-blue-600 text-white">Royal Blue</option>
                    <option value="bg-purple-600 text-white">Purple VIP</option>
                    <option value="bg-emerald-600 text-white">Emerald Green</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Main Banner Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. DLS UNLOCKER SERVER"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Highlighted Sub-title Text
                  </label>
                  <input
                    type="text"
                    value={highlightText}
                    onChange={(e) => setHighlightText(e.target.value)}
                    placeholder="e.g. dlsunlockerserver.site"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description Paragraph
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  rows={2}
                  placeholder="Banner details..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Tab Link
                  </label>
                  <select
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="imei_services">IMEI Services</option>
                    <option value="place_order">Submit Order</option>
                    <option value="tool_rent">Tool Rent</option>
                    <option value="api_docs">Reseller API</option>
                    <option value="checker">IMEI Checker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Promo Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  Save Banner
                </button>
              </div>
            </form>
          ) : (
            /* Slide List */
            <div className="space-y-3">
              {slideList.map((slide) => (
                <div
                  key={slide.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${slide.badgeColor || 'bg-teal-500 text-slate-950'}`}>
                        {slide.badge}
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {slide.title} {slide.highlightText ? `(${slide.highlightText})` : ''}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {slide.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActive(slide.id)}
                      className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition ${
                        slide.isActive !== false
                          ? 'bg-teal-50 text-teal-700 border-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800'
                          : 'bg-slate-200 text-slate-500 border-slate-300 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                      title={slide.isActive !== false ? 'Active (Click to Hide)' : 'Hidden (Click to Show)'}
                    >
                      {slide.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleStartEdit(slide)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition"
                      title="Edit Banner"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 transition"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 dark:bg-slate-800 px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
