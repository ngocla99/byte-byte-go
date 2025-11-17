import { Link } from '@tanstack/react-router';

import { ModeToggle } from './mode-toggle';

export default function Header() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/blog', label: 'Blog' },
  ];

  return (
    <header className="relative isolate">
      <div className="relative grid items-center grid-cols-[1fr_max-content_1fr] py-3 px-4">
        {/* Left section */}
        <div className="flex justify-start">
          <Link to="/" className="text-[var(--fgLoud)] text-xl font-bold no-underline hover:bg-transparent">
            ByteByte
          </Link>
        </div>

        {/* Center navigation */}
        <nav className="flex gap-0">
          <ul className="flex gap-0 list-none m-0 p-0">
            {links.map(({ to, label }) => {
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className="relative border-0 bg-transparent text-[var(--fgLoud)] text-[calc(14rem/16)] leading-none font-normal flex items-center whitespace-nowrap rounded-[calc(1rem/16)] px-[0.85rem] py-[0.6rem] transition-colors duration-200 hover:bg-[var(--fgA500)] focus-visible:bg-[var(--fgA500)] no-underline"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right section */}
        <div className="flex justify-end items-center gap-2 pl-7">
          <ModeToggle />
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--grid500)]" />
    </header>
  );
}
