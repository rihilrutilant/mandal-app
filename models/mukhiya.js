module.exports = (sequelize, DataTypes) => {

    const mukhiya = sequelize.define("mukhiya", {
        mukhiya_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        member_id: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        mukhiya_mobile_no: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        member_password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        auth_token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updated_date: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, { timestamps: false })
    return mukhiya
}