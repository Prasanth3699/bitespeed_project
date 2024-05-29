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
Object.defineProperty(exports, "__esModule", { value: true });
exports.identify = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("./models");
function identify(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, phoneNumber } = req.body;
        if (!email && !phoneNumber) {
            return res.status(400).json({ error: "Either email or phoneNumber must be provided." });
        }
        const contacts = yield models_1.Contact.findAll({
            where: {
                [sequelize_1.Op.or]: [{ email }, { phoneNumber }],
            },
        });
        if (contacts.length === 0) {
            const newContact = yield models_1.Contact.create({
                email,
                phoneNumber,
                linkPrecedence: 'primary',
            });
            return res.json({
                contact: {
                    primaryContatctId: newContact.id,
                    emails: [newContact.email],
                    phoneNumbers: [newContact.phoneNumber],
                    secondaryContactIds: [],
                },
            });
        }
        const primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary');
        const secondaryContacts = contacts.filter(contact => contact.linkPrecedence === 'secondary');
        const allEmails = [...new Set(contacts.map(contact => contact.email).filter(Boolean))];
        const allPhoneNumbers = [...new Set(contacts.map(contact => contact.phoneNumber).filter(Boolean))];
        if (!primaryContact) {
            const oldestContact = contacts.reduce((oldest, contact) => {
                return new Date(contact.createdAt) < new Date(oldest.createdAt) ? contact : oldest;
            }, contacts[0]);
            oldestContact.linkPrecedence = 'primary';
            yield oldestContact.save();
            for (const contact of contacts) {
                if (contact.id !== oldestContact.id) {
                    contact.linkedId = oldestContact.id;
                    contact.linkPrecedence = 'secondary';
                    yield contact.save();
                }
            }
        }
        const response = {
            primaryContatctId: primaryContact ? primaryContact.id : null,
            emails: allEmails,
            phoneNumbers: allPhoneNumbers,
            secondaryContactIds: secondaryContacts.map(contact => contact.id),
        };
        res.json({ contact: response });
    });
}
exports.identify = identify;
