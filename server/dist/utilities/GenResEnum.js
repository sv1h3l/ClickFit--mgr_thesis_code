"use strict";
/* Generic Response and Enum */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenEnum = void 0;
var GenEnum;
(function (GenEnum) {
    GenEnum[GenEnum["SUCCESS"] = 200] = "SUCCESS";
    GenEnum[GenEnum["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    GenEnum[GenEnum["UNAUTHORIZED"] = 403] = "UNAUTHORIZED";
    GenEnum[GenEnum["NOT_FOUND"] = 404] = "NOT_FOUND";
    GenEnum[GenEnum["ALREADY_EXISTS"] = 409] = "ALREADY_EXISTS";
    GenEnum[GenEnum["FAILURE"] = 500] = "FAILURE";
})(GenEnum || (exports.GenEnum = GenEnum = {}));
// FIXME → Předělat všechny interfaces na GenRes
//# sourceMappingURL=GenResEnum.js.map