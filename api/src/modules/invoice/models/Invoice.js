const shortid = require('shortid');
const emitter = require('./../../base/emitter');

module.exports = function Invoice(sequelize, DataTypes) {
  return sequelize.define('Invoice', {
    id: {
      type: DataTypes.STRING,
      defaultValue: shortid.generate,
      primaryKey: true
    },

    ref: { type: DataTypes.STRING, allowNull: false },

    amount: { type: DataTypes.INTEGER },

    currency: { type: DataTypes.STRING, defaultValue: 'EUR' },

    // If paid
    paymentDate: { type: DataTypes.DATE },
    paymentDetails: { type: DataTypes.JSONB },

    issuedAt: { type: DataTypes.DATE, defaultValue: new Date() },
    dueDate: { type: DataTypes.DATE, defaultValue: new Date() },

    // 103: In dispute
    // 102: Overdue
    // 101: Paid
    // 100: Due
    // 99: Archived
    status: { type: DataTypes.INTEGER, defaultValue: 100 },
  }, {
    name: { plural: 'invoices', singular: 'invoice' },
    classMethods: {
      associate: function associate(models) {
        // set default order
        this.order = [['ref', 'ASC']];

        this.include = [
          { model: models.Account, as: 'account' },
          { model: models.Customer, as: 'customer' },
          { model: models.Timeline, as: 'timeline' },
        ];

        this.belongsTo(models.Account, { as: 'account' });
        this.belongsTo(models.Customer, { as: 'customer' });
        this.hasMany(models.Timeline, { as: 'timeline', foreignKey: 'invoiceId' });

        // Hooks
        const saveHook = async function saveHook(row) {
          row.fullName = `${row.firstName} ${row.lastName}`;
        };

        this.hook('beforeBulkCreate', async function beforeBulkCreate(rows) {
          emitter.emit('invoice:create:timeline', { account, models });
        });

        this.hook('beforeCreate', async (row) => { await saveHook(row); });

      },
      searchLike: async (models, where, search) => {
        if (search) {
          const ids = [];

          // Search in doc
          const rowsInv = await models.Invoice.findAll({
            where: {
              ref: { $iLike: `%${search}%` },
            }, attributes: ['id']
          });

          for (let ri = 0; ri < rowsInv.length; ri++) {
            ids.push(rowsInv[ri].id);
          }

          where.id = ids;
        }
        return where;
      },
    },
    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true,

    // Table name
    tableName: 'invoices',

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: false
  });
};
