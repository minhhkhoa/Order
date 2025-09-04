import messages from "./messages/en.json";

//- i18n with typescript
declare module "next-intl" {
  interface AppConfig {
    // ...
    Messages: typeof messages;
  }
}
