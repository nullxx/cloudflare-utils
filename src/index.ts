import { getDNSRecords, DNSRecord, deleteDNSRecord } from './lib/cloudflare';
import { isWebUp } from './lib/http';
const { Confirm, Select, Input } = require('enquirer');


async function deleteUnUsedDNS(zoneId: string) {
    const dnsRecords = await getDNSRecords(zoneId);

    const toDelete: DNSRecord[] = [];
    const toIgnore = ['TXT', 'MX'];

    for (const record of dnsRecords) {
        console.log('%d/%d Processing %s created on %s', dnsRecords.indexOf(record), dnsRecords.length, record.name, record.created_on);

        if (toIgnore.includes(record.type)) {
            console.log('Ignoring (type %s) %s', record.type, record.name);
            continue;
        }

        const isUp = await isWebUp(record.name, [200], { timeout: 5000 }); // FIXME check because not all status !== 200 are "down"
        if (!isUp) toDelete.push(record);
    }
    console.log('Deleting %d records', toDelete.length);

    for (const record of toDelete) {
        const prompt = new Confirm({
            name: 'question',
            message: `Do you want to delete ${record.name}`,
        });

        await prompt.run();
        if (prompt.value) await deleteDNSRecord(record);

    }
}

async function main() {
    const prompt = new Select({
        name: 'question',
        message: 'What do you want to do?',
        choices: [
            "Delete unused DNS records",
            "Exit",
        ],
    });

    await prompt.run();

    switch (prompt.value) {
        case 'Delete unused DNS records':
            const promptZoneId = new Input({
                name: 'question',
                message: 'Enter the DNS_ZONE_ID',
            });
            await promptZoneId.run();

            await deleteUnUsedDNS(promptZoneId.value);
            break;
        case 'Exit':
            process.exit(0);
    }
}

main();