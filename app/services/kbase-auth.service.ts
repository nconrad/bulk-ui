/*
 *  Class to handle token and login/logout actions
 *
 *  Notes:
 *    - We don't need to retrieve tokens as this is
 *      handled by https://narrative.kbase.us/#login
 */

import { Injectable } from '@angular/core';

import { config } from '../service-config';
import { token as DEV_TOKEN } from '../dev-token';

@Injectable()
export class KBaseAuth {
    user: string;
    token: string;

    constructor() {
        let token;
        let shouldUseCookie = config.productionMode;
        console.log('Production mode:', shouldUseCookie)

        if (shouldUseCookie)
            token = this.getToken()
        else {
            document.cookie = 'kbase_session='+DEV_TOKEN;
            token = this.getToken();
        }

        this.user = token.split('|')[0].replace('un=', '');
        this.token = token;
    }

    // method to get and parse the token from "kbase_session" cookie
    // into the correct, usable format.
    // see https://atlassian.kbase.us/browse/NAR-855?jql=text%20~%20%22cookie%22
    getToken() {
        let token;
        let cookies = document.cookie.split('; ');

        cookies.some(cookie => {
            let key = cookie.split('=')[0];
            if (key === 'kbase_session') {
                token = this.decodeToken(cookie);
                return true;
            }
        })

        if (!token) throw ('User token was not found in cookie "kbase_session"');

        return token;
    }

    decodeToken(sessionString: string) {
        let s = sessionString,
            encodedToken = s.slice(s.indexOf('token'), s.length);

        let token = decodeURIComponent(encodedToken).split('=')[1]
            .replace(/EQUALSSIGN/g, '=').replace(/PIPESIGN/g, '|');

        return token;
    }

    logout() {}

}