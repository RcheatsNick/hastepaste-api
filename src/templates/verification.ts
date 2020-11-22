const VerificationTemplate = `
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
        <tr>
            <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td class="logo" style="text-align: center;">
                            <h1><a href="{{{site}}}">HastePaste E-Mail Verification</a></h1>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td valign="middle" class="hero bg_white" style="padding: 2em 0 4em 0;">
                <table>
                    <tr>
                        <td>
                            <div class="text" style="padding: 0 2.5em; text-align: center;">
                                <h2>Please verify your email</h2>
                                <h3>It will be very useful to confirm your e-mail in cases such as if your account is stolen or you forget your password!</h3>
                                <p><a href="{{{site}}}/verify?verification_key={{{verification_key}}}" class="btn btn-primary">Confirm E-Mail</a></p>
                                <small>If the account is not yours, you can ignore this message.</small>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
        <tr>
            <td valign="middle" class="bg_light footer email-section">
                <table>
                    <tr>
                        <td valign="top" width="50%" style="padding-top: 20px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: left; padding-left: 5px; padding-right: 5px;">
                                        <h3 class="heading">Contact Info</h3>
                                        <ul>
                                            <li><span class="text">Contact: {{{contact}}}</span></li>
                                            <li><span class="text">Bug: {{{bug}}}</span></a></li>
                                            <li><span class="text">Abuse: {{{abuse}}}</span></a></li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td valign="top" width="50%" style="padding-top: 20px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: left; padding-left: 10px;">
                                        <h3 class="heading">Useful Links</h3>
                                        <ul>
                                            <li><a href="{{{site}}}">Home</a></li>
                                            <li><a href="{{{site}}}/about">About</a></li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
`;

export { VerificationTemplate };
