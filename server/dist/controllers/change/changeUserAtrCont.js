"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserAtrCont = exports.ChangeUserAtrCodeEnum = void 0;
const changeUserAtrMod_1 = require("../../models/change/changeUserAtrMod");
const getUserAtrFromAuthTokenMod_1 = require("../../models/get/getUserAtrFromAuthTokenMod");
const GenResEnum_1 = require("../../utilities/GenResEnum");
var ChangeUserAtrCodeEnum;
(function (ChangeUserAtrCodeEnum) {
    ChangeUserAtrCodeEnum[ChangeUserAtrCodeEnum["FIRST_NAME"] = 1] = "FIRST_NAME";
    ChangeUserAtrCodeEnum[ChangeUserAtrCodeEnum["LAST_NAME"] = 2] = "LAST_NAME";
    ChangeUserAtrCodeEnum[ChangeUserAtrCodeEnum["HEIGHT"] = 3] = "HEIGHT";
    ChangeUserAtrCodeEnum[ChangeUserAtrCodeEnum["WEIGHT"] = 4] = "WEIGHT";
    ChangeUserAtrCodeEnum[ChangeUserAtrCodeEnum["AGE"] = 5] = "AGE";
})(ChangeUserAtrCodeEnum || (exports.ChangeUserAtrCodeEnum = ChangeUserAtrCodeEnum = {}));
const changeUserAtrCont = async (req, res) => {
    const { userAtrCode, value } = req.body;
    const valueAsString = value;
    let column = "";
    switch (userAtrCode) {
        case ChangeUserAtrCodeEnum.FIRST_NAME:
        case ChangeUserAtrCodeEnum.LAST_NAME: {
            if (!valueAsString) {
                res.status(400).json({ message: "Nesmí být prázdné" });
                return;
            }
            else if (valueAsString.length > 20) {
                res.status(400).json({ message: "Nesmí obsahovat více než 20 znaků" });
                return;
            }
            column = userAtrCode === ChangeUserAtrCodeEnum.FIRST_NAME ? "first_name" : "last_name";
            break;
        }
        case ChangeUserAtrCodeEnum.HEIGHT: {
            if (valueAsString.length > 3) {
                res.status(400).json({ message: "Nesmí obsahovat více než 3 znaky" });
                return;
            }
            else if (value > 300) {
                res.status(400).json({ message: "Nesmí být větší než 300" });
                return;
            }
            else if (value < 0) {
                res.status(400).json({ message: "Nesmí být záporná" });
                return;
            }
            column = "height";
            break;
        }
        case ChangeUserAtrCodeEnum.WEIGHT: {
            if (valueAsString.length > 3) {
                res.status(400).json({ message: "Nesmí obsahovat více než 3 znaky" });
                return;
            }
            else if (value > 600) {
                res.status(400).json({ message: "Nesmí být větší než 600" });
                return;
            }
            else if (value < 0) {
                res.status(400).json({ message: "Nesmí být záporná" });
                return;
            }
            column = "weight";
            break;
        }
        case ChangeUserAtrCodeEnum.AGE: {
            if (valueAsString.length > 3) {
                res.status(400).json({ message: "Nesmí obsahovat více než 3 znaky" });
                return;
            }
            else if (value > 120) {
                res.status(400).json({ message: "Nesmí být větší než 120" });
                return;
            }
            else if (value < 0) {
                res.status(400).json({ message: "Nesmí být záporný" });
                return;
            }
            column = "age";
            break;
        }
        default: {
            res.status(422).json({ message: "Neplatný atribut" });
            return;
        }
    }
    try {
        const userAtrs = await (0, getUserAtrFromAuthTokenMod_1.getUserAtrFromAuthTokenMod)({ req });
        if (userAtrs.status !== GenResEnum_1.GenEnum.SUCCESS || !userAtrs.data) {
            res.status(userAtrs.status).json({ message: userAtrs.message });
            return;
        }
        const dbRes = await (0, changeUserAtrMod_1.changeUserAtrMod)({ userId: userAtrs.data.userId, userEmail: userAtrs.data.userEmail, value, column });
        res.status(dbRes.status).json({ message: dbRes.message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nastala serverová chyba, zkuste to znovu" });
    }
};
exports.changeUserAtrCont = changeUserAtrCont;
//# sourceMappingURL=changeUserAtrCont.js.map