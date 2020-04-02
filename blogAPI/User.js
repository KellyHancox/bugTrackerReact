module.exports = class User {

  static isValid(user, allUsers) {

    let errors = [];
    if (!user.fname) {
      errors.push("User must have a first name.");
    }

    if (!user.lname) {
      errors.push("User must have a last name.");
    }

    if (!user.email) {
      errors.push("User must have an email");      
    }

   if (!User.isUnique(user, allUsers)) {
     errors.push("Email is already in use.");
   }

   if (errors.length > 0) {
     user.errors = errors;
     return false;
   } else {
     return true;
   }
  }

  static isUnique(user, allUsers) {   
    return allUsers.filter((auth) => auth.email === user.email && auth.id !== user.id).length === 0;
  }
}