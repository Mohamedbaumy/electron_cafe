// import { Sequelize } from "sequelize";

// const sequelize = new Sequelize("unimedica_db", "redha", "redhaRedha@1redha", {
//   host: "127.0.0.1",
//   dialect: "mysql",
// });

// export default sequelize;

import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './cafe.sqlite',
  logging: false
})

export default sequelize
