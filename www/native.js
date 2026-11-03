/* FORMIQ native bridge.
   In the iOS / Android app (Capacitor) this uses the native plugins;
   in a normal browser every call quietly falls back or does nothing. */
(function () {
  const C = window.Capacitor;
  const P = (C && C.Plugins) || {};
  const native = !!(C && C.isNativePlatform && C.isNativePlatform());
  const safe = (fn) => { try { const r = fn(); if (r && r.catch) r.catch(() => {}); return r; } catch (e) { return undefined; } };
  const vib = (p) => safe(() => navigator.vibrate && navigator.vibrate(p));
  const REST_ID = 1001, REMINDER_ID = 2001;

  async function ensurePerm() {
    if (!native || !P.LocalNotifications) return false;
    try {
      let s = await P.LocalNotifications.checkPermissions();
      if (s.display !== 'granted') s = await P.LocalNotifications.requestPermissions();
      return s.display === 'granted';
    } catch (e) { return false; }
  }

  const FX = {
    native,
    platform: C && C.getPlatform ? C.getPlatform() : 'web',

    tap() { if (native && P.Haptics) safe(() => P.Haptics.impact({ style: 'LIGHT' })); },
    impact(style) { native && P.Haptics ? safe(() => P.Haptics.impact({ style: style || 'MEDIUM' })) : vib(15); },
    success() { native && P.Haptics ? safe(() => P.Haptics.notification({ type: 'SUCCESS' })) : vib([40, 30, 40]); },

    async restNotify(sec) {
      if (!(await ensurePerm())) return;
      safe(async () => {
        await P.LocalNotifications.cancel({ notifications: [{ id: REST_ID }] });
        await P.LocalNotifications.schedule({ notifications: [{
          id: REST_ID, title: 'Dinlenme bitti 💥', body: 'Sıradaki sete geçme zamanı.',
          schedule: { at: new Date(Date.now() + sec * 1000), allowWhileIdle: true }
        }] });
      });
    },
    cancelRest() { if (native && P.LocalNotifications) safe(() => P.LocalNotifications.cancel({ notifications: [{ id: REST_ID }] })); },

    /* Daily reminder. Returns false when permission is refused. */
    async setReminder(on, hhmm) {
      if (!native || !P.LocalNotifications) return undefined;
      await safe(() => P.LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] }));
      if (!on) return true;
      if (!(await ensurePerm())) return false;
      const [h, m] = String(hhmm || '18:00').split(':').map(Number);
      await safe(() => P.LocalNotifications.schedule({ notifications: [{
        id: REMINDER_ID, title: 'FORMIQ 💪', body: 'Bugünkü antrenmanın ve su hedefin seni bekliyor.',
        schedule: { on: { hour: h || 0, minute: m || 0 }, allowWhileIdle: true }
      }] }));
      return true;
    },

    _sbDark: null,
    statusBar(onDarkHero) {
      if (!native || !P.StatusBar) return;
      const theme = document.documentElement.getAttribute('data-theme');
      const sysDark = matchMedia('(prefers-color-scheme: dark)').matches;
      const darkUi = onDarkHero || theme === 'dark' || (!theme && sysDark);
      if (darkUi === this._sbDark) return;
      this._sbDark = darkUi;
      safe(() => P.StatusBar.setStyle({ style: darkUi ? 'DARK' : 'LIGHT' }));
    },
    hideSplash() { if (native && P.SplashScreen) safe(() => P.SplashScreen.hide({ fadeOutDuration: 250 })); },
  };
  window.FX = FX;

  // Light haptic on every button tap (native only).
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('button');
    if (b && !b.disabled) FX.tap();
  }, true);

  if (native && P.App) {
    safe(() => P.App.addListener('backButton', () => {
      if (!(window.FORMIQ_back && window.FORMIQ_back())) P.App.exitApp();
    }));
    safe(() => P.App.addListener('resume', () => window.FORMIQ_resume && window.FORMIQ_resume()));
  }
  if (native && P.StatusBar && FX.platform === 'android') {
    safe(() => P.StatusBar.setOverlaysWebView({ overlay: true }));
  }
})();
