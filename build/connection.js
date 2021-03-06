"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
class Connection {
    static open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db)
                return this.db;
            try {
                let client = new mongodb_1.MongoClient(process.env.CONNECTION_STRING, this.options);
                yield client.connect();
                this.db = client.db("cms");
                return this.db;
            }
            catch (error) {
                console.error("Error while connecting to mongodb");
                console.error({ error });
            }
        });
    }
}
Connection.options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
exports.default = Connection;
