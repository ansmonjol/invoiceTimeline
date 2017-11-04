const faker = require('faker/locale/fr');

module.exports = async function customerSeed(models, accounts) {
  const values = [];
  for (let a = 0; a < accounts.length; a++) {
    const account = accounts[a];
    values.push(
      {
        name: 'Briq',
        logo: 'briq.png',
        address: faker.address.streetAddress(),
        country: faker.address.country(),
        zip: faker.address.zipCode(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        accountId: account.id,
      },
      {
        name: 'Near',
        logo: 'near.png',
        address: faker.address.streetAddress(),
        country: faker.address.country(),
        zip: faker.address.zipCode(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        accountId: account.id,
      },
      {
        name: 'Slite',
        logo: 'slite.png',
        address: faker.address.streetAddress(),
        country: faker.address.country(),
        zip: faker.address.zipCode(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        accountId: account.id,
      },
      {
        name: 'Station',
        logo: 'station.png',
        address: faker.address.streetAddress(),
        country: faker.address.country(),
        zip: faker.address.zipCode(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        accountId: account.id,
      },
      {
        name: 'Forest',
        logo: 'forest.png',
        address: faker.address.streetAddress(),
        country: faker.address.country(),
        zip: faker.address.zipCode(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        accountId: account.id,
      },
    );
  }
  return await models.Customer.bulkCreate(values);
};
