import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators'; 

@Injectable()
export class Ajaxdata {

    protocol: string = window.location.protocol + '//';
    hostname: string = window.location.hostname;
    href: string;

    constructor(private http: HttpClient) {
        if (window.location.port === '') {
            this.href = window.location.href.replace(/#\/.*$/, '');
        } else {
            this.href = window.location.protocol + '//' + window.location.hostname + '/';
        }
    }

    getCardGroup (): any {
        let headers = this.getHeaders ();
        return this.http.post(
            this.href + 'php/getCardGroup.php',
            { headers: headers }
        );
    }

    setEmail (email: string, cards: any, question: string): any {
        let headers = this.getHeaders ();
        let jsoncards = JSON.stringify(cards);
        return this.http.post(
            this.href + 'php/setEmail.php', `href=${this.href}&email=${email}&cards=${jsoncards}&question=${question}`,
            { headers: headers }
        );
    }

    setAnswer (answer: string, id: number, email: string): any {
        let headers = this.getHeaders ();
        return this.http.post(
            this.href + 'php/setAnswer.php', `answer=${answer}&id=${id}&email=${email}&href=${this.href}`,
            { headers: headers }
        );
    }

    getCardsQuestion (id: number): any {
        let headers = this.getHeaders ();
        return this.http.post(
            this.href + 'php/getCardsQuestion.php', `id=${id}`,
            { headers: headers }
        );
    }

    getHeaders (): any {
        let headers: any = new Headers();
        headers.append('Accept', '*/*');
        headers.append('Content-Type',
                       'application/x-www-form-urlencoded; charset=UTF-8');
        return headers;
    }
}
