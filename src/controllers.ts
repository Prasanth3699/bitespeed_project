import { Request, Response } from 'express';
import { Op } from 'sequelize'; 
import { Contact } from './models';

async function identify(req: Request, res: Response) {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "Either email or phoneNumber must be provided." });
    }

    const contacts = await Contact.findAll({
        where: {
            [Op.or]: [{ email }, { phoneNumber }],
        },
    });

    if (contacts.length === 0) {
        const newContact = await Contact.create({
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
        await oldestContact.save();

        for (const contact of contacts) {
            if (contact.id !== oldestContact.id) {
                contact.linkedId = oldestContact.id;
                contact.linkPrecedence = 'secondary';
                await contact.save();
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
}

export { identify };
