import axios, { AxiosResponse } from 'axios';

export interface DeleteDNSRecordResponse {
    id: string;
}

export interface DNSRecord {
    id: string;
    zone_id: string;
    zone_name: string;
    name: string;
    type: string;
    content: string;
    proxiable: boolean;
    proxied: boolean;
    ttl: boolean;
    locked: boolean;
    created_on: string;
    modified_on: string;
}

interface GeneralCloudflareAPIResponse<T> {
    successs: boolean;
    result: T
}

const instance = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        "Authorization": "Bearer " + process.env.AUTH_BEARER_TOKEN,
        "Content-Type": "application/json"
    },
});

export async function getDNSRecords(zoneId: string) {
    const endpoint = `zones/${zoneId}/dns_records`;
    const response = await instance.get<{}, AxiosResponse<GeneralCloudflareAPIResponse<DNSRecord[]>>>(endpoint);
    return response.data.result;
}

export async function deleteDNSRecord(record: DNSRecord) {
    const endpoint = `zones/${record.zone_id}/dns_records/${record.id}`;
    const response = await instance.delete<{}, AxiosResponse<GeneralCloudflareAPIResponse<DeleteDNSRecordResponse>>>(endpoint);
    return response.data.result;
}

export async function exportDNSRecords(zoneId: string) {
    const endpoint = `zones/${zoneId}/dns_records/export`;
    const response = await instance.delete<{}, AxiosResponse<GeneralCloudflareAPIResponse<{}>>>(endpoint);
    return response.data.result;
}