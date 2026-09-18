import React from "react";
import { useTranslation } from "react-i18next";

const supportedLanguages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
] as const;

type SupportedLanguage = (typeof supportedLanguages)[number]["code"];

export const LanguageSwitcher = (): React.JSX.Element => {
  const { i18n, t } = useTranslation();
  const currentLanguage: SupportedLanguage = i18n.resolvedLanguage === "es" ? "es" : "en";

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const nextLanguage = event.target.value as SupportedLanguage;
    void i18n.changeLanguage(nextLanguage);
  };

  return (
    <label className="language-switcher">
      <span className="language-switcher-label">{t("language.label")}</span>
      <select
        aria-label={t("language.select")}
        value={currentLanguage}
        onChange={handleLanguageChange}
      >
        {supportedLanguages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
};
