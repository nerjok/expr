const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

export default (emails) => {
  const invalidMails = emails.split(',')
                            .map(email => email.trim())
                            .filter(email => re.test(email)===false);


   if (invalidMails.length) {
       return `These emails are invalid: ${invalidMails}`;
   }                         
   return null;
}