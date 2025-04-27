import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        screens: {
          none: '100%',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1240px',
          '2xl': '1240px',
          '3xl': '1240px',
        },
      },
      keyframes: {
        fadeUp: {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-50px)',
            height: '0',
            overflow: 'hidden',
          },
        },
        fadeDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'spin-circle': 'spin 1s linear infinite',
        'fade-up': 'fadeUp 1s ease-out',
        'fade-down': 'fadeDown 1s ease-out',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontWeight: {
        semibold: '500',
        bold: '600',
      },
      colors: {
        primary: 'var(--primary-color)',
        grey: '#f5f5f5',
        primaryGrey: '#f3eee7',
        lightYellow: '#ffe8d1',
        linkHover: 'hsla(0,0%,100%,.2) ',
        price: '#f52f32',
        textSecondary: '#777',
        green: '#328f0a',
      },
      boxShadow: {
        custom:
          '0 1px 2px 0 rgba(60,64,67,.1),0 2px 6px 2px rgba(60,64,67,.15)',
        custom2:
          '0 8px 10px -5px #0003,0 var(--gap16) 24px 2px #00000024,0 6px 30px 5px #0000001a',
      },
    },
  },
  plugins: [],
};
export default config;
