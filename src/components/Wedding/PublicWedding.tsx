import { motion } from 'motion/react';
import { Heart, MessageSquare, Gift, CalendarDays, MapPin, Clock } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';

export default function PublicWedding({ project }: any) {
  if (!project) return null;
  const sections = Array.isArray(project.sections) ? project.sections : [];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-rose-100 selection:text-rose-600">
      {sections.map((section: any) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}

function SectionRenderer({ section }: any) {
  const { type, content } = section;
  if (!content) return null;

  switch (type) {
    case 'hero':    return <HeroSection    content={content} />;
    case 'story':   return <StorySection   content={content} />;
    case 'gallery': return <GallerySection content={content} />;
    case 'event':   return <EventSection   content={content} />;
    case 'rsvp':    return <RSVPSection    content={content} />;
    case 'gift':    return <GiftSection    content={content} />;
    default:        return null;
  }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ content }: any) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-rose-50">
      {/* Background image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src={content.backgroundImage || 'https://picsum.photos/seed/wedding/1920/1080'}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          alt=""
        />
      </div>

      {/* Decorative petals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-3 w-3 rounded-full bg-rose-200 opacity-60"
            style={{ top: `${15 + i * 13}%`, left: `${8 + i * 14}%` }}
            animate={{ y: [0, -18, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
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
          <Heart className="mx-auto mb-8 h-14 w-14 fill-rose-500 text-rose-500" />
        </motion.div>

        <h1 className="font-serif text-6xl font-bold tracking-tight text-slate-900 md:text-8xl">
          {content.groomName || 'Chú Rể'}&nbsp;&amp;&nbsp;{content.brideName || 'Cô Dâu'}
        </h1>

        <p className="mt-6 text-2xl font-medium italic text-slate-600">
          {content.subtitle || 'Chúng mình kết hôn rồi!'}
        </p>

        <div className="mt-10 inline-block rounded-full bg-white/80 px-8 py-3 text-xl font-bold text-rose-600 shadow-sm backdrop-blur-sm">
          {content.date ? formatDate(content.date) : 'Sắp diễn ra'}
        </div>
      </motion.div>
    </section>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────

function StorySection({ content }: any) {
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
          <Heart className="mx-auto mb-4 h-8 w-8 fill-rose-400 text-rose-400" />
          <h2 className="font-serif text-4xl font-bold text-slate-900">Câu chuyện tình yêu</h2>
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
              <div className="h-64 w-64 shrink-0 overflow-hidden rounded-full border-8 border-rose-50 shadow-xl">
                <img
                  src={item.image || 'https://picsum.photos/seed/placeholder/400/400'}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  alt={item.title}
                />
              </div>
              <div className="flex-1 text-left">
                <span className="text-base font-bold text-rose-500">{item.date}</span>
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

function GallerySection({ content }: any) {
  const images: string[] = content.images ?? [];

  return (
    <section className="bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-4xl font-bold text-slate-900">
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

function EventSection({ content }: any) {
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
          <CalendarDays className="mx-auto mb-4 h-10 w-10 text-amber-500" />
          <h2 className="font-serif text-4xl font-bold text-slate-900">Sự kiện đám cưới</h2>
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

function RSVPSection({ content }: any) {
  return (
    <section className="bg-rose-600 py-24 text-white">
      <div className="container mx-auto max-w-2xl px-6 text-center">
        <MessageSquare className="mx-auto mb-6 h-12 w-12" />
        <h2 className="font-serif text-4xl font-bold">
          {content.title || 'Bạn sẽ đến chứ?'}
        </h2>
        <p className="mt-4 text-rose-100">
          {content.subtitle || 'Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi.'}
        </p>

        <form className="mt-10 space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full rounded-xl border-none bg-white/10 px-6 py-4 text-white placeholder:text-rose-200 focus:ring-2 focus:ring-white focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <select className="rounded-xl border-none bg-white/10 px-4 py-4 text-white focus:ring-2 focus:ring-white focus:outline-none">
              <option className="text-slate-900">Đi một mình</option>
              <option className="text-slate-900">Đi cùng người thân</option>
            </select>
            <select className="rounded-xl border-none bg-white/10 px-4 py-4 text-white focus:ring-2 focus:ring-white focus:outline-none">
              <option className="text-slate-900">Sẽ tham dự</option>
              <option className="text-slate-900">Rất tiếc, không thể</option>
            </select>
          </div>
          <textarea
            placeholder="Lời chúc gửi đến cô dâu & chú rể"
            rows={4}
            className="w-full rounded-xl border-none bg-white/10 px-6 py-4 text-white placeholder:text-rose-200 focus:ring-2 focus:ring-white focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-white py-4 font-bold text-rose-600 shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Gửi lời chúc
          </button>
        </form>
      </div>
    </section>
  );
}

// ─── Gift ─────────────────────────────────────────────────────────────────────

function GiftSection({ content }: any) {
  const accounts: any[] = content.accounts ?? [];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <Gift className="mx-auto mb-6 h-12 w-12 text-rose-500" />
        <h2 className="font-serif text-4xl font-bold text-slate-900">
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
