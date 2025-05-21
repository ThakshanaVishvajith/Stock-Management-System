const Company = require('../models/Company');

// Get company details
exports.getCompany = async (req, res) => {
  const company = await Company.findOne();
  res.json(company);
};

// Update or create company details
exports.updateCompany = async (req, res) => {
  const { name, phone, email } = req.body;
  let company = await Company.findOne();
  if (company) {
    company.name = name;
    company.phone = phone;
    company.email = email;
    company.address = req.body.address;
    await company.save();
  } else {
    company = await Company.create({ name, phone, email });
  }
  res.json(company);
};