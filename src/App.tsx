import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Plus, 
  LogOut, 
  Layout as LayoutIcon, 
  Users, 
  Gift, 
  Settings, 
  Trash2,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Clock,
  ExternalLink,
  PieChart,
  UserCheck,
  UserX,
} from 'lucide-react';
import Editor from './components/Editor/Editor';
import { cn } from './lib/utils';

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'editor' | 'templates' | 'guests'>('landing');
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
            {view === 'guests' && <GuestManagement key="guests" project={selectedProject} setView={setView} />}
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
      className="flex flex-col items-center justify-center py-10 text-center"
    >
      <div className="mb-6 rounded-full bg-rose-50 px-4 py-1.5 text-sm font-semibold text-rose-600 shadow-sm border border-rose-100">
        ✨ Nền tảng tổ chức đám cưới hiện đại
      </div>
      <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 md:text-8xl leading-none">
        Mọi thứ bạn cần cho một <span className="text-rose-600">Đám cưới hoàn hảo</span>.
      </h1>
      <p className="mt-8 max-w-2xl text-xl text-slate-600 leading-relaxed font-medium">
        Không chỉ là thiệp mời. Chúng tôi giúp bạn quản lý khách mời, nhận quà mừng và kể câu chuyện tình yêu của mình một cách tinh tế nhất.
      </p>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <button 
          onClick={() => setView('auth')}
          className="rounded-2xl bg-rose-600 px-10 py-5 text-xl font-bold text-white shadow-xl shadow-rose-200 transition-all hover:bg-rose-700 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0"
        >
          Bắt đầu ngay — Chỉ 越南₫0
        </button>
        <button className="rounded-2xl border border-slate-200 bg-white px-10 py-5 text-xl font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300">
          Xem Mẫu Demo
        </button>
      </div>

      <div className="mt-20 w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-2 shadow-2xl">
        <img 
          src="https://picsum.photos/seed/wedding-preview/1200/600" 
          alt="App Preview" 
          className="rounded-[2rem] w-full object-cover shadow-inner"
        />
      </div>
      
      <div className="mt-32 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl text-center mb-16">Tại sao hàng ngàn cặp đôi tin dùng Honeymoon?</h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {[
            { icon: LayoutIcon, title: "Cá nhân hóa tối đa", desc: "Tự do chỉnh sửa màu sắc, font chữ và hình ảnh để phù hợp với cá tính riêng." },
            { icon: Users, title: "CRM Khách mời", desc: "Quản lý danh sách, phân loại khách và theo dõi RSVP chỉ trên một màn hình." },
            { icon: Gift, title: "Honeymoon Fund", desc: "Nhận quà mừng tinh tế qua mã QR, giảm bớt lo lắng về hòm tiền trong ngày cưới." }
          ].map((feat, i) => (
            <div key={i} className="text-center group">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl border border-slate-100 transition-transform group-hover:scale-110 group-hover:bg-rose-50 group-hover:text-rose-600">
                <feat.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{feat.title}</h3>
              <p className="mt-3 text-lg text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900 truncate">{p.title || 'Chưa đặt tên'}</h3>
                  {p.isPremium ? (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100 uppercase">Premium</span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200 uppercase">Miễn phí</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-4 truncate italic">/{p.slug}</p>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => { setSelectedProject(p); setView('editor'); }}
                    className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800"
                  >
                    Thiết kế
                  </button>
                  <button 
                    onClick={() => { setSelectedProject(p); setView('guests'); }}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
                  >
                    <Users size={16} />
                    <span>Khách mời</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(p.id)}
                    className="rounded-xl border border-rose-100 p-2.5 text-rose-600 transition-all hover:bg-rose-50"
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

function GuestManagement({ project, setView }: any) {
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRSVPs = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/projects/${project.id}/rsvps`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) setRsvps(data);
      } catch (err) {
        console.error('Failed to fetch RSVPs');
      } finally {
        setLoading(false);
      }
    };
    fetchRSVPs();
  }, [project.id]);

  const attendingCount = rsvps.filter(r => r.attending).reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const totalRsvpCount = rsvps.length;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Quay lại Dashboard</span>
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-100 transition-all">
            <PieChart size={16} />
            <span>Sơ đồ bàn tiệc (Beta)</span>
          </button>
          <a
            href={`/wedding/${project.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <ExternalLink size={16} />
            <span>Xem trang Web</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng phản hồi</p>
              <p className="text-2xl font-bold text-slate-900">{totalRsvpCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Sẽ tham dự</p>
              <p className="text-2xl font-bold text-emerald-600">{attendingCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <UserX size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Không tham dự</p>
              <p className="text-2xl font-bold text-slate-400">{rsvps.filter(r => !r.attending).length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-amber-400 to-rose-400 p-6 shadow-lg border border-transparent">
          <div className="flex items-center gap-4 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <Gift size={24} />
            </div>
            <div>
              <p className="text-sm font-medium opacity-80">Quà mừng (Honeymoon Fund)</p>
              <p className="text-2xl font-bold">Quản lý quà mừng</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white shadow-xl border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-4">
          <h3 className="font-bold text-slate-900">Danh sách khách mời</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-8 py-4">Khách mời</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="px-4 py-4">Quan hệ</th>
                <th className="px-4 py-4">Số lượng</th>
                <th className="px-8 py-4">Lời chúc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400">Đang tải danh sách...</td>
                </tr>
              ) : rsvps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400">Chưa có ai phản hồi.</td>
                </tr>
              ) : (
                rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-8 py-4">
                      <p className="font-bold text-slate-900">{rsvp.name}</p>
                      <p className="text-xs text-slate-400">{new Date(rsvp.createdAt).toLocaleDateString('vi-VN')}</p>
                    </td>
                    <td className="px-4 py-4">
                      {rsvp.attending ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 size={12} /> Tham dự
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                          <XCircle size={12} /> Bận
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{rsvp.relationship}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{rsvp.guestCount || 1} khách</td>
                    <td className="px-8 py-4 max-w-xs">
                      <p className="truncate text-sm text-slate-500" title={rsvp.message}>{rsvp.message || '-'}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
