// =============================================================================
// PM2 Ecosystem configuratie voor Trobuso-website
// Docs: https://pm2.keymetrics.io/docs/usage/application-declaration/
// =============================================================================

module.exports = {
  apps: [
    {
      // Applicatienaam (zichtbaar in pm2 status)
      name: "trobuso-website",

      // Next.js productie start-commando
      script: "node_modules/.bin/next",
      args: "start",

      // Werkmap op de server
      cwd: "/var/www/trobuso",

      // Aantal instanties (1 is voldoende voor SQLite)
      instances: 1,

      // Niet in cluster-mode draaien (SQLite is niet concurrent-safe)
      exec_mode: "fork",

      // Automatisch herstarten bij crash
      autorestart: true,

      // Geheugen-limiet: herstart bij overschrijding
      max_memory_restart: "512M",

      // Maximaal 10 restarts binnen 60 seconden, daarna stoppen
      max_restarts: 10,
      min_uptime: "10s",

      // Omgevingsvariabelen voor productie
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // Logbestanden
      error_file: "/var/www/trobuso/logs/pm2-error.log",
      out_file: "/var/www/trobuso/logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Bestanden om te negeren bij --watch (watch staat standaard uit)
      watch: false,
      ignore_watch: ["node_modules", ".next", "prisma/dev.db", "logs"],
    },
  ],
};
