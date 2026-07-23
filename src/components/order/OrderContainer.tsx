import { useRef } from 'preact/hooks';

import { useOrderScroll } from './useOrderScroll';

import Bottle from './bottle';
import Wine from './wine';
import InfoItem, { type OrderItem } from './info-item';

const orderItems: OrderItem[] = [
  { time: '2:00 PM', title: 'Ceremony' },
  { time: '2:30 PM', title: 'Drinks reception' },
  { time: '5:00 PM', title: 'Dinner' },
  { time: '7:00 PM', title: 'Cake cutting' },
  { time: '7:30 PM', title: 'Band starts' },
  { time: '12:30 AM', title: 'Carriages' },
];

export default function OrderContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  useOrderScroll(containerRef);

  return (
    <div
      ref={containerRef}
      class="relative w-full min-h-[90vh] sm:min-h-[125vh] flex flex-col items-center justify-stretch pt-4 sm:pt-12 overflow-x-hidden"
    >
      <h1 class="px-4 text-6xl font-(family-name:--font-boston) text-crimson text-center text-pretty mt-8">
        Order of the Day
      </h1>
      <div class="w-full sm:w-1/2 h-full flex-1 pb-12 pt-56 sm:pt-96 sm:px-12 flex flex-col items-center-safe justify-start relative">
        <Bottle />
        <Wine containerRef={containerRef} />
        {orderItems.map((item, index) => (
          <InfoItem key={index} time={item.time} title={item.title} />
        ))}
      </div>
    </div>
  );
}
