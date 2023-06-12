const joi = require("joi")



function adminLogin(admin) {
    const adminDetails =
        joi.object({
            mobile_no: joi.number()
                .integer()
                .min(10 ** 9)
                .max(10 ** 10 - 1)
                .required(),
            password: joi.string()
                .trim()
                .min(6)
                .required()
        })

    return adminDetails.validate(admin)
}

function editHeadLine(headlines) {
    const headLine =
        joi.object({
            headline: joi.string()
                .trim()
                .min(1)
                .required()
        })


    return headLine.validate(headlines)
}

function creatMember(memberData) {
    const memberDetails =
        joi.object({
            mukhiya_mobile_no: joi.number()
                .integer()
                .min(10 ** 9)
                .max(10 ** 10 - 1)
                .required(),
            member_id: joi.string()
                .trim()
                .min(8)
                .required(),
            password: joi.string()
                .trim()
                .min(6)
                .required()
        })

    return memberDetails.validate(memberData)
}

function mukhiyaLogin(mukhiya) {
    const mukhiyaDetails =
        joi.object({
            member_id: joi.string()
                .trim()
                .min(8)
                .required(),
            member_password: joi.string()
                .trim()
                .min(6)
                .required()
        })

    return mukhiyaDetails.validate(mukhiya)
}

module.exports = {
    adminLogin,
    editHeadLine,
    creatMember,
    mukhiyaLogin
}