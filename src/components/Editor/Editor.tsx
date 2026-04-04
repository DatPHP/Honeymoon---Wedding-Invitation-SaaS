import { useState } from 'react';
import { motion } from 'motion/react';
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
  Type
} from 'lucide-react';
import PublicWedding from '../Wedding/PublicWedding';
import { cn } from '../../lib/utils';

export default function Editor({ project: initialProject, setView }: any) {
  const [project, setProject] = useState(initialProject || {
    title: 'Đám cưới của chúng mình',
    sections: [
      {
        id: '1',
        type: 'hero',
        content: { groomName: 'Tên Chú Rể', brideName: 'Tên Cô Dâu', date: '2026-04-27' }
      }
    ]
  });
  const [activeSectionId, setActiveSectionId] = useState(project.sections[0]?.id);
  const [isPreview, setIsPreview] = useState(false);

  const activeSection = project.sections.find((s: any) => s.id === activeSectionId);

  const updateSectionContent = (id: string, newContent: any) => {
    setProject({
      ...project,
      sections: project.sections.map((s: any) => 
        s.id === id ? { ...s, content: { ...s.content, ...newContent } } : s
      )
    });
  };

  const addSection = (type: string) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newSection = {
      id: newId,
      type,
      content: getDefaultContent(type),
      order: project.sections.length
    };
    setProject({ ...project, sections: [...project.sections, newSection] });
    setActiveSectionId(newId);
  };

  const deleteSection = (id: string) => {
    setProject({ ...project, sections: project.sections.filter((s: any) => s.id !== id) });
    if (activeSectionId === id) setActiveSectionId(project.sections[0]?.id);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/projects/${project.id}/update`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title: project.title,
          sections: project.sections
        }),
      });
      const data = await res.json();
      if (data.id) {
        alert('Đã lưu thành công!');
      }
    } catch (err) {
      alert('Lưu thất bại');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-50">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('dashboard')}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-bold text-slate-900">{project.title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            <Eye size={16} />
            <span>{isPreview ? 'Chỉnh sửa' : 'Xem trước'}</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-rose-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-rose-100 hover:bg-rose-700"
          >
            <Save size={16} />
            <span>Lưu lại</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!isPreview && (
          <aside className="flex w-80 flex-col border-r bg-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cấu trúc thiệp</h3>
                <div className="mt-4 space-y-2">
                  {project.sections.map((section: any, index: number) => (
                    <div 
                      key={section.id}
                      onClick={() => setActiveSectionId(section.id)}
                      className={cn(
                        "group flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all",
                        activeSectionId === section.id 
                          ? "border-rose-500 bg-rose-50 text-rose-600 shadow-sm" 
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <SectionIcon type={section.type} />
                        <span className="text-sm font-bold capitalize">{section.type}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => addSection('story')}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-bold text-slate-400 transition-colors hover:border-rose-300 hover:text-rose-500"
                >
                  <Plus size={16} />
                  <span>Thêm Section</span>
                </button>
              </div>

              {activeSection && (
                <div className="border-t pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cấu hình: {activeSection.type}</h3>
                  <div className="mt-4 space-y-4">
                    {Object.keys(activeSection.content).map(key => (
                      <div key={key}>
                        <label className="text-xs font-bold text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <input 
                          type="text"
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-rose-500 focus:ring-rose-500"
                          value={activeSection.content[key]}
                          onChange={(e) => updateSectionContent(activeSection.id, { [key]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Preview Area */}
        <main className={cn(
          "flex-1 overflow-y-auto bg-slate-100 p-8 transition-all",
          isPreview && "p-0"
        )}>
          <div className={cn(
            "mx-auto h-full max-w-5xl overflow-hidden bg-white shadow-2xl transition-all",
            isPreview ? "max-w-none shadow-none" : "rounded-3xl"
          )}>
            <PublicWedding project={project} />
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionIcon({ type }: { type: string }) {
  switch (type) {
    case 'hero': return <Heart size={16} />;
    case 'story': return <Type size={16} />;
    case 'gallery': return <ImageIcon size={16} />;
    case 'rsvp': return <MessageSquare size={16} />;
    case 'gift': return <GiftIcon size={16} />;
    default: return <Plus size={16} />;
  }
}

function getDefaultContent(type: string) {
  switch (type) {
    case 'hero': return { groomName: 'Tên Chú Rể', brideName: 'Tên Cô Dâu', date: '2026-04-27' };
    case 'story': return { title: 'Lần đầu gặp gỡ', description: 'Kể lại câu chuyện của bạn...' };
    case 'gallery': return { images: ['https://picsum.photos/seed/1/800/800', 'https://picsum.photos/seed/2/800/800'] };
    case 'rsvp': return { title: 'Bạn sẽ đến chứ?' };
    case 'gift': return { accounts: [{ bankName: 'Vietcombank', accountNumber: '123456789', accountName: 'NGUYEN VAN A', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example' }] };
    default: return {};
  }
}
