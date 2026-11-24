import { Booking, HomestaySettings } from '@/types';

/**
 * Jana teks WhatsApp berformat kemas untuk dihantar kepada Pemilik Homestay
 */
export function generateOwnerBookingWhatsAppUrl(
  booking: Booking,
  ownerPhone: string = '60123456789'
): string {
  // Format nombor telefon: pastikan bermula dengan 60 (Malaysia) tanpa tanda '+'
  let cleanPhone = ownerPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '6' + cleanPhone;
  }

  const message = `*TEMPAHAN HOMESTAY BAHARU!* 🏠✨

*Kod Tempahan:* ${booking.booking_code}
*Nama Tetamu:* ${booking.guest_name}
*No. WhatsApp Tetamu:* ${booking.guest_phone}
*Bil. Tetamu:* ${booking.guest_count} orang

📅 *Tarikh Check-in:* ${booking.check_in}
📅 *Tarikh Check-out:* ${booking.check_out}
🌙 *Bilangan Malam:* ${booking.nights_count} malam

💰 *Jumlah Bayaran:* RM ${booking.total_amount.toFixed(2)}
(Termasuk Deposit Keselamatan: RM ${booking.security_deposit.toFixed(2)})

*Status:* ${booking.status === 'PENDING_VERIFICATION' ? 'Menunggu Pengesahan Bayaran DuitNow' : booking.status}
${booking.payment_receipt_url ? `📄 *Resit Pembayaran:* ${booking.payment_receipt_url}` : '*(Resit belum dimuat naik)*'}
${booking.notes ? `📝 *Catatan:* ${booking.notes}` : ''}

_Sila semak akaun bank anda dan buka Dashboard Pengurusan Homestay untuk mengesahkan tempahan ini._`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Jana teks WhatsApp untuk tetamu hubungi owner sekiranya ada pertanyaan
 */
export function generateGuestInquiryWhatsAppUrl(
  homestayName: string,
  ownerPhone: string = '60123456789'
): string {
  let cleanPhone = ownerPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '6' + cleanPhone;
  }

  const message = `Hai Pengurus ${homestayName}, saya berminat untuk membuat pertanyaan berkenaan homestay.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
