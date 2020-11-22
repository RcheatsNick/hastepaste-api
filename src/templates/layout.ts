const Layout = `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="x-apple-disable-message-reformatting" />
            <title>{{{title}}}</title>
            <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
            <style>
                html, body {
                    margin: 0 auto !important;
                    padding: 0 !important;
                    height: 100% !important;
                    width: 100% !important;
                    background: #f1f1f1;
                }
                * {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }
                div[style*="margin: 16px 0"] {
                    margin: 0 !important;
                }
                table {
                    border-spacing: 0 !important;
                    border-collapse: collapse !important;
                    table-layout: fixed !important;
                    margin: 0 auto !important;
                }
                img {
                    -ms-interpolation-mode:bicubic;
                }
                a {
                    text-decoration: none;
                }
                *[x-apple-data-detectors], .unstyle-auto-detected-links *, .aBn {
                    border-bottom: 0 !important;
                    cursor: default !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
                .a6S {
                    display: none !important;
                    opacity: 0.01 !important;
                }
                .im {
                    color: inherit !important;
                }
                img.g-img + div {
                    display: none !important;
                }
                @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                    u ~ div .email-container {
                        min-width: 320px !important;
                    }
                }
                @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                    u ~ div .email-container {
                        min-width: 375px !important;
                    }
                }
                @media only screen and (min-device-width: 414px) {
                    u ~ div .email-container {
                        min-width: 414px !important;
                    }
                }

                .primary {
                    background: #ff414d;
                }
                .bg_white {
                    background: #ffffff;
                }
                .bg_light {
                    background: #fafafa;
                }
                .bg_black {
                    background: #000000;
                }
                .bg_dark {
                    background: rgba(0,0,0,.8);
                }
                .email-section {
                    padding:2.5em;
                }
                .btn {
                    padding: 10px 15px;
                    display: inline-block;
                }
                .btn .btn-primary {
                    border-radius: 5px;
                    background: #ff414d;
                    color: #ffffff;
                }
                .btn .btn-white {
                    border-radius: 5px;
                    background: #ffffff;
                    color: #000000;
                }
                .btn .btn-white-outline {
                    border-radius: 5px;
                    background: transparent;
                    border: 1px solid #fff;
                    color: #fff;
                }
                .btn .btn-black-outline {
                    border-radius: 0px;
                    background: transparent;
                    border: 2px solid #000;
                    color: #000;
                    font-weight: 700;
                }
                h1, h2, h3, h4, h5, h6 {
                    font-family: "Lato", sans-serif;
                    color: #000000;
                    margin-top: 0;
                    font-weight: 400;
                }
                body {
                    font-family: "Lato", sans-serif;
                    font-weight: 400;
                    font-size: 15px;
                    line-height: 1.8;
                    color: rgba(0,0,0,.4);
                }
                a {
                    color: #ff414d;
                }
                .logo h1 {
                    margin: 0;
                }
                .logo h1 a {
                    color: #ff414d;
                    font-size: 24px;
                    font-weight: 700;
                    font-family: "Lato", sans-serif;
                }
                .hero {
                    position: relative;
                    z-index: 0;
                }
                .hero .text {
                    color: rgba(0,0,0,.3);
                }
                .hero .text h2 {
                    color: #000;
                    font-size: 40px;
                    margin-bottom: 0;
                    font-weight: 400;
                    line-height: 1.4;
                }
                .hero .text h3 {
                    font-size: 24px;
                    font-weight: 300;
                }
                .hero .text h2 span {
                    font-weight: 600;
                    color: #ff414d;
                }
                .heading-section h2 {
                    color: #000000;
                    font-size: 28px;
                    margin-top: 0;
                    line-height: 1.4;
                    font-weight: 400;
                }
                .heading-section .subheading {
                    margin-bottom: 20px !important;
                    display: inline-block;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: rgba(0,0,0,.4);
                    position: relative;
                }
                .heading-section .subheading::after {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -10px;
                    content: "";
                    width: 100%;
                    height: 2px;
                    background: #ff414d;
                    margin: 0 auto;
                }
                .heading-section-white {
                    color: rgba(255,255,255,.8);
                }
                .heading-section-white h2 {
                    line-height: 1;
                    padding-bottom: 0;
                }
                .heading-section-white h2 {
                    color: #ffffff;
                }
                .heading-section-white .subheading {
                    margin-bottom: 0;
                    display: inline-block;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: rgba(255,255,255,.4);
                }
                ul.social {
                    padding: 0;
                }
                ul.social li {
                    display: inline-block;
                    margin-right: 10px;
                }
                .footer {
                    border-top: 1px solid rgba(0,0,0,.05);
                    color: rgba(0,0,0,.5);
                }
                .footer .heading {
                    color: #000;
                    font-size: 20px;
                }
                .footer ul {
                    margin: 0;
                    padding: 0;
                }
                .footer ul li {
                    list-style: none;
                    margin-bottom: 10px;
                }
                .footer ul li a {
                    color: rgba(0,0,0,1);
                }
            </style>
        </head>
        <body width="100%" style="margin: 0; padding: 0 !important; background-color: #f1f1f1;">
            <center style="width: 100%; background-color: #f1f1f1;">
                <div style="max-width: 600px; margin: 0 auto;" class="email-container">
                    {{{body}}}
                </div>
            </center>
        </body>
    </html>
`;

export { Layout };
