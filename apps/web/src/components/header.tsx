import { Link } from '@tanstack/react-router';

import { ModeToggle } from './mode-toggle';

export default function Header() {
  const links = [{ to: '/', label: '' }];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-[clamp(12px,0.75px+2.5vw,32px)] py-4">
        <nav className="flex gap-2">
          {links.map(({ to, label }) => {
            return (
              <Link
                key={to}
                to={to}
                className="relative flex items-center whitespace-nowrap rounded-[calc(1rem/16)] border-0 bg-none px-[0.85rem] py-[0.6rem] font-[var(--font-body)] text-[calc(14rem/16)] font-normal leading-none text-[var(--fgLoud)] transition-[background-color] duration-200 ease-in-out hover:bg-[var(--fgA500)] focus-visible:bg-[var(--fgA500)]"
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
      <hr className="border-[var(--grid500)]" />
    </div>
  );
}
