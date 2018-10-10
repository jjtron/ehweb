import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Ajaxdata } from './services/Ajaxdata';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'app-2',
  templateUrl: './adminComponent.html',
  styleUrls: ['./app.component.css']
})
export class AdminComponent {

    title: string = 'Psychic Cosmic Tarot';
    protocol: string = window.location.protocol + '//';
    href: string;
    hostImages: string;
    cards: any[] = [];
    question: string = '';
    answer: string = '';
    email: string;
    id: number;
    answerPosted: boolean = false;
    newImages: any[] = [];
    nLoadedImages: number = 0;
    logoImage: any;

    constructor (private ajaxData: Ajaxdata, private route: ActivatedRoute) {
        this.href = ajaxData.href;
        this.hostImages = this.href + 'assets/';
        this.route.queryParams.subscribe((params: any) => {
            this.id = params.id;
            d3.json('assets/cards.json').then(cards => {
                let cardDescriptions = {};
                cards.forEach((el: any) => {
                    cardDescriptions[el.file] = el.desc;
                });
                return cardDescriptions;
            }).then((cardDescriptions) => {
                this.ajaxData.getCardsQuestion(this.id).subscribe((resp: any) => {
                    this.cards = resp.cards;
                    this.question = resp.question;
                    this.email = resp.email;
                    this.logoImage = new Image();
                    this.logoImage.src = this.hostImages + 'Logo.png';
                    this.logoImage.onload = () => {
                        let arr: any[] = [];
                        this.cards.forEach((card) => {
                            arr.push({ src: this.href  + 'assets/' + card, desc: cardDescriptions[card] });
                        });
                        this.preloadimages(arr);
                    }
                });
            });
        });
    }
    
    setAnswer () {
        this.ajaxData.setAnswer(this.answer, this.id, this.email).subscribe((resp: any) => {
            if (true) {
                this.answerPosted = true;
            }
        });
    }
    
    preloadimages(arr){
        for (let i=0; i<arr.length; i++){
            this.newImages[i] = new Image();
            this.newImages[i].src = arr[i].src;
            this.newImages[i].desc = arr[i].desc;
            this.newImages[i].onload = () => {
                this.nLoadedImages++;
            }
        }
    }
}
