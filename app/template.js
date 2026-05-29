'use client';

import { motion } from 'framer-motion';

// app/template.js re-mounts on every navigation, so this gives each page a
// smooth enter transition without any extra wiring.
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
