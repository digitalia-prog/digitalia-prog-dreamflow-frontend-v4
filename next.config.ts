import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl({
  // mets ici tes options Next.js si tu en as
});
