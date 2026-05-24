import { useState, useContext } from 'react';
import classNames from 'classnames';
import { DropdownMenu, Icon, IconIdentifier } from '../components';
import { AuthPanel } from '../auth-panel';
import { GlobalContext } from '../contexts';

import { Search } from './search';

export const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { activeBasemap, setActiveBasemap } = useContext(GlobalContext);

  const basemapOptions = [
    { id: 'standard', name: 'Standard', desc: 'Standard street map' },
    { id: 'satellite', name: 'Satellite', desc: 'Hybrid satellite imagery' },
    { id: 'light', name: 'Light', desc: 'Minimalist light style' },
    { id: 'dark', name: 'Dark', desc: 'Minimalist dark style' },
    { id: 'none', name: 'None', desc: 'Blank slate workspace' },
  ];

  const renderBasemapThumbnail = (id: string, sizeClass: string) => {
    switch (id) {
      case 'satellite':
        return (
          <div
            className={`relative ${sizeClass} overflow-hidden rounded border border-emerald-800 bg-emerald-950`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 via-emerald-800/60 to-teal-900/60" />
            <div className="absolute -left-1 -top-1 size-3 rounded-full bg-blue-500/20 blur-[2px]" />
            <div className="absolute -bottom-2 -right-2 size-4 rounded-full bg-emerald-500/30 blur-[2px]" />
          </div>
        );
      case 'standard':
        return (
          <div
            className={`relative ${sizeClass} overflow-hidden rounded border border-sky-400/30 bg-slate-100`}
          >
            <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-amber-400/80" />
            <div className="absolute left-1/3 top-0 h-full w-[2px] bg-slate-300" />
            <div className="absolute left-2/3 top-0 h-full w-[2px] bg-slate-300" />
            <div className="absolute left-0 top-1/4 h-px w-full bg-slate-300" />
          </div>
        );
      case 'light':
        return (
          <div
            className={`relative ${sizeClass} overflow-hidden rounded border border-gray-300 bg-gray-50`}
          >
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-200" />
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-200" />
            <div className="absolute left-1/4 top-1/4 size-2 rounded-full border border-slate-200/50 bg-slate-100" />
          </div>
        );
      case 'dark':
        return (
          <div
            className={`relative ${sizeClass} overflow-hidden rounded border border-zinc-700 bg-zinc-900`}
          >
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-zinc-800" />
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-zinc-800" />
            <div className="absolute left-1/4 top-1/3 size-2 rounded bg-zinc-800" />
          </div>
        );
      case 'none':
      default:
        return (
          <div
            className={`relative ${sizeClass} flex items-center justify-center overflow-hidden rounded border border-dashed border-gray-700 bg-gray-950`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:6px_6px]" />
            <div className="scale-90 text-[8px] font-semibold uppercase tracking-tighter text-gray-500">
              None
            </div>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-[3.4rem] w-full items-center justify-between border-b border-gray-700 bg-gray-900 px-4">
      {/* Left Side */}
      <DropdownMenu
        buttonBody={
          <div className="group flex select-none items-center space-x-2">
            <div className="flex w-6 items-center justify-center">
              <Icon
                identifier={IconIdentifier.Earth}
                className="size-5 text-blue-500 transition-all duration-150 group-hover:rotate-180 group-hover:opacity-0"
              />
              <Icon
                identifier={IconIdentifier.Down}
                className="absolute size-3 opacity-0 transition-all duration-150 group-hover:rotate-0 group-hover:opacity-100"
              />
            </div>
            <span className="text-lg font-bold text-gray-50">Earth</span>
          </div>
        }
        className="-ml-2 bg-transparent"
        anchor="bottom start"
      >
        <DropdownMenu.Item>
          <a
            href="https://github.com/rajtoshranjan/earth"
            target="_blank"
            rel="noreferrer"
            title="View on GitHub"
            className="flex items-center gap-2"
          >
            <Icon identifier={IconIdentifier.GitHub} /> Source Code
          </a>
        </DropdownMenu.Item>
      </DropdownMenu>

      {/* Right Side */}
      <div className="flex w-8/12 items-center justify-end gap-3 md:w-6/12 lg:w-4/12">
        {/* Basemap Dropdown */}
        <DropdownMenu
          buttonBody={
            <div className="flex select-none items-center gap-1.5">
              {renderBasemapThumbnail(activeBasemap || 'satellite', 'size-4')}
              <span className="hidden text-xs font-semibold uppercase tracking-wider text-gray-300 md:inline">
                {activeBasemap}
              </span>
            </div>
          }
          className="flex h-8 items-center justify-center rounded-lg border border-transparent bg-transparent px-2 text-gray-400 transition-colors hover:border-gray-700 hover:bg-gray-800 hover:text-gray-50 focus:border-gray-700 focus:bg-gray-800 focus:text-gray-50 data-[open]:border-gray-700 data-[open]:bg-gray-800 data-[open]:text-gray-50"
          anchor="bottom end"
        >
          <div className="mb-1 border-b border-gray-700/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Basemap
          </div>
          {basemapOptions.map((opt) => {
            const isActive = activeBasemap === opt.id;
            return (
              <DropdownMenu.Item
                key={opt.id}
                onClick={() => setActiveBasemap?.(opt.id)}
                className={classNames(
                  'flex w-56 items-center gap-3 px-3 py-2 transition-all duration-150',
                  isActive
                    ? 'bg-blue-500/10 font-medium text-blue-400'
                    : 'text-gray-300 hover:text-white',
                )}
              >
                <div
                  className={classNames(
                    'relative rounded border p-[2px] transition-all duration-150',
                    isActive
                      ? 'border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                      : 'border-transparent',
                  )}
                >
                  {renderBasemapThumbnail(opt.id, 'size-8')}
                </div>
                <div className="flex flex-col text-left">
                  <span
                    className={classNames(
                      'text-xs font-semibold',
                      isActive ? 'text-blue-400' : 'text-gray-200',
                    )}
                  >
                    {opt.name}
                  </span>
                  <span className="text-[10px] leading-tight text-gray-500">
                    {opt.desc}
                  </span>
                </div>
                {isActive && (
                  <div className="ml-auto flex size-4 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                    <Icon
                      identifier={IconIdentifier.Tick}
                      className="size-2.5"
                    />
                  </div>
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu>

        <DropdownMenu
          iconIdentifier={IconIdentifier.Settings}
          className="flex size-8 items-center justify-center rounded-lg border border-transparent bg-transparent text-gray-400 transition-colors hover:border-gray-700 hover:bg-gray-800 hover:text-gray-50 focus:border-gray-700 focus:bg-gray-800 focus:text-gray-50 data-[open]:border-gray-700 data-[open]:bg-gray-800 data-[open]:text-gray-50"
          anchor="bottom end"
        >
          <DropdownMenu.Item onClick={() => setShowAuthModal(true)}>
            <Icon identifier={IconIdentifier.Shield} className="size-4" />
            Auth Methods
          </DropdownMenu.Item>
        </DropdownMenu>

        {/* A vertical divider */}
        <div className="h-6 w-px bg-gray-700" />
        <Search />
      </div>

      <AuthPanel show={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
};
