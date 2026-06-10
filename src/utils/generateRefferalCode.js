// utils/generateReferralCode.js

const generateReferralCode = () => {
  return (
    "SAT" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );
};

module.exports = generateReferralCode;