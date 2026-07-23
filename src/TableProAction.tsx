import React, { type CSSProperties, useEffect, useState } from 'react';
import { ipcAsync } from '@getflywheel/local/renderer';
import { CHANNELS, type OpenDatabaseRequest } from './protocol';

interface LocalSite {
  id: string;
  mysql?: {
    database?: string;
    password?: string;
    user?: string;
  };
  name?: string;
}

interface TableProActionProps {
  site: LocalSite;
}

type Phase = 'checking' | 'disabled' | 'ready' | 'opening' | 'failed';

const baseStyle: CSSProperties = {
  background: 'transparent',
  border: 0,
  font: 'inherit',
  fontWeight: 600,
  marginRight: 25,
  padding: 0,
};

function snapshot(site: LocalSite): OpenDatabaseRequest {
  return {
    credentials: {
      database: site.mysql?.database ?? '',
      password: site.mysql?.password ?? '',
      user: site.mysql?.user ?? '',
    },
    siteId: site.id,
    siteName: site.name ?? 'Local',
  };
}

export function TableProAction({ site }: TableProActionProps): React.ReactElement {
  const [phase, setPhase] = useState<Phase>('checking');

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const available = await ipcAsync(CHANNELS.availability, site.id);
        if (active) {
          setPhase((current) => current === 'opening' ? current : (available ? 'ready' : 'disabled'));
        }
      } catch {
        if (active) {
          setPhase('disabled');
        }
      }
    };

    void check();
    const timer = setInterval(() => void check(), 1500);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [site.id]);

  const open = async () => {
    if (phase !== 'ready') {
      return;
    }

    setPhase('opening');
    try {
      await ipcAsync(CHANNELS.open, snapshot(site));
      setPhase('ready');
    } catch (error) {
      console.error('[local-tablepro] Unable to open TablePro.', error);
      setPhase('failed');
    }
  };

  const disabled = phase === 'checking' || phase === 'disabled' || phase === 'opening';
  const color = phase === 'failed' ? '#ff6b6b' : (disabled ? '#d5d5d5' : '#55c987');
  const label = phase === 'opening' ? 'Opening TablePro…' : 'Open TablePro';

  return (
    <button
      disabled={disabled}
      onClick={() => void open()}
      style={{ ...baseStyle, color, cursor: disabled ? 'default' : 'pointer' }}
      title={phase === 'failed' ? 'TablePro could not be opened. See Developer Tools for details.' : ''}
      type="button"
    >
      {label}
    </button>
  );
}
