import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  Gift as GiftIcon,
  Type,
  CalendarDays,
  X,
  CheckCircle2,
} from 'lucide-react';
import PublicWedding from '../Wedding/PublicWedding';
import { cn } from '../../lib/utils';

// ─── Section catalogue: single source of truth ──────────────────────────────

export const SECTION_TYPES = [
  {
    type: 'hero',
    label: 'Trang bìa',
    description: 'Tên cô dâu & chú rể, ngày cưới — bắt buộc có 1.',
    icon: Heart,
    color: 'rose',
    singleton: true, // at most one
  },
  {
    type: 'story',
    label: 'Câu chuyện tình yêu',
    description: 'Dòng thời gian các cột mốc tình yêu có hình ảnh.',
    icon: Type,
    color: 'pink',
  },
  {
    type: 'gallery',
    label: 'Album ảnh',
    description: 'Lưới ảnh kỷ niệm của hai bạn.',
    icon: ImageIcon,
    color: 'violet',
  },
  {
    type: 'event',
    label: 'Sự kiện đám cưới',
    description: 'Thông tin lễ cưới: địa điểm, giờ, bản đồ.',
    icon: CalendarDays,
    color: 'amber',
  },
  {
    type: 'rsvp',
    label: 'RSVP / Xác nhận',
    description: 'Form xác nhận tham dự và gửi lời chúc.',
    icon: MessageSquare,
    color: 'sky',
  },
  {
    type: 'gift',
    label: 'Gửi quà mừng',
    description: 'Tài khoản ngân hàng và mã QR nhận tiền mừng.',
    icon: GiftIcon,
    color: 'emerald',
  },
] as const;

export type SectionType = (typeof SECTION_TYPES)[number]['type'];

const SECTION_LABELS: Record<string, string> = Object.fromEntries(
  SECTION_TYPES.map((s) => [s.type, s.label])
);

// ─── Default content per section type ────────────────────────────────────────
// Shapes here must match the renderers in PublicWedding.tsx exactly.

function getDefaultContent(type: string) {
  switch (type) {
    case 'hero':
      return {
        groomName: 'Tên Chú Rể',
        brideName: 'Tên Cô Dâu',
        date: '2026-04-27',
        subtitle: 'Chúng mình kết hôn rồi!',
      };
    case 'story':
      return {
        items: [
          {
            date: '01/01/2023',
            title: 'Lần đầu gặp gỡ',
            description: 'Kể lại câu chuyện của bạn tại đây...',
            image: 'https://picsum.photos/seed/story1/400/400',
          },
        ],
      };
    case 'gallery':
      return {
        title: 'Album kỷ niệm',
        images: [
          'https://picsum.photos/seed/g1/800/800',
          'https://picsum.photos/seed/g2/800/800',
          'https://picsum.photos/seed/g3/800/800',
          'https://picsum.photos/seed/g4/800/800',
        ],
      };
    case 'event':
      return {
        // Mirrors the EventInfo schema (side / title / date / location / address / mapUrl)
        events: [
          {
            side: 'BRIDE',
            title: 'Lễ Vu Quy',
            date: '2026-04-27T08:00',
            location: 'Nhà Cô Dâu',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            mapUrl: '',
          },
          {
            side: 'GROOM',
            title: 'Lễ Tân Hôn',
            date: '2026-04-27T18:00',
            location: 'Nhà Hàng XYZ',
            address: '456 Đường DEF, Quận 3, TP.HCM',
            mapUrl: '',
          },
        ],
      };
    case 'rsvp':
      return {
        title: 'Bạn sẽ đến chứ?',
        subtitle: 'Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi.',
      };
    case 'gift':
      return {
        title: 'Gửi quà chúc mừng',
        subtitle: 'Nếu bạn muốn gửi quà mừng từ xa, chúng mình xin cảm ơn rất nhiều.',
        accounts: [
          {
            bankName: 'Vietcombank',
            accountNumber: '1234567890',
            accountName: 'NGUYEN VAN A',
            qrCode:
              'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021238570010A000000727012700069704220113114244938650208QRIBFTTA5303704540315000000000000006304E665',
          },
        ],
      };
    default:
      return {};
  }
}

// ─── normalizeProject  ────────────────────────────────────────────────────────

function normalizeProject(raw: any) {
  const defaultProject = {
    title: 'Đám cưới của chúng mình',
    sections: [
      {
        id: '1',
        type: 'hero',
        content: getDefaultContent('hero'),
      },
    ],
  };

  if (!raw) return defaultProject;

  return {
    ...raw,
    sections:
      Array.isArray(raw.sections) && raw.sections.length > 0
        ? raw.sections
        : defaultProject.sections,
  };
}

// ─── Inline section config panels ────────────────────────────────────────────

function HeroConfig({ content, onChange }: any) {
  const fields = [
    { key: 'groomName', label: 'Tên Chú Rể' },
    { key: 'brideName', label: 'Tên Cô Dâu' },
    { key: 'date', label: 'Ngày cưới (YYYY-MM-DD)', type: 'date' },
    { key: 'subtitle', label: 'Câu tagline' },
    { key: 'backgroundImage', label: 'Ảnh nền (URL)' },
  ];
  return (
    <div className="space-y-3">
      {fields.map(({ key, label, type }) => (
        <div key={key}>
          <label className="text-xs font-semibold text-slate-500">{label}</label>
          <input
            type={type || 'text'}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
            value={content[key] ?? ''}
            onChange={(e) => onChange({ [key]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

function StoryConfig({ content, onChange }: any) {
  const items: any[] = content.items ?? [];

  const updateItem = (i: number, patch: any) => {
    const next = items.map((item, idx) => (idx === i ? { ...item, ...patch } : item));
    onChange({ items: next });
  };

  const addItem = () =>
    onChange({
      items: [
        ...items,
        {
          date: '',
          title: 'Cột mốc mới',
          description: '',
          image: `https://picsum.photos/seed/story${items.length + 2}/400/400`,
        },
      ],
    });

  const removeItem = (i: number) => onChange({ items: items.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Sự kiện #{i + 1}</span>
            <button onClick={() => removeItem(i)} className="p-1 text-slate-300 hover:text-rose-500">
              <X size={12} />
            </button>
          </div>
          {['date', 'title', 'description', 'image'].map((k) => (
            <div key={k}>
              <label className="text-xs text-slate-400 capitalize">{k === 'image' ? 'Ảnh (URL)' : k}</label>
              <input
                className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-rose-500 focus:outline-none"
                value={item[k] ?? ''}
                onChange={(e) => updateItem(i, { [k]: e.target.value })}
              />
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-2 text-xs font-bold text-slate-400 hover:border-pink-300 hover:text-pink-500"
      >
        <Plus size={12} /> Thêm cột mốc
      </button>
    </div>
  );
}

function GalleryConfig({ content, onChange }: any) {
  const images: string[] = content.images ?? [];
  const update = (i: number, val: string) =>
    onChange({ images: images.map((img, idx) => (idx === i ? val : img)) });
  const add = () => onChange({ images: [...images, `https://picsum.photos/seed/g${Date.now()}/800/800`] });
  const remove = (i: number) => onChange({ images: images.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500">Tiêu đề album</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
          value={content.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500">Ảnh ({images.length})</label>
        {images.map((img, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:border-rose-500 focus:outline-none"
              value={img}
              onChange={(e) => update(i, e.target.value)}
            />
            <button onClick={() => remove(i)} className="text-slate-300 hover:text-rose-500">
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={add}
          className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-2 text-xs font-bold text-slate-400 hover:border-violet-300 hover:text-violet-500"
        >
          <Plus size={12} /> Thêm ảnh
        </button>
      </div>
    </div>
  );
}

function EventConfig({ content, onChange }: any) {
  const events: any[] = content.events ?? [];

  const updateEvent = (i: number, patch: any) =>
    onChange({ events: events.map((ev, idx) => (idx === i ? { ...ev, ...patch } : ev)) });

  const addEvent = () =>
    onChange({
      events: [
        ...events,
        { side: 'GROOM', title: 'Sự kiện mới', date: '', location: '', address: '', mapUrl: '' },
      ],
    });

  const removeEvent = (i: number) => onChange({ events: events.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      {events.map((ev, i) => (
        <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{ev.side === 'BRIDE' ? '👰 Nhà gái' : '🤵 Nhà trai'} — {ev.title}</span>
            <button onClick={() => removeEvent(i)} className="p-1 text-slate-300 hover:text-rose-500"><X size={12} /></button>
          </div>
          <div>
            <label className="text-xs text-slate-400">Nhà (BRIDE / GROOM)</label>
            <select
              className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:outline-none"
              value={ev.side}
              onChange={(e) => updateEvent(i, { side: e.target.value })}
            >
              <option value="BRIDE">BRIDE — Nhà gái</option>
              <option value="GROOM">GROOM — Nhà trai</option>
            </select>
          </div>
          {[
            { k: 'title', label: 'Tên sự kiện' },
            { k: 'date', label: 'Ngày & giờ', type: 'datetime-local' },
            { k: 'location', label: 'Địa điểm' },
            { k: 'address', label: 'Địa chỉ' },
            { k: 'mapUrl', label: 'Link Google Maps (URL)' },
          ].map(({ k, label, type }) => (
            <div key={k}>
              <label className="text-xs text-slate-400">{label}</label>
              <input
                type={type || 'text'}
                className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-rose-500 focus:outline-none"
                value={ev[k] ?? ''}
                onChange={(e) => updateEvent(i, { [k]: e.target.value })}
              />
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={addEvent}
        className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-2 text-xs font-bold text-slate-400 hover:border-amber-300 hover:text-amber-500"
      >
        <Plus size={12} /> Thêm sự kiện
      </button>
    </div>
  );
}

function RSVPConfig({ content, onChange }: any) {
  return (
    <div className="space-y-3">
      {[{ key: 'title', label: 'Tiêu đề' }, { key: 'subtitle', label: 'Mô tả phụ' }].map(({ key, label }) => (
        <div key={key}>
          <label className="text-xs font-semibold text-slate-500">{label}</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
            value={content[key] ?? ''}
            onChange={(e) => onChange({ [key]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

function GiftConfig({ content, onChange }: any) {
  const accounts: any[] = content.accounts ?? [];

  const updateAcc = (i: number, patch: any) =>
    onChange({ accounts: accounts.map((a, idx) => (idx === i ? { ...a, ...patch } : a)) });

  const addAcc = () =>
    onChange({
      accounts: [
        ...accounts,
        { bankName: '', accountNumber: '', accountName: '', qrCode: '' },
      ],
    });

  const removeAcc = (i: number) => onChange({ accounts: accounts.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      {[{ key: 'title', label: 'Tiêu đề' }, { key: 'subtitle', label: 'Mô tả phụ' }].map(({ key, label }) => (
        <div key={key}>
          <label className="text-xs font-semibold text-slate-500">{label}</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
            value={content[key] ?? ''}
            onChange={(e) => onChange({ [key]: e.target.value })}
          />
        </div>
      ))}
      <div className="space-y-3 pt-1">
        <label className="text-xs font-semibold text-slate-500">Tài khoản ngân hàng</label>
        {accounts.map((acc, i) => (
          <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Tài khoản #{i + 1}</span>
              <button onClick={() => removeAcc(i)} className="p-1 text-slate-300 hover:text-rose-500"><X size={12} /></button>
            </div>
            {[
              { k: 'bankName', label: 'Ngân hàng' },
              { k: 'accountNumber', label: 'Số tài khoản' },
              { k: 'accountName', label: 'Tên chủ TK (in hoa)' },
              { k: 'qrCode', label: 'Ảnh QR (URL)' },
            ].map(({ k, label }) => (
              <div key={k}>
                <label className="text-xs text-slate-400">{label}</label>
                <input
                  className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-rose-500 focus:outline-none"
                  value={acc[k] ?? ''}
                  onChange={(e) => updateAcc(i, { [k]: e.target.value })}
                />
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={addAcc}
          className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-2 text-xs font-bold text-slate-400 hover:border-emerald-300 hover:text-emerald-500"
        >
          <Plus size={12} /> Thêm tài khoản
        </button>
      </div>
    </div>
  );
}

function SectionConfigPanel({ section, onChange }: { section: any; onChange: (patch: any) => void }) {
  switch (section.type) {
    case 'hero':    return <HeroConfig    content={section.content} onChange={onChange} />;
    case 'story':   return <StoryConfig   content={section.content} onChange={onChange} />;
    case 'gallery': return <GalleryConfig content={section.content} onChange={onChange} />;
    case 'event':   return <EventConfig   content={section.content} onChange={onChange} />;
    case 'rsvp':    return <RSVPConfig    content={section.content} onChange={onChange} />;
    case 'gift':    return <GiftConfig    content={section.content} onChange={onChange} />;
    default:        return <p className="text-xs text-slate-400 italic">Không có tùy chỉnh cho loại này.</p>;
  }
}

// ─── Section type picker modal ────────────────────────────────────────────────

const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string }> = {
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200' },
  pink:    { bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-200' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200' },
  sky:     { bg: 'bg-sky-50',     text: 'text-sky-600',     border: 'border-sky-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
};

function SectionPickerModal({
  onSelect,
  onClose,
  existingTypes,
}: {
  onSelect: (type: string) => void;
  onClose: () => void;
  existingTypes: string[];
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Thêm section mới</h2>
              <p className="mt-0.5 text-sm text-slate-500">Chọn loại nội dung bạn muốn thêm vào thiệp.</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SECTION_TYPES.map((st) => {
              const isDisabled = (st as any).singleton && existingTypes.includes(st.type);
              const colors = COLOR_CLASSES[st.color] ?? COLOR_CLASSES['rose'];
              const Icon = st.icon;

              return (
                <button
                  key={st.type}
                  disabled={isDisabled}
                  onClick={() => { onSelect(st.type); onClose(); }}
                  className={cn(
                    'group flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all',
                    isDisabled
                      ? 'cursor-not-allowed border-slate-100 opacity-40'
                      : `cursor-pointer border-slate-100 hover:${colors.border} hover:${colors.bg}`
                  )}
                >
                  <div className={cn('mt-0.5 rounded-xl p-2 transition-colors', isDisabled ? 'bg-slate-100' : `${colors.bg} group-hover:${colors.bg}`)}>
                    <Icon size={18} className={isDisabled ? 'text-slate-400' : colors.text} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{st.label}</span>
                      {isDisabled && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">
                          Đã có
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{st.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── SectionIcon helper ───────────────────────────────────────────────────────

function SectionIcon({ type }: { type: string }) {
  const meta = SECTION_TYPES.find((s) => s.type === type);
  if (!meta) return <Plus size={14} />;
  const Icon = meta.icon;
  return <Icon size={14} />;
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function Editor({ project: initialProject, setView }: any) {
  const [project, setProject] = useState(() => normalizeProject(initialProject));
  const [activeSectionId, setActiveSectionId] = useState<string>(project.sections[0]?.id);
  const [isPreview, setIsPreview] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const activeSection = project.sections.find((s: any) => s.id === activeSectionId);
  const existingTypes: string[] = project.sections.map((s: any) => s.type);

  // ── mutators ────────────────────────────────────────────────────────────────

  const updateSectionContent = (id: string, patch: any) => {
    setProject((prev: any) => ({
      ...prev,
      sections: prev.sections.map((s: any) =>
        s.id === id ? { ...s, content: { ...s.content, ...patch } } : s
      ),
    }));
  };

  const addSection = (type: string) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setProject((prev: any) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { id: newId, type, content: getDefaultContent(type), order: prev.sections.length },
      ],
    }));
    setActiveSectionId(newId);
  };

  const deleteSection = (id: string) => {
    setProject((prev: any) => {
      const next = prev.sections.filter((s: any) => s.id !== id);
      return { ...prev, sections: next };
    });
    setActiveSectionId((prev) => (prev === id ? project.sections[0]?.id : prev));
  };

  const moveSection = (id: string, dir: 'up' | 'down') => {
    setProject((prev: any) => {
      const idx = prev.sections.findIndex((s: any) => s.id === id);
      if (idx === -1) return prev;
      const next = [...prev.sections];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...prev, sections: next.map((s, i) => ({ ...s, order: i })) };
    });
  };

  const handleSave = async () => {
    setSaveState('saving');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/projects/${project.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: project.title, sections: project.sections }),
      });
      const data = await res.json();
      if (data.id) {
        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 2500);
      } else {
        setSaveState('error');
        setTimeout(() => setSaveState('idle'), 2500);
      }
    } catch {
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 2500);
    }
  };

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {showPicker && (
        <SectionPickerModal
          onSelect={addSection}
          onClose={() => setShowPicker(false)}
          existingTypes={existingTypes}
        />
      )}

      <div className="fixed inset-0 z-[60] flex flex-col bg-slate-50">
        {/* ── Header ── */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('dashboard')}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">{project.title}</h1>
              <p className="text-xs text-slate-400">{project.sections.length} section</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreview((p) => !p)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Eye size={15} />
              <span>{isPreview ? 'Chỉnh sửa' : 'Xem trước'}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className={cn(
                'flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white shadow transition-all',
                saveState === 'saved'
                  ? 'bg-emerald-500 shadow-emerald-100'
                  : saveState === 'error'
                  ? 'bg-red-500'
                  : 'bg-rose-600 shadow-rose-100 hover:bg-rose-700'
              )}
            >
              {saveState === 'saved' ? <CheckCircle2 size={15} /> : <Save size={15} />}
              <span>
                {saveState === 'saving' ? 'Đang lưu…' : saveState === 'saved' ? 'Đã lưu!' : saveState === 'error' ? 'Lỗi!' : 'Lưu lại'}
              </span>
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* ── Sidebar ── */}
          {!isPreview && (
            <aside className="flex w-80 shrink-0 flex-col border-r bg-white overflow-hidden">
              {/* Section list */}
              <div className="flex-shrink-0 border-b p-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Cấu trúc thiệp</h3>
                <div className="mt-3 space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {project.sections.map((section: any, idx: number) => (
                    <div
                      key={section.id}
                      onClick={() => setActiveSectionId(section.id)}
                      className={cn(
                        'group flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 transition-all',
                        activeSectionId === section.id
                          ? 'border-rose-400 bg-rose-50 text-rose-600 shadow-sm'
                          : 'border-slate-100 text-slate-700 hover:border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <SectionIcon type={section.type} />
                        <span className="truncate text-sm font-semibold">
                          {SECTION_LABELS[section.type] ?? section.type}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }}
                          disabled={idx === 0}
                          className="rounded p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <MoveUp size={12} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }}
                          disabled={idx === project.sections.length - 1}
                          className="rounded p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <MoveDown size={12} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                          className="rounded p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowPicker(true)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:border-rose-300 hover:text-rose-500"
                >
                  <Plus size={14} />
                  Thêm section
                </button>
              </div>

              {/* Config panel for active section */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeSection ? (
                  <>
                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      <SectionIcon type={activeSection.type} />
                      {SECTION_LABELS[activeSection.type] ?? activeSection.type}
                    </h3>
                    <SectionConfigPanel
                      section={activeSection}
                      onChange={(patch) => updateSectionContent(activeSection.id, patch)}
                    />
                  </>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center pt-8">
                    Chọn một section để chỉnh sửa nội dung
                  </p>
                )}
              </div>
            </aside>
          )}

          {/* ── Preview canvas ── */}
          <main
            className={cn(
              'flex-1 overflow-y-auto bg-slate-100 transition-all',
              isPreview ? 'p-0' : 'p-6'
            )}
          >
            <div
              className={cn(
                'mx-auto overflow-hidden bg-white transition-all',
                isPreview ? 'max-w-none shadow-none min-h-full' : 'max-w-4xl rounded-3xl shadow-2xl'
              )}
            >
              <PublicWedding project={project} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
