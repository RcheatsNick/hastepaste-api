import { Layout } from "@templates/layout";
import { VerificationTemplate } from "@templates/verification";
import { BanTemplate } from "@templates/ban";
import { UnBanTemplate } from "@templates/unban";

const verificationTemplate = Layout.replace(
    /{{{title}}}/gim,
    "HastePaste E-Mail Verification",
)
    .replace(/{{{site}}}/gim, "https://hastepaste.xyz")
    .replace(/{{{contact}}}/gim, "contact@hastepaste.xyz")
    .replace(/{{{bug}}}/gim, "bug@hastepaste.xyz")
    .replace(/{{{abuse}}}/gim, "abuse@hastepaste.xyz")
    .replace(/{{{body}}}/gim, VerificationTemplate);

const banTemplate = Layout.replace(/{{{title}}}/gim, "HastePaste Ban Notifier")
    .replace(/{{{site}}}/gim, "https://hastepaste.xyz")
    .replace(/{{{contact}}}/gim, "contact@hastepaste.xyz")
    .replace(/{{{body}}}/gim, BanTemplate);

const unBanTemplate = Layout.replace(
    /{{{title}}}/gim,
    "HastePaste UnBan Notifier",
)
    .replace(/{{{site}}}/gim, "https://hastepaste.xyz")
    .replace(/{{{body}}}/gim, UnBanTemplate);

export { verificationTemplate, banTemplate, unBanTemplate };
