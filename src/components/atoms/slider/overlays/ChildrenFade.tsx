'use client';

import React, { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ChildrenFadeProps {
  animSpeed: number;
  onComplete: () => void;
  children: ReactNode;
}

/**
 * Fade overlay cho slide KHÔNG phải ảnh. Tách khỏi NivoSlider.tsx để mọi thứ
 * phụ thuộc framer-motion nằm trọn trong thư mục overlays — nhờ đó NivoSlider
 * nạp được cả cụm bằng một `dynamic()` duy nhất và framer-motion (147 KB raw /
 * 46,6 KB nén) ra khỏi chunk khởi tạo của trang chủ.
 */
export const ChildrenFade = memo<ChildrenFadeProps>(
  ({ animSpeed, onComplete, children }) => (
    <motion.div
      className="absolute inset-0 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: animSpeed / 1000, ease: 'easeOut' as const }}
      onAnimationComplete={onComplete}
    >
      {children}
    </motion.div>
  ),
);

ChildrenFade.displayName = 'ChildrenFade';

export default ChildrenFade;
