module.exports = function (app) {


    const admin_methods = require("../methods/admin_methods");
    const mukhiya_methods = require("../methods/mukhiya_methods");


    const middleware = require("../middleware/headermiddleware");

    ////******************** admin apis ******************////
    //// Admin Login http://localhost:5000/api/admin/admin_login
    app.post("/api/admin/admin_login", admin_methods.adminLogin);
    //// Admin Login http://localhost:5000/api/headline/edit_headline/:id
    app.put("/api/headline/edit_headline/:id", admin_methods.editHeadLine);
    //// Admin Login http://localhost:5000/api/headline/fatch_headline
    app.get("/api/headline/fatch_headline", admin_methods.fatchHeadLine);
    //// Admin Login http://localhost:5000/api/mukhya_member/create_mukhya_member
    app.post("/api/mukhya_member/create_mukhya_member", admin_methods.creatMember);
    //// Admin Login http://localhost:5000/api/slider/add_slider_img
    app.post("/api/slider/add_slider_img", middleware.upload.single("image"), admin_methods.addsliderImage);
    //// Admin Login http://localhost:5000/api/slider/fetch_all_slider_imgs
    app.post("/api/slider/fetch_all_slider_imgs", admin_methods.fatchAllSliderImages);
    //// Admin Login http://localhost:5000/api/slider/delete_slider_img/:id
    app.post("/api/slider/delete_slider_img/:id", admin_methods.deleteSliderImageById);
    //// Admin Login http://localhost:5000/api/slider/mukhya_member/edit_mukhya_member/:id
    app.put("/api/slider/mukhya_member/edit_mukhya_member/:id", admin_methods.editMember);


    ////******************** mukhiyas apis ******************////
    //// Admin Login http://localhost:5000/api/mukhya_member/login_mukhya_member
    app.post("/api/mukhya_member/login_mukhya_member", mukhiya_methods.mukhiyaLogin);


}