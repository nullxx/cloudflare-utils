import axios from 'axios';


export async function isWebUp(url: string, authorizedHttpCodes: number[] = [200], opts: { timeout?: number }): Promise<boolean> {
    try {
        const response = await axios.get(`http://${url}`, {
            validateStatus: function () {
                return true;
            },
            timeout: opts.timeout,
        });
        if (authorizedHttpCodes.includes(response.status)) return true;
        return false;
    } catch (error) {
        return false;
    }
}