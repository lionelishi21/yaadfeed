/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "yaadfeed",
      home: "aws",
      // Make region explicit so builds/domains are predictable
      providers: { aws: { region: "us-east-1" } },
      // Keep prod safe
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage ?? ""),
    };
  },

  async run() {
    // Your Next.js app (OpenNext under the hood)
    const site = new sst.aws.Nextjs("Web", {
      // path: ".", // default is repo root
      environment: {
        // Example runtime/build vars
        NEXT_PUBLIC_SITE_NAME: "YaadFeed",
      },
      // Optional: set a domain later (Route53/Cloudflare/Vercel supported)
      // domain: { name: "yaadfeed.com", redirects: ["www.yaadfeed.com"] },
      // Optional: keep one Lambda warm to reduce cold starts
      // warm: 1,
    });

    // OPTIONAL — scheduled scraper (EventBridge -> Lambda)
    new sst.aws.Cron("Scraper", {
      schedule: "rate(15 minutes)",       // or cron("15 10 * * ? *") for 10:15 UTC daily
      function: {
        handler: "functions/scrape.handler",
        timeout: "60 seconds",
      },
    });

    // You can export the deployed URL if you want:
    // console.log(await site.url);
  },
});
