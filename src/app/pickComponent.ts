import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';
import { Ajaxdata } from './services/Ajaxdata';
import { Cards } from './models/cards';
import * as d3 from 'd3';

@Component({
    selector: 'app-3',
    templateUrl: './pickComponent.html',
    styleUrls: ['./app.component.css']
})
export class PickComponent implements AfterViewChecked {
    afterViewCheckedInit: boolean = false;
    buttonsDisabled: boolean = false;
    cardDeck: any[] = [];
    cardDescriptions: string[] = [];
    cardDimsRatio: number = 14.4 / 24;
    cardHeight: number;
    cardHeight_2: number;
    cardPick: number = 0;
    cardPickScale: number;
    cardSpreadSizeFactor: number;
    cardShuffleInProgress: boolean = false;
    cardWidth: number;
    cardWidth_2: number = 16;
    cardShuffleHeight: number;
    cardUrlArray: any[];
    centerRect: any;
    cloningCard: any;
    email: string;
    emailValid: boolean = false;
    gCenter: any;
    gCenterStatic: any;
    hostImages: string;
    href: string;
    logoImage: any;
    question: string;
    questionPosted: boolean = false;
    rnd0to77: number[] = [];
    scatterCard: any;
    spiral: any;
    svgContainer: any;
    svgContainerWidth: number;
    svgElement: any;
    title: string = 'Psychic Cosmic Tarot';
    textArcRadius: number;
    userPicks: string[] = [];
    rotateStop: number;
    psychicId: string;

    constructor(private ajaxData: Ajaxdata, route: ActivatedRoute) {
        this.href = ajaxData.href;
        this.hostImages = 'assets/';
        this.logoImage = new Image();
        this.logoImage.src = this.hostImages + 'Logo.png';
        for (let i = 0; i < 78; i++) {
            let img = new Image();
            img.src = this.hostImages + 'card-back.jpg';
            img.onload = () => { this.cardDeck.push(img.src); }
        }
        let ra: number[] = [];
        for (let j = 0; j < 78; j++) { ra.push(j); }
        this.rnd0to77 = this.shuffle(ra);
        let cardsObj = new Cards();
        this.cardUrlArray = cardsObj.cards;
        this.cardPickScale = (window.innerWidth > 451) ? 8 : 6;
        this.cardSpreadSizeFactor = this.cardPickScale / 4.6;
        route.params.subscribe((params) => {
            this.psychicId = params.psychicid || '000';
        });
    }

    ngAfterViewChecked() {
        if (this.cardDeck.length === 78 && !this.afterViewCheckedInit) {
            this.cardShuffleHeight = d3.select('#work-container').node().clientWidth/1.75;
            let circumference = this.cardShuffleHeight * Math.PI;
            this.cardWidth = circumference / 78 * 2;
            this.cardHeight = this.cardWidth / this.cardDimsRatio;
            this.cardHeight_2 = this.cardWidth_2 / this.cardDimsRatio;
            this.svgElement = d3.select('#svg-element').node();
            this.svgElement.setAttribute('height', 650);

            let spiralDim = this.cardShuffleHeight * 2;
            d3.select('#g-center-static').append('svg:image')
                .attr('opacity', '1')
                .attr('width', spiralDim)
                .attr('height', spiralDim)
                .attr('x',  -spiralDim/2)
                .attr('y', -spiralDim/2)
                .attr('xlink:href', 'assets/spiral.png')
                .attr('opacity', 0.1)
                .attr('id', 'spiral');
            this.spiral = d3.select('#spiral').node();
            d3.select('#spiral').attr('transform', 'scale(0)');

            d3.select('#g-center-static').append('svg:image')
                .attr('opacity', '1')
                .attr('width', this.cardWidth)
                .attr('height', this.cardHeight)
                .attr('x', this.cardWidth/(-2))
                .attr('y',  this.cardHeight/(-2))
                .attr('xlink:href', 'assets/card-back.jpg')
                .attr('id', 'centerRect');
            this.centerRect = d3.select('#centerRect').node();
            d3.select('#centerRect').attr('transform', 'scale(8)');

            d3.select('#g-center-static').append('svg:image')
                .attr('opacity', '1')
                .attr('width', 0)
                .attr('height', 0)
                .attr('x',  this.cardHeight/(-2))
                .attr('y', this.cardWidth/(-2))
                .attr('xlink:href', 'assets/card-back.jpg')
                .attr('id', 'cloneRect');
            this.cloningCard = d3.select('#cloneRect').node();

            d3.select('#g-center').append('svg:image')
                .attr('opacity', '1')
                .attr('width', 0)
                .attr('height', 0)
                .attr('x',  this.cardHeight/(-2))
                .attr('y', this.cardWidth/(-2))
                .attr('xlink:href', 'assets/card-back.jpg')
                .attr('id', 'scatterRect');
            this.scatterCard = d3.select('#scatterRect').node();
            this.svgContainer = d3.select('#svg-container').node();
            this.svgContainerWidth = this.svgContainer.offsetWidth;

            let inner_arc = d3.arc()
                .innerRadius(this.cardShuffleHeight / 3)
                .outerRadius(this.cardShuffleHeight / 3)
                .startAngle(0)
                .endAngle(360);
            
            this.textArcRadius = this.cardShuffleHeight;

            let x = (this.svgContainerWidth / 2 - this.textArcRadius / 2);
            let y = ((this.cardShuffleHeight + this.cardHeight)/2  - this.textArcRadius / 2);
            
            d3.select('#g-text-arc')
                .attr('transform', 'translate(' + x + ', ' + y + ')');

            let sp = d3.select('#g-text-arc').append('svg')
                .attr('width', this.textArcRadius)
                .attr('height', this.textArcRadius)
                .attr('opacity', 0.8);
            
            sp.append('path')
                .attr('d', inner_arc)
                .attr('id', 'inner-circle')
                .attr('fill', '#0000ff')
                .attr('transform-origin', 'center')
                .attr('transform', 'translate(' + this.textArcRadius / 2 + ',' + this.textArcRadius / 2 + ')');
            
            let text_names = sp.append('text')
                .attr('x', 0)
                .attr('dy', 0)
                .style('font-size', 25 + 'px')
                .style('font-family', 'Times New Roman');
            
            text_names.append('textPath')
                .attr('id', 'textArcText')
                .attr('fill', '#eeeeee')
                .attr('xlink:href','#inner-circle');
            
            this.gCenter = d3.select('#g-center').node();
            this.gCenterStatic = d3.select('#g-center-static').node();
            this.gCenterStatic.setAttribute('transform', 'translate(' + this.svgContainerWidth / 2 + ', ' + (this.cardShuffleHeight + this.cardHeight)/2 + '), scale(0.5)');
            this.afterViewCheckedInit = true;
        }
    }
    startShuffleProcess() {
        d3.select('#centerRect').transition().duration(750).attr('transform', 'scale(1)').on('end', () => {
            d3.select('#spiral').transition().duration(750).attr('transform', 'scale(1)').on('end', () => {
                this.dealOutCards();
            });
        });

    }
    dealOutCards() {
        d3.select('#textArcText').text('Out of chaos ...');
        let ra: number[] = [];
        for (let j = 0; j < 78; j++) { ra.push(j); }
        this.rnd0to77 = this.shuffle(ra);

        this.buttonsDisabled = true;
        this.cardShuffleInProgress = true;
        let repeatCount = 0;
        let f = (1 / 78) * 360;
        
        d3.select('#centerRect').transition().duration(750).attr('transform', 'scale(1)');
        let rotateGCenter = (timestamp) => {
            if (repeatCount > 77) {
                this.restack();
                return;
            }
            let rotateAngle = this.rnd0to77[repeatCount];
            this.spiral.setAttribute('transform', 'rotate(' + 20 * repeatCount + ')');
            this.gCenter.setAttribute('transform', 'translate(' + this.svgContainerWidth / 2 + ', ' + (this.cardShuffleHeight + this.cardHeight)/2 + '), rotate(' + f * rotateAngle + '), scale(0.5)');
            d3.select('#g-text-arc')
                .attr('transform', 'translate(' + 
                    (this.svgContainerWidth / 2 - this.textArcRadius / 2) + 
                    ', ' + ((this.cardShuffleHeight + this.cardHeight)/2  - this.textArcRadius / 2) +
                    '), rotate(' + (- 3 * repeatCount) + ',' + 
                    this.textArcRadius/2 + ',' + this.textArcRadius/2 + ')');
            this.rotateStop = - 3 * repeatCount;
            repeatCount++;
            let degrees = f * (rotateAngle);
            let y =  this.cardShuffleHeight * Math.sin(2 * Math.PI / 360 * degrees);
            let x =  this.cardShuffleHeight * Math.cos(2 * Math.PI / 360 * degrees);
            let n = 0;
            let dealOutCard = (timestamp) => {
                this.scatterCard.setAttribute('transform', 'translate(' + (n + 1) *  this.cardShuffleHeight/5 + ', 0), rotate(' +  (n + 1) * 54 + ', ' + '0' + ', 0)');
                this.scatterCard.setAttribute('width',  this.cardWidth);
                this.scatterCard.setAttribute('height', this.cardHeight);
                n++;
                if (n > 4) {
                    this.scatterCard.setAttribute('width', 0);
                    this.scatterCard.setAttribute('height', 0);
                    this.cloningCard.setAttribute('transform', 'translate(' + x + ', ' + y + '), rotate(' + (degrees + 90) + ', ' + '0' + ', 0)');
                    let newCard = this.cloningCard.cloneNode(false);
                    newCard.setAttribute('height', this.cardHeight);
                    newCard.setAttribute('width', this.cardWidth);
                    newCard.setAttribute('id', 'c' + rotateAngle);
                    this.gCenterStatic.appendChild(newCard);
                    requestAnimationFrame(rotateGCenter);
                    return;
                }
                requestAnimationFrame(dealOutCard);
            }
            requestAnimationFrame(dealOutCard);
        }
        requestAnimationFrame(rotateGCenter);
    }

    restack() {
        this.scatterCard.setAttribute('width', 0);
        this.cloningCard.setAttribute('width', 0);
        let repeatCount = 0;
        let f = (1 / 78) * 360;
        let loop78 = () => {
            if (repeatCount > 77) {
                d3.select('#textArcText').text('');
                this.buttonsDisabled = false;
                this.cardShuffleInProgress = false;
                d3.select('#spiral').transition().duration(750).attr('transform', 'scale(0)').on('end', () => {
                    d3.select('#centerRect').transition().duration(750).attr('transform', 'scale(8)');
                });
                return;
            }
            d3.select('#g-text-arc')
                .attr('transform', 'translate(' + 
                    (this.svgContainerWidth / 2 - this.textArcRadius / 2) + 
                    ', ' + ((this.cardShuffleHeight + this.cardHeight)/2  - this.textArcRadius / 2) +
                    '), rotate(' + (this.rotateStop + (- 3 * repeatCount)) + ',' + 
                    this.textArcRadius/2 + ',' + this.textArcRadius/2 + ')');
            if (d3.select('#textArcText').text() !== 'arises a new order.') {
                d3.select('#textArcText').text('arises a new order.');
            }
            this.spiral.setAttribute('transform', 'rotate(' + 20 * (78 - repeatCount) + ')');
            let degrees = f * (repeatCount);
            let y =  this.cardShuffleHeight * Math.sin(2 * Math.PI / 360 * degrees);
            let x =  this.cardShuffleHeight * Math.cos(2 * Math.PI / 360 * degrees);
            let n = 0;
            let restackCard = (timestamp) => {
                let c = d3.select('#c' + repeatCount).node();
                c.setAttribute('transform', 'translate(' + ((4 - n) / 5 * x) + ', ' + ((4 - n) / 5 * y) + '), rotate(' + n * 54 + ', ' + '0' + ', 0)');
                n++;
                if (n > 4) {
                    c.parentNode.removeChild(c);
                    repeatCount++;
                    requestAnimationFrame(loop78);
                    return;
                }
                requestAnimationFrame(restackCard);
            }
            requestAnimationFrame(restackCard);
        }
        requestAnimationFrame(loop78);
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shuffle(a: number[]) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    setUpCardPickLayout() {
        d3.select('#shuffle-pick-buttons').style('height', 0);
        d3.select('#shuffle-pick-buttons').transition().duration(500).style('opacity', 0);
        this.cardDescriptions = [];
        let narrowViewPortFactor = (window.innerWidth > 451) ? 1 : 3.2; // narrowViewPortFactor 451px or less
        this.buttonsDisabled = true;
        this.cloningCard.setAttribute('width', 0);
        let cw = this.svgContainerWidth;
        let cssf = this.cardSpreadSizeFactor;
        d3.select('#centerRect').transition().duration(750)
            .attr('width', this.cardWidth_2)
            .attr('height', this.cardHeight_2)
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', 'translate(' + -cw / 2 + ', 0), scale(' + cssf + ')');
        d3.select('#g-center-static')
            .transition()
            .duration(750)
            .attr('transform', 'translate(' + cw / 2 + ', ' + this.cardHeight_2/2 + '), scale(1)')
            .on("end", () => {
                let nCards = 78;
                let k = 0;
                let nRows = 6;
                let nCardsPerRow = nCards/nRows;
                let j = 0;
                let spreadCards = setInterval(() => {
                    let newCard = this.centerRect.cloneNode(false);
                    this.gCenterStatic.appendChild(newCard);
                    newCard.setAttribute('width', this.cardWidth_2);
                    newCard.setAttribute('height', this.cardHeight_2);
                    newCard.setAttribute('x', 0);
                    newCard.setAttribute('y', 0);
                    newCard.setAttribute('id', 'c' + k);
                    newCard.setAttribute('opacity', '1');
                    newCard.setAttribute('style', 'cursor: pointer;');
                    let cardId = k;
                    newCard.addEventListener('click', () => { this.pickCard(cardId); });
                    if (k % nCardsPerRow === 0) { j = 0; }
                    let dx = -cw/2 + ((cw - nCardsPerRow * this.cardWidth_2/(nCardsPerRow - 1) * cssf)/(nCardsPerRow - 1)) * j++;
                    let dy = this.cardHeight_2/2 * cssf;
                    dy = Math.floor(k / nCardsPerRow) * 2.5 * dy;
                    newCard.setAttribute('transform', 'translate(' + dx + ', ' +  dy + '), scale(' + cssf + ')');
                    this.centerRect.setAttribute('opacity', '0');
                    if (++k === nCards) {
                        clearInterval(spreadCards);
                        this.svgElement.setAttribute('height', 650);
                        let cntrRct = document.getElementById('centerRect');
                        let cntrRctParent = cntrRct.parentNode;
                        cntrRctParent.removeChild(cntrRct);
                        let buttonsDiv = document.getElementById('shuffle-pick-buttons');
                        let buttonsDivParent = buttonsDiv.parentNode;
                        buttonsDivParent.removeChild(buttonsDiv);
                    }
                }, 15);
            });
    }
    pickCard(i: number) {
        let cs = this.cardPickScale;
        if (this.cardPick > 2) {return;}
        this.cardPick++;
        let card = d3.select('#c' + i);
        card.raise();
        let cardData: any = this.cardUrlArray[this.rnd0to77[i]];
        this.userPicks.push(cardData.file);
        let cardWidth_2 = cs * this.cardWidth_2;
        let space = (this.svgContainerWidth - 3 * cardWidth_2) / 6;
        let dx = -this.svgContainerWidth/2 + ((2 * this.cardPick) - 1) * space + (this.cardPick - 1) * cardWidth_2;
        
        card
            .transition()
            .duration(750)
            .attr('opacity', 1)
            .attr('id', 'p' + i)
            .attr('transform', 'translate(' + dx + ', ' + cs * 1.7 * this.cardHeight_2 + '), scale(' + cs + ')')
            .on('end', () => {
                card.attr('xlink:href', 'assets/' + cardData.file);
                d3.select('#g-center-static').append('text')
                    .attr('transform', 'translate(' + dx + ', ' +
                          cs * 2.8 * this.cardHeight_2 + '), scale(1)')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '12px')
                    .attr('font-weight', 'bold')
                    .attr('fill', '#ffffff')
                    .attr('dx', this.cardWidth_2 * cs/2)
                    .text(this.textFormat(cardData.file));

                this.cardDescriptions.push(cardData.desc);
                if (this.cardPick === 3) {
                    for (let k = 0; k <= 78; k++) {
                        let c = d3.select('#c' + k).node();
                        if (c) {c.parentNode.removeChild(c);}
                    }
                    d3.select('#g-center-static')
                        .transition()
                        .duration(750)
                        .attr('transform', 'translate(' + this.svgContainerWidth / 2 + ', ' + (-1.66 * cs * this.cardHeight_2) + '), scale(1)'); // -13 for 8; -10 for 6
                    d3.select('#svg-element').transition()
                        .duration(750)
                        .attr('height', (cs * 1.2 * this.cardHeight_2))
                    .on('end', () => {
                        d3.select('#user-information')
                            .transition()
                            .duration(750)
                            .style('opacity', 1);
                    });
                }
            });
    }

    textFormat(text: string) {
        let textParts = text.split('/');
        let nameParts = textParts[1].split('.')[0].split('-');
        let upperNameParts = nameParts.map((word: string) => {
            return word.charAt(0).toUpperCase() + word.substr(1);
        });
        return upperNameParts.join(' ');
    }

    setEmail () {
        this.ajaxData.setEmail(this.email, this.userPicks, this.question, this.psychicId).subscribe((resp: any) => {
            if (true) {
                this.questionPosted = true;
            }
        });
    }
    onChange(e) {
        this.emailValid = /^.+@.+\.[a-z]{2,3}$/.test(this.email);
    }
}
