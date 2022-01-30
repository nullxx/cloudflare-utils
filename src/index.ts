import { getDNSRecords, DNSRecord, deleteDNSRecord } from './lib/cloudflare';
import { isWebUp } from './lib/http';

async function deleteUnUsedDNS() {
    if (!process.env.DNS_ZONE_ID) throw new Error('No env DNS_ZONE_ID');
    const dnsRecords = await getDNSRecords(process.env.DNS_ZONE_ID);
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
    // return;
    for (const record of toDelete) {
        console.log('Deleting %s', record.name);
        // deleteDNSRecord(record);
    }
}

deleteUnUsedDNS();