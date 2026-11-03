/* FORMIQ app settings.
   aiEndpoint: address of the AI coach server (server/ folder, Cloudflare Worker).
               Leave it empty and the coach / food calculation shows "not set up yet".
   appKey:     must match the worker's APP_KEY secret.
   privacyUrl: the public address of the privacy policy (required by the stores). */
window.FORMIQ_CONFIG = {
  version: "1.0.0",
  aiEndpoint: "",
  appKey: "",
  privacyUrl: "privacy.html"
};
