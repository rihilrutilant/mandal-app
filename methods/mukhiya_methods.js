const db = require("../utils/db_connection.js");
const admin = db.admin;
const admin_headline = db.admin_headline;
const mukhiya = db.mukhiya;
const slider = db.slider;
const bcrypt = require("bcryptjs");
const validation = require("../validation/validation.js");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');
const fs = require("fs");
const { response } = require("express");
const { ifError } = require("assert");





const mukhiyaLogin = async (req, res) => {
    const mukhiyaDetails = req.body;

    if (mukhiyaDetails) {

        const response = validation.mukhiyaLogin(req.body)

        try {

            if (response.error) {
                return res.status(200).send({ status: 0, msg: response.error.message });
            }
            else {
                const data = response.value;

                const mukhiyaDetails = await mukhiya.findOne({
                    where: {
                        member_id: data.member_id,
                    }
                })
                if (!mukhiyaDetails) {
                    return res.status(404).json({ error: "User does not found" });
                }

                const password = await bcrypt.compare(data.member_password, mukhiyaDetails.member_password);
                if (password == false) {
                    return res.status(404).json({ error: "Invalide password" });
                }

                const auth_token = jwt.sign(mukhiyaDetails.mukhiya_id, process.env.SECRET_KEY)

                await mukhiya.update({
                    auth_token: auth_token
                }, {
                    where: {
                        mukhiya_id: mukhiyaDetails.mukhiya_id,
                    }
                })

                const mukhiyaData = await mukhiya.findOne({
                    where: {
                        mukhiya_id: mukhiyaDetails.mukhiya_id,
                    }
                })
                console.log(mukhiyaData);

                return;

                res.status(200).send({ status: 1, msg: "login successfull", data: mukhiyaData });

            }
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    }
}

const editHeadLine = async (req, res) => {
    const headLine = req.body;
    const headLineID = req.params.id;
    const auth_token = req.headers['auth-token'];

    if (headLine) {
        const response = validation.editHeadLine(req.body)
        try {
            if (response.error) {
                return res.status(200).send({ status: 0, msg: response.error.message });
            }
            else {
                const data = response.value;

                const adminDetail = await admin.findOne({
                    where: {
                        auth_token: auth_token,
                    }
                })
                if (!adminDetail) {
                    return res.status(203).json({ error: "wrong authenticator" });
                }

                const headLineDetail = await admin_headline.findOne({
                    where: {
                        admin_headline_id: headLineID,
                    }
                })

                if (!headLineDetail) {
                    return res.status(404).json({ error: "HeadLine not found" });
                } else {
                    await admin_headline.update({
                        headline: data.headline
                    }, {
                        where: {
                            admin_headline_id: headLineID,
                        }
                    })

                    const headLineData = await admin_headline.findOne({
                        where: {
                            admin_headline_id: headLineID,
                        }
                    })

                    res.status(200).send({ status: 1, msg: "edit head line successfull", data: headLineData });
                }
            }
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    }
}

const fatchHeadLine = async (req, res) => {
    const auth_token = req.headers['auth-token'];
    try {
        const adminDetail = await admin.findOne({
            where: {
                auth_token: auth_token,
            }
        })
        if (!adminDetail) {
            return res.status(203).json({ error: "wrong authenticator" });
        } else {
            const headLineData = await admin_headline.findAll({})
            res.status(200).send({ status: 1, msg: "head line detail", data: headLineData });
        }



    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

const creatMember = async (req, res) => {
    const memberDetails = req.body;
    var auth_token = req.headers['auth-token'];

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    const adminDetail = await admin.findOne({
        where: {
            auth_token: auth_token,
        }
    })
    if (!adminDetail) {
        return res.status(203).json({ error: "wrong authenticator" });
    }


    if (memberDetails && adminDetail) {

        const response = validation.creatMember(req.body)


        if (response.error) {
            return res.status(200).send({ status: 0, msg: response.error.message });
        }
        else {

            const data = response.value;

            const mobile = await mukhiya.findOne({
                where: {
                    mukhiya_mobile_no: data.mukhiya_mobile_no,
                }
            })
            if (mobile) {
                return res.status(400).json({ error: 'User Mobile number already exist' })
            }

            const memberID = await mukhiya.findOne({
                where: {
                    member_id: data.member_id,
                }
            })
            if (memberID) {
                return res.status(400).json({ error: 'User Id already exist' })
            }

            const password = await bcrypt.hash(data.password, 10);

            const member = await mukhiya.create({
                member_id: data.member_id,
                mukhiya_mobile_no: data.mukhiya_mobile_no,
                member_password: password,
                is_deleted: 0,
                created_date: Date.now(),
                updated_date: Date.now()

            })

            const memberdata = await mukhiya.findOne({
                where: {
                    mukhiya_mobile_no: data.mukhiya_mobile_no,
                    member_id: data.member_id
                }
            })


            res.status(200).send({ status: 1, msg: "create mukhiya member successfull", data: memberdata });

        }

    }
}




module.exports = {
    mukhiyaLogin,
    editHeadLine,
    fatchHeadLine,
    creatMember,

}