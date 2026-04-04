import { motion } from 'motion/react';
import { Heart, Calendar, MapPin, MessageSquare, Gift } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';

export default function PublicWedding({ project }: any) {
  if (!project) return null;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-rose-100 selection:text-rose-600">
      {project.sections.map((section: any) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}

function SectionRenderer({ section }: any) {
  const { type, content } = section;

  switch (type) {
    case 'hero':
      return <HeroSection content={content} />;
    case 'story':
      return <StorySection content={content} />;
    case 'gallery':
      return <GallerySection content={content} />;
    case 'rsvp':
      return <RSVPSection content={content} />;
    case 'gift':
      return <GiftSection content={content} />;
    default:
      return null;
  }
}

function HeroSection({ content }: any) {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-rose-50">
      <div className="absolute inset-0 opacity-20">
        <img 
          src={content.backgroundImage || "https://picsum.photos/seed/wedding/1920/1080"} 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center"
      >
        <Heart className="mx-auto mb-6 h-12 w-12 fill-rose-500 text-rose-500" />
        <h1 className="text-6xl font-serif font-bold text-slate-900 md:text-8xl">
          {content.groomName} & {content.brideName}
        </h1>
        <p className="mt-6 text-2xl font-medium text-slate-600 italic">
          {content.title || "Chúng mình kết hôn rồi!"}
        </p>
        <div className="mt-10 inline-block rounded-full bg-white/80 px-8 py-3 text-xl font-bold text-rose-600 backdrop-blur-sm">
          {content.date ? formatDate(content.date) : "Sắp diễn ra"}
        </div>
      </motion.div>
    </section>
  );
}

function StorySection({ content }: any) {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-4xl font-serif font-bold text-slate-900">Câu chuyện tình yêu</h2>
        <div className="mt-12 space-y-12">
          {content.items?.map((item: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={cn(
                "flex flex-col items-center gap-8 md:flex-row",
                i % 2 !== 0 && "md:flex-row-reverse"
              )}
            >
              <div className="h-64 w-64 flex-shrink-0 overflow-hidden rounded-full border-8 border-rose-50 shadow-xl">
                <img src={item.image} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-lg font-bold text-rose-500">{item.date}</span>
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

function GallerySection({ content }: any) {
  return (
    <section className="bg-slate-50 py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl font-serif font-bold text-slate-900">Album kỷ niệm</h2>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {content.images?.map((img: string, i: number) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="aspect-square overflow-hidden rounded-2xl shadow-sm"
            >
              <img src={img} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RSVPSection({ content }: any) {
  return (
    <section className="bg-rose-600 py-24 text-white">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <MessageSquare className="mx-auto mb-6 h-12 w-12" />
        <h2 className="text-4xl font-serif font-bold">Bạn sẽ đến chứ?</h2>
        <p className="mt-4 text-rose-100">Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi.</p>
        
        <form className="mt-10 space-y-4 text-left">
          <input 
            type="text" 
            placeholder="Họ và tên"
            className="w-full rounded-xl border-none bg-white/10 px-6 py-4 text-white placeholder:text-rose-200 focus:ring-2 focus:ring-white"
          />
          <div className="grid grid-cols-2 gap-4">
            <select className="rounded-xl border-none bg-white/10 px-6 py-4 text-white focus:ring-2 focus:ring-white">
              <option className="text-slate-900">Đi một mình</option>
              <option className="text-slate-900">Đi cùng người thân</option>
            </select>
            <select className="rounded-xl border-none bg-white/10 px-6 py-4 text-white focus:ring-2 focus:ring-white">
              <option className="text-slate-900">Sẽ tham dự</option>
              <option className="text-slate-900">Rất tiếc, không thể</option>
            </select>
          </div>
          <textarea 
            placeholder="Lời chúc gửi đến cô dâu & chú rể"
            rows={4}
            className="w-full rounded-xl border-none bg-white/10 px-6 py-4 text-white placeholder:text-rose-200 focus:ring-2 focus:ring-white"
          />
          <button className="w-full rounded-xl bg-white py-4 font-bold text-rose-600 shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]">
            Gửi lời chúc
          </button>
        </form>
      </div>
    </section>
  );
}

function GiftSection({ content }: any) {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <Gift className="mx-auto mb-6 h-12 w-12 text-rose-600" />
        <h2 className="text-4xl font-serif font-bold text-slate-900">Gửi quà chúc mừng</h2>
        <p className="mt-4 text-slate-600">Nếu bạn muốn gửi quà mừng từ xa, chúng mình xin cảm ơn rất nhiều.</p>
        
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {content.accounts?.map((acc: any, i: number) => (
            <div key={i} className="rounded-3xl border border-slate-100 bg-slate-50 p-8">
              <img src={acc.qrCode} className="mx-auto h-48 w-48 rounded-2xl bg-white p-2 shadow-sm" referrerPolicy="no-referrer" />
              <h3 className="mt-6 text-xl font-bold text-slate-900">{acc.bankName}</h3>
              <p className="mt-1 font-mono text-lg text-slate-600">{acc.accountNumber}</p>
              <p className="mt-1 font-medium text-slate-500 uppercase">{acc.accountName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
