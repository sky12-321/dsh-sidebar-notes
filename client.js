window.__ModuleLoader__.load({
  id: 'dsh-sidebar-notes',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Dictionary namespace owned by this plugin. */
    const NS = 'sidebarNotes';
    /** Id shared by the sidebar entry and the main panel it opens. */
    const PANEL_ID = 'sidebar-notes';
    /** Browser-local storage key for the scratchpad text. */
    const STORAGE_KEY = 'dsh.sidebar-notes.text.v1';

    const EN = {
      entry: 'Quick Notes',
      title: 'Quick Notes',
      subtitle: 'A scratchpad that stays in this browser. Nothing here is sent to the model.',
      placeholder: 'Write a thought, a prompt draft, or a todo…',
      saved: 'Saved',
      saving: 'Saving…',
      error: "Couldn't save",
      clear: 'Clear',
      confirmClear: 'Click again to clear',
      chars: 'characters',
      localOnly: 'Stored only in this browser profile.',
    };

    const ZH = {
      entry: '快速便签',
      title: '快速便签',
      subtitle: '只保存在本机浏览器里的草稿，不会发送给模型。',
      placeholder: '写下想法、提示词草稿或待办…',
      saved: '已保存',
      saving: '保存中…',
      error: '保存失败',
      clear: '清空',
      confirmClear: '再次点击确认清空',
      chars: '字符',
      localOnly: '仅保存在此浏览器配置中。',
    };

    const CSS = `
.dsh-sn-page {
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: auto;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  padding-top: var(--dsh-frame-top-clearance, 0px);
  padding-left: var(--dsh-frame-leading-clearance, 0px);
}
.dsh-sn-inner {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 32px 32px 24px;
}
.dsh-sn-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.dsh-sn-heading { min-width: 0; }
.dsh-sn-title {
  margin: 0;
  font-size: 20px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.dsh-sn-subtitle {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--dsw-alias-label-secondary);
}
.dsh-sn-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.dsh-sn-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--dsw-alias-label-secondary);
  white-space: nowrap;
}
.dsh-sn-status::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--dsw-alias-state-success-primary);
}
.dsh-sn-status[data-state='saving']::before {
  background: var(--dsw-alias-state-idle-primary);
}
.dsh-sn-status[data-state='error'] { color: var(--dsw-alias-state-error-primary); }
.dsh-sn-status[data-state='error']::before {
  background: var(--dsw-alias-state-error-primary);
}
.dsh-sn-clear {
  appearance: none;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  padding: 6px 10px;
  font: inherit;
  font-size: 12px;
  line-height: 1.3;
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.dsh-sn-clear:hover:not(:disabled) {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}
.dsh-sn-clear:disabled {
  opacity: 0.45;
  cursor: default;
}
.dsh-sn-clear[data-confirm] {
  color: var(--dsw-alias-state-error-primary);
  border-color: var(--dsw-alias-state-error-primary);
}
.dsh-sn-textarea {
  flex: 1 1 auto;
  min-height: 180px;
  width: 100%;
  box-sizing: border-box;
  resize: none;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  padding: 16px 18px;
  font: inherit;
  font-size: 14px;
  line-height: 1.7;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.dsh-sn-textarea::placeholder { color: var(--dsw-alias-label-secondary); }
.dsh-sn-textarea:focus {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, transparent);
}
.dsh-sn-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  line-height: 1.4;
  color: var(--dsw-alias-label-secondary);
}
`;

    function readStored() {
      try {
        return window.localStorage.getItem(STORAGE_KEY) ?? '';
      } catch {
        return '';
      }
    }

    function writeStored(value) {
      try {
        window.localStorage.setItem(STORAGE_KEY, value);
        return true;
      } catch {
        return false;
      }
    }

    function NotesIcon({ size = 18 }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          'aria-hidden': true,
          focusable: false,
          style: { display: 'block' },
        },
        h('rect', {
          x: 4,
          y: 3,
          width: 16,
          height: 18,
          rx: 3.5,
          stroke: 'currentColor',
          strokeWidth: 1.6,
        }),
        h('path', {
          d: 'M8 8.25h8M8 11.75h8M8 15.25h5',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
        }),
      );
    }

    function NotesPage({ t }) {
      const [text, setText] = React.useState(readStored);
      const [status, setStatus] = React.useState('saved');
      const [confirming, setConfirming] = React.useState(false);

      React.useEffect(() => {
        setStatus('saving');
        const id = window.setTimeout(() => {
          setStatus(writeStored(text) ? 'saved' : 'error');
        }, 350);
        return () => window.clearTimeout(id);
      }, [text]);

      React.useEffect(() => {
        if (!confirming) return undefined;
        const id = window.setTimeout(() => setConfirming(false), 2500);
        return () => window.clearTimeout(id);
      }, [confirming]);

      const onChange = (event) => setText(event.target.value);

      const onClear = () => {
        if (!confirming) {
          setConfirming(true);
          return;
        }
        setConfirming(false);
        setText('');
      };

      const statusText =
        status === 'saving' ? t('saving') : status === 'error' ? t('error') : t('saved');

      return h(
        'div',
        { className: 'dsh-sn-page' },
        h('style', null, CSS),
        h(
          'div',
          { className: 'dsh-sn-inner' },
          h(
            'header',
            { className: 'dsh-sn-head' },
            h(
              'div',
              { className: 'dsh-sn-heading' },
              h('h1', { className: 'dsh-sn-title' }, t('title')),
              h('p', { className: 'dsh-sn-subtitle' }, t('subtitle')),
            ),
            h(
              'div',
              { className: 'dsh-sn-actions' },
              h('span', { className: 'dsh-sn-status', 'data-state': status }, statusText),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sn-clear',
                  'data-confirm': confirming || undefined,
                  disabled: text.length === 0,
                  onClick: onClear,
                },
                confirming ? t('confirmClear') : t('clear'),
              ),
            ),
          ),
          h('textarea', {
            className: 'dsh-sn-textarea',
            value: text,
            onChange,
            placeholder: t('placeholder'),
            spellCheck: false,
            'aria-label': t('title'),
          }),
          h(
            'footer',
            { className: 'dsh-sn-foot' },
            h('span', null, `${text.length} ${t('chars')}`),
            h('span', null, t('localOnly')),
          ),
        ),
      );
    }

    function apply(ctx) {
      ctx.effect(() => {
        const disposers = [
          ctx.locale.register(NS, 'en', EN),
          ctx.locale.register(NS, 'zh', ZH),
        ];
        return () => {
          for (const dispose of disposers) dispose();
        };
      }, 'sidebar-notes: dictionaries');

      const t = ctx.locale.bind(NS);

      ctx.slots.inject('main', () =>
        ctx.slots.register(
          {
            name: 'main',
            key: PANEL_ID,
            locale: NS,
          },
          NotesPage,
        ),
      );

      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          {
            name: 'sidebar.panellist',
            id: PANEL_ID,
            order: 20,
            label: () => t('entry'),
          },
          NotesIcon,
        ),
      );
    }

    return {
      inject: ['slots', 'locale'],
      apply,
    };
  },
});
