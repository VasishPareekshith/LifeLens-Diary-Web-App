// services/authService.js
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

// AWS Cognito User Pool configuration
const poolData = {
  UserPoolId: 'ap-southeast-2_b9zcGLfwN', // Replace with your User Pool ID
  ClientId: '8ug8pv8huq87bdu37tsadhm1a',  // Replace with your App Client ID
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Function to sign up a new user
const signUp = (email, password, name) => {
  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'name',
      Value: name,
    }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Function to confirm user sign-up with a confirmation code
const confirmUser = (email, confirmationCode) => {
  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Function to sign in a user
const signIn = (email, password) => {
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

module.exports = { signUp, confirmUser, signIn };
