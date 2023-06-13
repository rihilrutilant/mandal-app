const db = require("../utils/db_connection.js");
const admin = db.admin;
const admin_headline = db.admin_headline;
const mukhiya = db.mukhiya;
const slider = db.slider;
const bcrypt = require("bcryptjs");
const validation = require("../validation/validation.js");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { Op, where } = require("sequelize");
const { QueryTypes } = require('sequelize');
const fs = require("fs");
const { response } = require("express");
const { ifError } = require("assert");





const adminLogin = async (req, res) => {
    const adminDetails = req.body;

    if (adminDetails) {

        const response = validation.adminLogin(req.body)

        try {

            if (response.error) {
                return res.status(200).send({ status: 0, msg: response.error.message });
            }
            else {
                const data = response.value;

                // const password = await bcrypt.hash(data.password, 10);
                // console.log(password); $2a$10$s2L3vc0ZJoO1bOamXocUjurkB75jmZLzS3p5DtNu8AQIcN.dRTrvC


                const adminDetail = await admin.findOne({
                    where: {
                        mobile_no: data.mobile_no,
                    }
                })
                if (!adminDetail) {
                    return res.status(404).json({ error: "Please try to login with correct credentials" });
                }

                const password = await bcrypt.compare(data.password, adminDetail.password);
                if (password == false) {
                    return res.status(404).json({ error: "Please try to login with correct credentials" });
                }
                const auth_token = jwt.sign(adminDetail.admin_id, process.env.SECRET_KEY)

                await admin.update({
                    auth_token: auth_token
                }, {
                    where: {
                        mobile_no: data.mobile_no,
                    }
                })

                const userData = await admin.findOne({
                    where: {
                        mobile_no: data.mobile_no,
                    },
                    attributes: ["auth_token"]
                })
                res.status(200).send({ status: 1, msg: "login successfull", data: userData });

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

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }

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

    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
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

const addsliderImage = async (req, res) => {
    const auth_token = req.headers['auth-token'];
    const file = req.file;
    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    if (auth_token) {
        var adminDetail = await admin.findOne({
            where: {
                auth_token: auth_token
            }
        })

        if (!adminDetail) {
            fs.unlink(`./public/slider_images/${req.file.filename}`, (err) => { })
            return res.status(203).json({ error: "wrong authenticator" });
        }

        if (req.file) {
            const random = Math.floor(Math.random() * 10000000);
            const typeofextention = req.file.filename.slice((Math.max(0, req.file.filename.lastIndexOf(".")) || Infinity) + 1);
            const admin_id = adminDetail.admin_id;
            var file_name = `${admin_id}_${random}_${admin_id}.${typeofextention}`;
            fs.rename(`./public/slider_images/${req.file.filename}`, `./public/slider_images/${file_name}`, (err) => { })

        }

        const sliderImage = await slider.create({
            slider_photo: file_name,
            is_deleted: 0,
            created_date: Date.now(),
            updated_date: Date.now()

        })

        const sliderImageData = await slider.findOne({
            where: {
                slider_id: sliderImage.slider_id
            }
        })

        res.status(200).send({ status: 1, msg: "update successfull", data: sliderImageData });



    } else {
        fs.unlink(`./public/slider_images/${req.file.filename}`, (err) => { })
        return res.status(200).send({ status: 0, msg: "auth-token not found" });
    }

}

const fatchAllSliderImages = async (req, res) => {
    const auth_token = req.headers['auth-token'];
    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    try {
        const adminDetail = await admin.findOne({
            where: {
                auth_token: auth_token,
            }
        })
        if (!adminDetail) {
            return res.status(203).json({ error: "wrong authenticator" });
        } else {
            const sliderImageData = await slider.findAll({})
            res.status(200).send(sliderImageData);
        }



    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

const deleteSliderImageById = async (req, res) => {
    const auth_token = req.headers['auth-token'];
    const slider_id = req.params.id;
    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    try {
        const adminDetail = await admin.findOne({
            where: {
                auth_token: auth_token,
            }
        })
        if (!adminDetail) {
            return res.status(203).json({ error: "wrong authenticator" });
        } else {
            const sliderImageDetail = await slider.findOne({
                where: {
                    slider_id: slider_id
                }
            })

            if (!sliderImageDetail) {
                return res.status(404).json({ error: "please enter valid image id" });
            } else {
                const slider_photo = sliderImageDetail.slider_photo;
                const slider_id = sliderImageDetail.slider_id;
                fs.unlink(`./public/slider_images/${slider_photo}`, (err) => { })
                const deleteimage = await slider.destroy({
                    where: {
                        slider_id: slider_id
                    }
                })

                if (deleteimage) {
                    res.status(200).send({ status: 1, msg: "Slider image deleted successfully" });
                } else {
                    res.status(400).send({ status: 1, msg: "Slider image not deleted" });

                }
            }
        }

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

const editMember = async (req, res) => {
    const memberDetails = req.body;
    var auth_token = req.headers['auth-token'];
    const mukhiya_id = req.params.id;

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

    const memberDetail = await mukhiya.findOne({
        where: {
            mukhiya_id: mukhiya_id,
        }
    })


    if (!memberDetail) {
        return res.status(404).json({ error: "member not found please enter valid member id" });
    }


    if (memberDetails && adminDetail && memberDetail) {

        const response = validation.editMember(req.body)



        if (response.error) {
            return res.status(200).send({ status: 0, msg: response.error.message });
        }
        else {

            const data = response.value;
            console.log(data);


            if (data.member_password) {
                var password = await bcrypt.hash(data.member_password, 10);
            } else {
                var password = memberDetail.member_password;
            }
            if (data.mukhiya_mobile_no) {
                var mobile_no = data.mukhiya_mobile_no;
            } else {
                var mobile_no = memberDetail.mukhiya_mobile_no;
            }

            const member = await mukhiya.update({
                mukhiya_mobile_no: mobile_no,
                member_password: password,
                auth_token: "",
                updated_date: Date.now()
            }, {
                where: {
                    mukhiya_id: mukhiya_id,
                }
            })

            const memberdata = await mukhiya.findOne({
                where: {
                    mukhiya_id: mukhiya_id
                }
            })


            res.status(200).send({ status: 1, msg: "edit mukhiya member successfull", data: memberdata });

        }

    }
}

const fatchAllMembers = async (req, res) => {
    const auth_token = req.headers['auth-token'];
    if (!auth_token) {
        return res.status(404).send({ status: 0, msg: "auth token not found" });
    }
    try {
        const adminDetail = await admin.findOne({
            where: {
                auth_token: auth_token,
            }
        })
        if (!adminDetail) {
            return res.status(203).json({ error: "wrong authenticator" });
        } else {
            const memberData = await mukhiya.findAll()
            res.status(200).send(memberData);
        }

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    adminLogin,
    editHeadLine,
    fatchHeadLine,
    creatMember,
    addsliderImage,
    fatchAllSliderImages,
    deleteSliderImageById,
    editMember,
    fatchAllMembers

}