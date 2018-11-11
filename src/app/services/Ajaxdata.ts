import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators'; 

@Injectable()
export class Ajaxdata {

    protocol: string = window.location.protocol + '//';
    hostname: string = window.location.hostname;
    href: string;

    constructor(private http: HttpClient) {
        if (window.location.port === '') {
            this.href = window.location.href.replace(/(pick|admin).*$/, '');
        } else {
            this.href = window.location.protocol + '//' + window.location.hostname + '/';
        }
    }

    getCardGroup (): any {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            })
        };
        return this.http.post(
            this.href + 'php/getCardGroup.php', null, httpOptions
        );
    }

    setEmail (email: string, cards: any, question: string, psychicid): any {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            })
        };
        let jsoncards = JSON.stringify(cards);
        return this.http.post(
            this.href + 'php/setEmail.php', `href=${this.href}&email=${email}&cards=${jsoncards}&question=${question}&psychicid=${psychicid}`,
            httpOptions
        );
    }

    setAnswer (answer: string, id: number, email: string): any {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            })
        };
        return this.http.post(
            this.href + 'php/setAnswer.php', `answer=${answer}&id=${id}&email=${email}&href=${this.href}`,
            httpOptions
        );
    }

    getCardsQuestion (id: number): any {
        return this.http.get(
            this.href + `php/getCardsQuestion.php?id=${id}`
        );
    }
}
