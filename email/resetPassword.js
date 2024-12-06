export default (id, token)=>{
    return `
<p>A password reset has been requested for this email address. In order to reset your password, please use the link below.</p>

<a href="https://budget.leemorgan.dev/user/${id}/password/${token}">https://budget.leemorgan.dev/user/${id}/password/${token}</a>

<p>If you did not request this, then you may safely ignore this email</p>
`;
}
