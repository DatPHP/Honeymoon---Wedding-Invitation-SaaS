import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageSquare, Gift, CalendarDays, MapPin, Clock, Music, Volume2, VolumeX } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';

// ─── Shared Components ───────────────────────────────────────────────────────

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div className="h-px w-16 bg-linear-to-r from-transparent via-rose-300 to-transparent" />
      <Heart className="h-4 w-4 text-rose-300 fill-rose-100" />
      <div className="h-px w-16 bg-linear-to-r from-rose-300 via-rose-300 to-transparent" />
    </div>
  );
}

function FloralOrnament() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
      <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full border-[20px] border-rose-200" />
      <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full border-[20px] border-amber-200" />
    </div>
  );
}

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useState(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'))[0];

  useEffect(() => {
    audioRef.loop = true;
    return () => {
      audioRef.pause();
    };
  }, [audioRef]);

  const toggle = () => {
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play().catch(() => alert('Hãy nhấp chuột vào đâu đó trên trang trước khi phát nhạc.'));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      onClick={toggle}
      className={cn(
        "fixed bottom-8 left-8 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-2xl transition-all hover:scale-110 active:scale-95",
        isPlaying ? "text-rose-500 animate-pulse" : "text-slate-400"
      )}
    >
      {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      {isPlaying && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500"
        >
          <Music size={8} className="text-white" />
        </motion.div>
      )}
    </button>
  );
}

function FallingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -20, 
            left: `${Math.random() * 100}%`,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5,
            rotate: Math.random() * 360
          }}
          animate={{ 
            top: '110%',
            opacity: [0, 0.4, 0.4, 0],
            rotate: Math.random() * 720
          }}
          transition={{ 
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: "linear"
          }}
          className="absolute text-rose-300"
        >
          <Heart size={Math.random() * 20 + 10} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}

export default function PublicWedding({ project }: any) {
  if (!project) return null;
  const sections = Array.isArray(project.sections) ? project.sections : [];
  const theme = project.themeConfig || { primary: '#E29595', secondary: '#FFFFFF', font: 'serif' };

  const fontClass = theme.font === 'serif' ? 'font-serif' : theme.font === 'cursive' ? 'font-cursive' : 'font-sans';

  return (
    <div 
      className={cn("min-h-screen bg-white selection:bg-rose-100 selection:text-rose-600 overflow-x-hidden", fontClass)}
      style={{ '--primary': theme.primary } as any}
    >
      <MusicPlayer />
      {sections.map((section: any) => (
        <SectionRenderer key={section.id} section={section} theme={theme} />
      ))}
      
      {/* Universal Footer */}
      <footer className="py-12 text-center bg-slate-50 border-t border-slate-100">
        <p className="font-cursive text-3xl text-rose-300 mb-2">Thank You</p>
        <p className="text-sm text-slate-400 font-sans tracking-widest uppercase">For being part of our journey</p>
      </footer>
    </div>
  );
}

function SectionRenderer({ section, theme }: any) {
  const { type, content } = section;
  if (!content) return null;

  switch (type) {
    case 'hero':      return <HeroSection      content={content} theme={theme} />;
    case 'countdown': return <CountdownSection content={content} theme={theme} />;
    case 'greeting':  return <GreetingSection  content={content} theme={theme} />;
    case 'story':     return <StorySection     content={content} theme={theme} />;
    case 'gallery':   return <GallerySection   content={content} theme={theme} />;
    case 'event':     return <EventSection     content={content} theme={theme} />;
    case 'rsvp':      return <RSVPSection      content={content} theme={theme} projectId={section.projectId} />;
    case 'gift':      return <GiftSection      content={content} theme={theme} />;
    default:          return null;
  }
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function CountdownSection({ content, theme }: any) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(content.targetDate || '2026-12-31').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [content.targetDate]);

  return (
    <section className="py-20 text-center bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10" style={{ color: theme.primary }}>{content.title || 'Đếm ngược ngày hạnh phúc'}</h2>
        <div className="flex justify-center gap-4 md:gap-8">
          {[
            { label: 'Ngày', value: timeLeft.days },
            { label: 'Giờ', value: timeLeft.hours },
            { label: 'Phút', value: timeLeft.minutes },
            { label: 'Giây', value: timeLeft.seconds }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold shadow-sm md:h-24 md:w-24 md:text-4xl"
                style={{ color: theme.primary }}
              >
                {item.value}
              </div>
              <span className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ content, theme }: any) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      <FloralOrnament />
      <FallingHearts />
      
      {/* Decorative Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rotate-45">
          <path d="M50 0 C70 0 100 30 100 50 C100 70 70 100 50 100 C30 100 0 70 0 50 C0 30 30 0 50 0" fill="currentColor" className="text-rose-400" />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rotate-12">
          <path d="M50 0 C70 0 100 30 100 50 C100 70 70 100 50 100 C30 100 0 70 0 50 C0 30 30 0 50 0" fill="currentColor" className="text-amber-400" />
        </svg>
      </div>

      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 5, ease: "easeOut" }}
          className="h-full w-full"
        >
          <img
            src={content.backgroundImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80'}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            alt=""
          />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 max-w-4xl px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="mb-6 flex items-center justify-center gap-4"
        >
          <div className="h-px w-12 bg-rose-300" />
          <Heart className="h-6 w-6 text-rose-400 fill-rose-400" />
          <div className="h-px w-12 bg-rose-300" />
        </motion.div>

        <p className="mb-4 font-cursive text-4xl text-rose-400 md:text-5xl">
          Save the Date
        </p>

        <h1 className="font-serif text-6xl font-bold tracking-tight text-slate-900 md:text-9xl leading-none">
          <span className="block mb-2">{content.groomName || 'Chú Rể'}</span>
          <span className="font-cursive text-5xl md:text-7xl block my-4 text-rose-300 leading-none">&</span>
          <span className="block">{content.brideName || 'Cô Dâu'}</span>
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 font-sans text-lg font-medium tracking-[0.3em] uppercase text-slate-500"
        >
          {content.subtitle || 'Chúng mình kết hôn rồi!'}
        </motion.p>

        <div 
          className="mt-12 inline-flex items-center gap-8 border-y border-rose-200 py-4 px-12"
        >
          <span className="font-serif text-2xl font-bold text-slate-700">
            {content.date ? new Date(content.date).getDate() : '??'}
          </span>
          <span className="h-8 w-px bg-rose-200" />
          <span className="font-serif text-2xl font-bold text-slate-700 uppercase tracking-widest">
            {content.date ? new Date(content.date).toLocaleString('vi-VN', { month: 'long' }) : 'Tháng'}
          </span>
          <span className="h-8 w-px bg-rose-200" />
          <span className="font-serif text-2xl font-bold text-slate-700">
            {content.date ? new Date(content.date).getFullYear() : '202X'}
          </span>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Greeting ────────────────────────────────────────────────────────────────

function GreetingSection({ content, theme }: any) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto max-w-4xl px-6 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-6" style={{ color: theme.primary }}>{content.title || 'Chào mừng bạn!'}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{content.content}</p>
        </div>
        {content.image && (
          <div className="flex-1">
            <img 
              src={content.image} 
              className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" 
              referrerPolicy="no-referrer"
              alt="Greeting" 
            />
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────

function StorySection({ content, theme }: any) {
  const items: any[] = content.items ?? [];

  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <FloralOrnament />
      <div className="container mx-auto max-w-4xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="font-cursive text-3xl text-rose-300 mb-2">Our Story</p>
          <h2 className="font-serif text-5xl font-bold text-slate-900 tracking-tight">Hành trình yêu thương</h2>
          <Ornament />
        </motion.div>

        {items.length === 0 && (
          <p className="mt-12 text-center text-slate-400 italic">Chưa có cột mốc nào.</p>
        )}

        <div className="relative mt-24">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-linear-to-b from-rose-100 via-rose-300 to-rose-100 hidden md:block" />

          <div className="space-y-24">
            {items.map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={cn(
                  'relative flex flex-col items-center md:flex-row',
                  i % 2 !== 0 && 'md:flex-row-reverse'
                )}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 top-0 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-rose-400 shadow-[0_0_0_4px_rgba(251,113,133,0.1)] hidden md:block" />

                <div className="w-full md:w-1/2 px-8">
                  <div className={cn(
                    "relative overflow-hidden rounded-3xl shadow-2xl transition-transform hover:scale-[1.02]",
                    i % 2 === 0 ? "md:mr-4" : "md:ml-4"
                  )}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80'}
                      className="h-80 w-full object-cover"
                      referrerPolicy="no-referrer"
                      alt={item.title}
                    />
                  </div>
                </div>

                <div className={cn(
                  "w-full md:w-1/2 px-8 mt-8 md:mt-0 text-center",
                  i % 2 === 0 ? "md:text-left" : "md:text-right"
                )}>
                  <span className="font-serif text-2xl italic text-rose-300 block mb-2">{item.date}</span>
                  <h3 className="font-serif text-3xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-lg leading-relaxed text-slate-600 font-sans">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function GallerySection({ content, theme }: any) {
  const images: string[] = content.images ?? [];

  return (
    <section className="py-24" style={{ backgroundColor: `${theme.primary}05` }}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-slate-900">
            {content.title || 'Album kỷ niệm'}
          </h2>
        </motion.div>

        {images.length === 0 && (
          <p className="mt-12 text-center text-slate-400 italic">Chưa có ảnh nào.</p>
        )}

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="aspect-square overflow-hidden rounded-2xl shadow-sm"
            >
              <img src={img} className="h-full w-full object-cover" referrerPolicy="no-referrer" alt="" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Event ────────────────────────────────────────────────────────────────────

function EventSection({ content, theme }: any) {
  const events: any[] = content.events ?? [];

  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return {
        time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        date: d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      };
    } catch {
      return { time: '', date: dateStr };
    }
  };

  const sideLabel: Record<string, string> = {
    BRIDE: 'Lễ Vu Quy',
    GROOM: 'Lễ Thành Hôn',
  };

  return (
    <section className="bg-slate-50 py-32 relative overflow-hidden">
      <FloralOrnament />
      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="font-cursive text-3xl text-rose-300 mb-2">The Wedding</p>
          <h2 className="font-serif text-5xl font-bold text-slate-900 uppercase tracking-widest">Thông tin buổi lễ</h2>
          <Ornament />
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {events.map((ev: any, i: number) => {
            const dateInfo = formatEventDate(ev.date) as any;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="group relative overflow-hidden rounded-[3rem] bg-white p-12 text-center shadow-2xl ring-1 ring-slate-100"
              >
                <div className="absolute top-0 left-1/2 h-1 w-32 -translate-x-1/2 bg-rose-300" />
                
                <h3 className="font-cursive text-4xl text-rose-300 mb-4">
                  {sideLabel[ev.side] || ev.title}
                </h3>
                
                <div className="mb-10 flex flex-col items-center">
                  <Clock className="mb-4 h-8 w-8 text-rose-200" />
                  <p className="font-serif text-4xl font-bold text-slate-900 mb-2">{dateInfo.time}</p>
                  <p className="font-sans text-sm tracking-[0.2em] uppercase text-slate-400">{dateInfo.date}</p>
                </div>

                <div className="mb-10 flex flex-col items-center">
                  <MapPin className="mb-4 h-8 w-8 text-rose-200" />
                  <p className="font-serif text-2xl font-bold text-slate-900 mb-2">{ev.location}</p>
                  <p className="font-sans text-sm leading-relaxed text-slate-500 max-w-xs">{ev.address}</p>
                </div>

                {ev.mapUrl && (
                  <a
                    href={ev.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-full bg-rose-50 px-8 py-3 text-sm font-bold uppercase tracking-widest text-rose-600 transition-all hover:bg-rose-600 hover:text-white"
                  >
                    <span>Xem bản đồ</span>
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────

function RSVPSection({ content, theme, projectId }: any) {
  const [formData, setFormData] = useState({
    name: '',
    attending: 'true',
    relationship: 'Bàn bè',
    message: '',
    guestCount: '1'
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          projectId,
          attending: formData.attending === 'true'
        })
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section className="py-24 text-white" style={{ backgroundColor: theme.primary }}>
        <div className="container mx-auto max-w-2xl px-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Heart className="mx-auto mb-6 h-16 w-16 fill-white" />
            <h2 className="text-4xl font-bold">Cảm ơn bạn!</h2>
            <p className="mt-4 text-xl opacity-90">Phản hồi của bạn đã được gửi đến cô dâu & chú rể.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 text-white" style={{ backgroundColor: theme.primary }}>
      <div className="container mx-auto max-w-2xl px-6 text-center">
        <MessageSquare className="mx-auto mb-6 h-12 w-12" />
        <h2 className="text-4xl font-bold">
          {content.title || 'Bạn sẽ đến chứ?'}
        </h2>
        <p className="mt-4 opacity-90">
          {content.subtitle || 'Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi.'}
        </p>

        <form className="mt-10 space-y-4 text-left" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium opacity-80 mb-1 block">Tên của bạn</label>
            <input
              type="text"
              required
              placeholder="Nhập họ và tên..."
              className="w-full rounded-xl border-none bg-white/10 px-6 py-4 text-white placeholder:text-rose-100 focus:ring-2 focus:ring-white focus:outline-none"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium opacity-80 mb-1 block">Số lượng khách</label>
              <select 
                className="w-full rounded-xl border-none bg-white/10 px-4 py-4 text-white focus:ring-2 focus:ring-white focus:outline-none"
                value={formData.guestCount}
                onChange={e => setFormData({ ...formData, guestCount: e.target.value })}
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="text-slate-900">{n} người</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium opacity-80 mb-1 block">Xác nhận</label>
              <select 
                className="w-full rounded-xl border-none bg-white/10 px-4 py-4 text-white focus:ring-2 focus:ring-white focus:outline-none"
                value={formData.attending}
                onChange={e => setFormData({ ...formData, attending: e.target.value })}
              >
                <option value="true" className="text-slate-900">Sẽ tham dự</option>
                <option value="false" className="text-slate-900">Rất tiếc, không thể</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium opacity-80 mb-1 block">Lời nhắn</label>
            <textarea
              placeholder="Lời chúc gửi đến cô dâu & chú rể..."
              rows={4}
              className="w-full rounded-xl border-none bg-white/10 px-6 py-4 text-white placeholder:text-rose-100 focus:ring-2 focus:ring-white focus:outline-none"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full rounded-xl bg-white py-4 font-bold text-rose-600 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {status === 'submitting' ? 'Đang gửi...' : 'Gửi lời chúc'}
          </button>
          {status === 'error' && <p className="text-center text-sm font-bold text-rose-200">Đã có lỗi xảy ra. Vui lòng thử lại.</p>}
        </form>
      </div>
    </section>
  );
}

// ─── Gift ─────────────────────────────────────────────────────────────────────

function GiftSection({ content, theme }: any) {
  const accounts: any[] = content.accounts ?? [];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <Gift className="mx-auto mb-6 h-12 w-12" style={{ color: theme.primary }} />
        <h2 className="text-4xl font-bold text-slate-900">
          {content.title || 'Gửi quà chúc mừng'}
        </h2>
        <p className="mt-4 text-slate-600">
          {content.subtitle || 'Nếu bạn muốn gửi quà mừng từ xa, chúng mình xin cảm ơn rất nhiều.'}
        </p>

        {accounts.length === 0 && (
          <p className="mt-12 text-slate-400 italic">Chưa có tài khoản ngân hàng nào.</p>
        )}

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {accounts.map((acc: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-8"
            >
              {acc.qrCode ? (
                <img
                  src={acc.qrCode}
                  className="mx-auto h-48 w-48 rounded-2xl bg-white p-2 shadow-sm"
                  referrerPolicy="no-referrer"
                  alt={`QR ${acc.bankName}`}
                />
              ) : (
                <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-white shadow-sm text-slate-300">
                  <Gift size={48} />
                </div>
              )}
              <h3 className="mt-6 text-xl font-bold text-slate-900">{acc.bankName}</h3>
              <p className="mt-1 font-mono text-lg text-slate-600">{acc.accountNumber}</p>
              <p className="mt-1 font-medium uppercase text-slate-500">{acc.accountName}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
