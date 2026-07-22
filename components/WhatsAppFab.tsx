import { generalOrderLink } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/Brand'

export default function WhatsAppFab() {
  return (
    <a
      href={generalOrderLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 start-6 z-50 inline-flex items-center gap-2.5 rounded-full border border-gold bg-navy px-5 py-3 text-[.95rem] font-medium text-[#F0E6CF] shadow-[0_16px_34px_-16px_rgba(7,20,38,.7)] transition hover:-translate-y-0.5 hover:bg-navy-soft"
      aria-label="הזמנה בוואטסאפ"
    >
      <WhatsAppIcon className="h-[19px] w-[19px] text-gold-soft" />
      <span className="hidden sm:inline">הזמנה בוואטסאפ</span>
    </a>
  )
}
