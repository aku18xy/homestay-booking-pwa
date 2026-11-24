import { Booking } from '@/types';

/**
 * Jana teks WhatsApp berformat kemas untuk dihantar kepada Pemilik Homestay
 */
export function generateOwnerBookingWhatsAppUrl(
  booking: Booking,
  ownerPhone: string = '60123456789'
): string {
  let cleanPhone = ownerPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '6' + cleanPhone;
  }

  const isDeposit = booking.payment_type === 'DEPOSIT';
  const paymentTypeLabel = isDeposit ? 'Bayaran Deposit Sahaja (Kunci Tarikh)' : 'Bayaran Penuh (Full Payment)';

  const message = `*TEMPAHAN HOMESTAY BAHARU!* 🏠✨

*Kod Tempahan:* ${booking.booking_code}
*Pilihan Unit:* ${booking.unit_name}
*Nama Tetamu:* ${booking.guest_name}
*No. WhatsApp Tetamu:* ${booking.guest_phone}
*Bil. Tetamu:* ${booking.guest_count} orang

📅 *Tarikh Check-in:* ${booking.check_in}
📅 *Tarikh Check-out:* ${booking.check_out}
🌙 *Bilangan Malam:* ${booking.nights_count} malam

💵 *Pilihan Bayaran:* ${paymentTypeLabel}
💰 *Jumlah Telah Dibayar Sekarang:* RM ${booking.amount_paid.toFixed(2)}
${isDeposit ? `⏳ *Baki Bayaran Semasa Check-in:* RM ${booking.balance_due.toFixed(2)}\n` : ''}📊 *Jumlah Keseluruhan Tempahan:* RM ${booking.total_amount.toFixed(2)}
(Termasuk Deposit Keselamatan: RM ${booking.security_deposit.toFixed(2)})

*Status:* ${booking.status === 'PENDING_VERIFICATION' ? 'Menunggu Pengesahan Bayaran DuitNow' : booking.status}
${booking.payment_receipt_url ? `📄 *Resit Pembayaran:* ${booking.payment_receipt_url}` : '*(Resit belum dimuat naik)*'}
${booking.notes ? `📝 *Catatan:* ${booking.notes}` : ''}

_Sila semak akaun bank anda dan buka Dashboard Pemilik untuk mengesahkan tempahan ini._`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Jana teks WhatsApp untuk tetamu hubungi owner sekiranya ada pertanyaan
 */
export function generateGuestInquiryWhatsAppUrl(
  homestayName: string,
  unitName?: string,
  ownerPhone: string = '60123456789'
): string {
  let cleanPhone = ownerPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '6' + cleanPhone;
  }

  const unitText = unitName ? ` berkenaan *${unitName}*` : '';
  const message = `Hai Pengurus ${homestayName}, saya berminat untuk membuat pertanyaan${unitText}.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
