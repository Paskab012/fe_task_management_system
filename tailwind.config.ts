import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(220, 100%, 97%)",
          100: "hsl(220, 100%, 94%)",
          200: "hsl(220, 100%, 87%)",
          300: "hsl(220, 100%, 78%)",
          400: "hsl(220, 100%, 66%)",
          500: "hsl(220, 100%, 50%)",
          600: "hsl(220, 100%, 45%)",
          700: "hsl(220, 100%, 39%)",
          800: "hsl(220, 100%, 31%)",
          900: "hsl(220, 100%, 24%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(158, 64%, 52%)",
          foreground: "hsl(158, 64%, 98%)",
          50: "hsl(158, 64%, 95%)",
          100: "hsl(158, 64%, 89%)",
          200: "hsl(158, 64%, 78%)",
          300: "hsl(158, 64%, 65%)",
          400: "hsl(158, 64%, 52%)",
          500: "hsl(158, 64%, 42%)",
          600: "hsl(158, 64%, 35%)",
          700: "hsl(158, 64%, 28%)",
          800: "hsl(158, 64%, 22%)",
          900: "hsl(158, 64%, 16%)",
        },
        warning: {
          DEFAULT: "hsl(38, 92%, 50%)",
          foreground: "hsl(38, 92%, 5%)",
          50: "hsl(38, 92%, 95%)",
          100: "hsl(38, 92%, 90%)",
          200: "hsl(38, 92%, 80%)",
          300: "hsl(38, 92%, 70%)",
          400: "hsl(38, 92%, 60%)",
          500: "hsl(38, 92%, 50%)",
          600: "hsl(38, 92%, 45%)",
          700: "hsl(38, 92%, 40%)",
          800: "hsl(38, 92%, 30%)",
          900: "hsl(38, 92%, 20%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elegant-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(0, 102, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config