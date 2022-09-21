const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
})

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const BasketDevice = sequelize.define('basket_device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Device = sequelize.define('device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  img: { type: DataTypes.STRING, allowNull: false },
})

const Type = sequelize.define('type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
})

const Review = sequelize.define('review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  body: { type: DataTypes.STRING, allowNull: false },
})

const DeviceInfo = sequelize.define('device_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
})

const TypeBrand = sequelize.define('type_brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating, { onDelete: 'cascade', hooks: true })
Rating.belongsTo(User)

User.hasMany(Review, { onDelete: 'cascade', hooks: true })
Review.belongsTo(User)

Basket.hasMany(BasketDevice, { onDelete: 'cascade', hooks: true })
BasketDevice.belongsTo(Basket)

Type.hasMany(Device, { onDelete: 'cascade', hooks: true })
Device.belongsTo(Type)

Brand.hasMany(Device, { onDelete: 'cascade', hooks: true })
Device.belongsTo(Brand)

Device.hasMany(Rating)
Rating.belongsTo(Device)

Device.hasMany(Review, { onDelete: 'cascade', hooks: true })
Review.belongsTo(Device)

Device.hasMany(BasketDevice, { onDelete: 'cascade', hooks: true })
BasketDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, { as: 'info', onDelete: 'cascade', hooks: true })
DeviceInfo.belongsTo(Device)

Type.belongsToMany(Brand, { through: TypeBrand })
Brand.belongsToMany(Type, { through: TypeBrand })

Review.belongsTo(Rating)

module.exports = {
  User,
  Basket,
  BasketDevice,
  Device,
  Type,
  Brand,
  Rating,
  Review,
  TypeBrand,
  DeviceInfo,
}
