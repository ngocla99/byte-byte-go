import { Link } from '@tanstack/react-router';

import { ModeToggle } from './mode-toggle';

export default function Header() {
  // const links = [
  //   { to: '/', label: 'Home' },
  //   { to: '/about', label: 'About' },
  //   { to: '/blog', label: 'Blog' },
  // ];

  return (
    <header className="relative isolate">
      <div className="relative grid grid-cols-[1fr_max-content_1fr] items-center px-4 py-3">
        {/* Left section */}
        <div className="flex justify-start">
          {/* <Link
            className="font-bold text-[var(--fgLoud)] text-xl no-underline hover:bg-transparent"
            to="/"
          >
            ByteByte
          </Link> */}
        </div>

        {/* Center navigation */}
        <nav className="flex gap-0">
          {/* <ul className="m-0 flex list-none gap-0 p-0">
            {links.map(({ to, label }) => {
              return (
                <li key={to}>
                  <Link
                    className="relative flex items-center whitespace-nowrap rounded-[calc(1rem/16)] border-0 bg-transparent px-[0.85rem] py-[0.6rem] font-normal text-[calc(14rem/16)] text-[var(--fgLoud)] leading-none no-underline transition-colors duration-200 hover:bg-[var(--fgA500)] focus-visible:bg-[var(--fgA500)]"
                    to={to}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul> */}
        </nav>

        {/* Right section */}
        <div className="flex items-center justify-end gap-2 pl-7">
          <ModeToggle />
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--grid500)]" />
    </header>
  );
}
