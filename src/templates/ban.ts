const BanTemplate = `
    <h1>Banned From <a href="{{{site}}}">HastePaste</a></h1>
    <p>You have been banned for misusing our system in some way.</p>
    <p>If you think this judgment is wrong, contact us at <a href="mailto:{{{contact}}}">{{{contact}}}</a>.</p>
    <hr />
    <h2>Ban Reason: </h2>
    <p>{{{reason}}}</p>
    <hr />
    <small>This message was sent automatically from <a href="{{{site}}}">HastePaste</a> System.</small>
`;

export { BanTemplate };
