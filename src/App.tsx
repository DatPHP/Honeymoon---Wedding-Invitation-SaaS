import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Plus, LogOut, Layout as LayoutIcon, Users, Gift, Settings, Trash2 } from 'lucide-react';
import Editor from './components/Editor/Editor';
import { cn } from './lib/utils';

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'editor' | 'templates'>('landing');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('landing');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar user={user} logout={logout} setView={setView} />
        
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {view === 'landing' && <Landing key="landing" setView={setView} />}
            {view === 'auth' && <Auth key="auth" setUser={setUser} setView={setView} />}
            {view === 'dashboard' && <Dashboard key="dashboard" user={user} setView={setView} setSelectedProject={setSelectedProject} />}
            {view === 'editor' && <Editor key="editor" project={selectedProject} setView={setView} />}
            {view === 'templates' && <TemplateGallery key="templates" setView={setView} onSelect={setSelectedTemplate} />}
          </AnimatePresence>
        </main>
      </div>
    </QueryClientProvider>
  );
}

function Navbar({ user, logout, setView }: any) {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div 
          className="flex cursor-pointer items-center gap-2 text-xl font-bold text-rose-600"
          onClick={() => setView(user ? 'dashboard' : 'landing')}
        >
          <Heart className="fill-rose-600" />
          <span>Honeymoon</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm font-medium text-slate-600 md:block">Chào, {user.name}</span>
              <button 
                onClick={logout}
                className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setView('auth')}
              className="rounded-full bg-rose-600 px-6 py-2 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
            >
              Bắt đầu ngay
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function Landing({ setView }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
        Tạo thiệp cưới <span className="text-rose-600">online</span> tuyệt đẹp chỉ trong 15 phút
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-600">
        Nền tảng tất-cả-trong-một: Tạo landing page, quản lý khách mời RSVP, và nhận quà mừng qua QR Banking.
      </p>
      <div className="mt-10 flex gap-4">
        <button 
          onClick={() => setView('auth')}
          className="rounded-xl bg-rose-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 hover:shadow-rose-300"
        >
          Tạo thiệp miễn phí
        </button>
        <button className="rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-600 transition-colors hover:bg-slate-50">
          Xem mẫu thiệp
        </button>
      </div>
      
      <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        {[
          { icon: LayoutIcon, title: "No-code Editor", desc: "Kéo thả linh hoạt, tùy chỉnh mọi thành phần theo ý muốn." },
          { icon: Users, title: "Quản lý RSVP", desc: "Theo dõi danh sách khách mời tham dự thời gian thực." },
          { icon: Gift, title: "QR Banking", desc: "Tích hợp mã QR nhận tiền mừng hiện đại và tinh tế." }
        ].map((feat, i) => (
          <div key={i} className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <feat.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
            <p className="mt-2 text-slate-600">{feat.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Auth({ setUser, setView }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setView('dashboard');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Đã có lỗi xảy ra');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-100"
    >
      <h2 className="text-3xl font-bold text-slate-900">{isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}</h2>
      <p className="mt-2 text-slate-600">Bắt đầu hành trình hạnh phúc của bạn ngay hôm nay.</p>
      
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label className="text-sm font-medium text-slate-700">Tên của bạn</label>
            <input 
              type="text" 
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-rose-500 focus:ring-rose-500"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        )}
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input 
            type="email" 
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-rose-500 focus:ring-rose-500"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
          <input 
            type="password" 
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-rose-500 focus:ring-rose-500"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button className="w-full rounded-xl bg-rose-600 py-4 font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700">
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </button>
      </form>
      
      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="mt-6 w-full text-center text-sm font-medium text-rose-600 hover:underline"
      >
        {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
      </button>
    </motion.div>
  );
}

function Dashboard({ user, setView, setSelectedProject }: any) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    const token = localStorage.getItem('token');
    const slug = `wedding-${Math.random().toString(36).substr(2, 5)}`;
    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title: 'Đám cưới của chúng mình',
          slug: slug,
          templateId: 'default' // Placeholder
        }),
      });
      const newProject = await res.json();
      if (newProject.id) {
        setProjects([...projects, newProject] as any);
        setSelectedProject(newProject);
        setView('editor');
      }
    } catch (err) {
      alert('Không thể tạo dự án mới');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const isConfirm = window.confirm("Are you sure you want to delete this wedding template? This action cannot be undone.");
    if (!isConfirm) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProjects(projects.filter((p: any) => p.id !== projectId));
      } else {
        alert(data.error || 'Failed to delete project');
      }
    } catch (err) {
      alert('Đã có lỗi xảy ra');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dự án của bạn</h2>
          <p className="text-slate-600">Quản lý các thiệp cưới bạn đã tạo.</p>
        </div>
        <button 
          onClick={() => setView('templates')}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-bold text-white shadow-lg shadow-rose-100 transition-all hover:bg-rose-700"
        >
          <Plus size={20} />
          <span>Tạo thiệp mới</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
            <Heart size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Chưa có dự án nào</h3>
          <p className="mt-2 text-slate-600">Hãy bắt đầu bằng việc tạo thiệp cưới đầu tiên của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.map((p: any) => (
            <div key={p.id} className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-md">
              <div className="aspect-video bg-slate-100">
                {p.coverImage ? <img src={p.coverImage} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-300"><Heart size={48} /></div>}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900">{p.title || 'Chưa đặt tên'}</h3>
                <p className="text-sm text-slate-500">Slug: {p.slug}</p>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => { setSelectedProject(p); setView('editor'); }}
                    className="flex-1 rounded-lg bg-slate-900 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800"
                  >
                    Chỉnh sửa
                  </button>
                  <button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                    <Settings size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(p.id)}
                    className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa dự án"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function TemplateGallery({ setView, onSelect }: any) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates');
        const data = await res.json();
        if (Array.isArray(data)) {
          setTemplates(data as any);
          // If templates are missing, seed them
          if (data.length < 3) {
            await fetch('/api/templates/seed', { method: 'POST' });
            const reRes = await fetch('/api/templates');
            const reData = await reRes.json();
            setTemplates(reData);
          }
        }
      } catch (err) {
        console.error('Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleSelect = async (template: any) => {
    const token = localStorage.getItem('token');
    const slug = `wedding-${Math.random().toString(36).substr(2, 5)}`;
    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title: `Đám cưới của chúng mình (${template.name})`,
          slug: slug,
          templateId: template.id
        }),
      });
      const newProject = await res.json();
      if (newProject.id) {
        onSelect(template);
        window.location.reload(); // Simple way to refresh dashboard data
      }
    } catch (err) {
      alert('Không thể tạo dự án từ mẫu này');
    }
  };

  if (loading) return <div className="py-20 text-center">Đang tải các mẫu thiệp...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Chọn mẫu thiệp của bạn</h2>
        <p className="mt-4 text-slate-600">Khám phá các phong cách thiết kế đa dạng, phù hợp với cá tính của bạn.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {templates.map((t: any) => (
          <div key={t.id} className="group relative overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-xl">
            <div className="aspect-[4/3] overflow-hidden bg-slate-100">
              <img src={t.thumbnail} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900">{t.name}</h3>
              <p className="mt-2 text-sm text-slate-500">Bố cục đầy đủ: Greeting, Story, Gallery, RSVP...</p>
              <button 
                onClick={() => handleSelect(t)}
                className="mt-6 w-full rounded-xl bg-rose-600 py-3 font-bold text-white transition-all hover:bg-rose-700"
              >
                Dùng mẫu này
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => setView('dashboard')}
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          Quay lại Dashboard
        </button>
      </div>
    </motion.div>
  );
}
