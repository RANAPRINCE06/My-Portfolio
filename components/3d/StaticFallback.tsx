import React from 'react';

export const StaticFallback: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-canvas overflow-hidden bg-background-primary"
    >
      {/* Subtle deep ambient glow spots */}
      <div
        className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent-cyan/10 blur-[120px]"
      />
      <div
        className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-accent-violet/10 blur-[140px]"
      />
      <div
        className="absolute bottom-10 left-1/4 h-[450px] w-[450px] rounded-full bg-accent-cyan/5 blur-[100px]"
      />

      {/* Cyberpunk subtle background grid lines */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
      />
    </div>
  );
};

