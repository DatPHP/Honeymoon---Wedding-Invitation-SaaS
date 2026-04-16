import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageSquare, Gift, CalendarDays, MapPin, Clock } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';

export default function PublicWedding({ project }: any) {
  if (!project) return null;
  const sections = Array.isArray(project.sections) ? project.sections : [];
  const theme = project.themeConfig || { primary: '#E29595', secondary: '#FFFFFF', font: 'serif' };

  const fontClass = theme.font === 'serif' ? 'font-serif' : theme.font === 'cursive' ? 'font-cursive' : 'font-sans';

  return (
    <div 
      className={cn("min-h-screen bg-white selection:bg-rose-100 selection:text-rose-600", fontClass)}
      style={{ '--primary': theme.primary } as any}
    >
      {sections.map((section: any) => (
        <SectionRenderer key={section.id} section={section} theme={theme} />
      ))}
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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden" style={{ backgroundColor: `${theme.primary}10` }}>
      {/* Background image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src={content.backgroundImage || 'https://picsum.photos/seed/wedding/1920/1080'}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          alt=""
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 px-4 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart className="mx-auto mb-8 h-14 w-14" style={{ fill: theme.primary, color: theme.primary }} />
        </motion.div>

        <h1 className="text-6xl font-bold tracking-tight text-slate-900 md:text-8xl">
          {content.groomName || 'Chú Rể'}&nbsp;&amp;&nbsp;{content.brideName || 'Cô Dâu'}
        </h1>

        <p className="mt-6 text-2xl font-medium italic text-slate-600">
          {content.subtitle || 'Chúng mình kết hôn rồi!'}
        </p>

        <div 
          className="mt-10 inline-block rounded-full bg-white/80 px-8 py-3 text-xl font-bold shadow-sm backdrop-blur-sm"
          style={{ color: theme.primary }}
        >
          {content.date ? formatDate(content.date) : 'Sắp diễn ra'}
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
    <section className="bg-white py-24">
      <div className="container mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Heart className="mx-auto mb-4 h-8 w-8" style={{ fill: theme.primary, color: theme.primary }} />
          <h2 className="text-4xl font-bold text-slate-900">{content.title || 'Câu chuyện tình yêu'}</h2>
        </motion.div>

        {items.length === 0 && (
          <p className="mt-12 text-center text-slate-400 italic">Chưa có cột mốc nào.</p>
        )}

        <div className="mt-16 space-y-16">
          {items.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={cn(
                'flex flex-col items-center gap-10 md:flex-row',
                i % 2 !== 0 && 'md:flex-row-reverse'
              )}
            >
              <div className="h-64 w-64 shrink-0 overflow-hidden rounded-full border-8 shadow-xl" style={{ borderColor: `${theme.primary}20` }}>
                <img
                  src={item.image || 'https://picsum.photos/seed/placeholder/400/400'}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  alt={item.title}
                />
              </div>
              <div className="flex-1 text-left">
                <span className="text-base font-bold" style={{ color: theme.primary }}>{item.date}</span>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
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
      return new Date(dateStr).toLocaleString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const sideLabel: Record<string, string> = {
    BRIDE: '👰 Nhà Gái',
    GROOM: '🤵 Nhà Trai',
  };

  return (
    <section className="bg-amber-50 py-24">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <CalendarDays className="mx-auto mb-4 h-10 w-10" style={{ color: theme.primary }} />
          <h2 className="text-4xl font-bold text-slate-900">{content.title || 'Sự kiện đám cưới'}</h2>
          <p className="mt-3 text-slate-600">Thông tin chi tiết về các buổi lễ cưới.</p>
        </motion.div>

        {events.length === 0 && (
          <p className="mt-12 text-center text-slate-400 italic">Chưa có sự kiện nào.</p>
        )}

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {events.map((ev: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm"
            >
              {/* Card header */}
              <div className="bg-gradient-to-r from-amber-400 to-rose-400 px-6 py-4">
                <span className="text-sm font-bold text-white/80">
                  {sideLabel[ev.side] ?? ev.side}
                </span>
                <h3 className="mt-1 text-2xl font-bold text-white">{ev.title}</h3>
              </div>

              {/* Card body */}
              <div className="space-y-4 px-6 py-5">
                {ev.date && (
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Thời gian</p>
                      <p className="text-sm font-medium text-slate-800">{formatEventDate(ev.date)}</p>
                    </div>
                  </div>
                )}
                {ev.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Địa điểm</p>
                      <p className="text-sm font-medium text-slate-800">{ev.location}</p>
                      {ev.address && (
                        <p className="mt-0.5 text-sm text-slate-500">{ev.address}</p>
                      )}
                    </div>
                  </div>
                )}
                {ev.mapUrl && (
                  <a
                    href={ev.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-100"
                  >
                    <MapPin size={14} />
                    Xem bản đồ
                  </a>
                )}
              </div>
            </motion.div>
          ))}
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
