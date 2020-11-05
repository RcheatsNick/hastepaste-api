import {Layout} from "./layout";
import { VerificationTemplate } from "./verification";
import { BanTemplate } from "./ban";
import { UnBanTemplate } from "./unban";

const verificationTemplate = Layout
    .replace(/{{{title}}}/gim, "HastePaste E-Mail Verification")
    .replace(/{{{site}}}/gim, "https://hastepaste.xyz")
    .replace(/{{{contact}}}/gim, "contact@hastepaste.xyz")
    .replace(/{{{bug}}}/gim, "bug@hastepaste.xyz")
    .replace(/{{{abuse}}}/gim, "abuse@hastepaste.xyz");

const banTemplate = Layout
    .replace(/{{{title}}}/gim, "HastePaste Ban Notifier")
    .replace(/{{{site}}}/gim, "https://hastepaste.xyz")
    .replace(/{{{contact}}}/gim, "contact@hastepaste.xyz");

const unBanTemplate = Layout
    .replace(/{{{title}}}/gim, "HastePaste UnBan Notifier")
    .replace(/{{{site}}}/gim, "https://hastepaste.xyz");

export {
    verificationTemplate,
    banTemplate,
    unBanTemplate
}
