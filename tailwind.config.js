module.exports = {
    theme: {
      extend: {
        animation: {
          marquee: 'marquee 10s linear infinite',
          'marquee-paused': 'marquee 10s linear infinite paused',
        },
        keyframes: {
          marquee: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' },
          },
        },
      },
    },
    plugins: [],
  };
  