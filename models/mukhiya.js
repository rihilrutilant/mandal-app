module.exports = (sequelize, DataTypes) => {

    const mukhiya = sequelize.define("mukhiya", {
        mukhiya_id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        member_id: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        mukhiya_mobile_no: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        member_password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        auth_token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        mukhiya_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        middle_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        birth_date: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        country_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        city_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        village_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        maternal_village_name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        blood_group: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        cast: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        marriage_status: {
            type: DataTypes.ENUM,
            values: ['MARRIED', 'UNMARRIED'],
            defaultValue: 'MARRIED'
        },
        education: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        bussiness: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        social_media_link: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        adress: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        business_adress: {
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