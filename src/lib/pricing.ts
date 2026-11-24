import { format, addDays, parseISO, isFriday, isSaturday } from 'date-fns';
import { PricingRule, PriceBreakdown } from '@/types';

export function calculateBookingPrice(
  checkInStr: string,
  checkOutStr: string,
  weekdayRate: number = 250,
  weekendRate: number = 350,
  securityDeposit: number = 100,
  pricingRules: PricingRule[] = []
): PriceBreakdown {
  const checkIn = parseISO(checkInStr);
  const checkOut = parseISO(checkOutStr);

  let current = checkIn;
  const dailyRates: PriceBreakdown['dailyRates'] = [];

  let weekdayNights = 0;
  let weekendNights = 0;
  let weekdayTotal = 0;
  let weekendTotal = 0;
  let peakSurcharge = 0;

  while (current < checkOut) {
    const dateFormatted = format(current, 'yyyy-MM-dd');
    const dayName = format(current, 'EEEE');
    const isWknd = isFriday(current) || isSaturday(current);

    // Semak jika ada promosi / surcaj cuti khas dalam pricing_rules
    const matchedRule = pricingRules.find(
      (r) => r.is_active && dateFormatted >= r.date_start && dateFormatted <= r.date_end
    );

    let rate = 0;
    if (matchedRule) {
      rate = Number(matchedRule.rate_per_night);
      peakSurcharge += rate - (isWknd ? weekendRate : weekdayRate);
    } else if (isWknd) {
      rate = weekendRate;
      weekendNights++;
      weekendTotal += rate;
    } else {
      rate = weekdayRate;
      weekdayNights++;
      weekdayTotal += rate;
    }

    dailyRates.push({
      date: dateFormatted,
      dayName,
      isWeekend: isWknd,
      rate,
    });

    current = addDays(current, 1);
  }

  const nights = dailyRates.length;
  const total = weekdayTotal + weekendTotal + peakSurcharge + securityDeposit;

  return {
    nights,
    weekdayNights,
    weekendNights,
    weekdayTotal,
    weekendTotal,
    peakSurcharge,
    securityDeposit,
    total,
    dailyRates,
  };
}
