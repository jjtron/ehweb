import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';
import { Ajaxdata } from './services/Ajaxdata';
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
        this.cardUrlArray = this.getCardUrlArray();
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
    
    getCardUrlArray() {
        return [
            {"file": "suit-of-pentacles/king-of-pentacles.png", "desc": "The King of Pentacles embodies the mature and dependable aspects of maturity. Anyone represented by this card is tied to success and status. While it may refer to your own characteristics, the Kings most often stand in for other people in your life who can aid you."},
            {"file": "suit-of-pentacles/ten-of-pentacles.png", "desc": "Your financial security and emotional well-being are both positively indicated by the presence of this card in your spread. This is only partially your own doing, however, as these positive aspects are inextricably bound up in your close relationships with friends and family."},
            {"file": "suit-of-pentacles/knight-of-pentacles.png", "desc": "The Knight of Pentacles symbolizes the virtues of patience, honour, and dependability, and his presence in your spread may indicate you, too, possess these traits. An alternative traditional view is that he represents a young man, a dependable bearer of good news who will soon enter your life."},
            {"file": "suit-of-pentacles/page-of-pentacles.png", "desc": "The Page is always an intellectual card, and the suit of Pentacles is traditionally associated with introspection and conscientiousness, which may form the basis of your own personality."},
            {"file": "suit-of-pentacles/four-of-pentacles.png", "desc": "Perhaps through a gift or inheritance, or possibly through your own business acumen, you are on a path leading towards financial and material security. This will likely be a pleasant chapter of your life, wherein your emotional and spiritual needs are satisfied."},
            {"file": "suit-of-pentacles/ace-of-pentacles.png", "desc": "Aces always represent a new beginning in some form, and the Ace of Pentacles suggests a strongly positive one for you. Your life is about to enter a very productive period -- or at least a period which will see your work rewarded in good measure to the level of work you are willing to perform."},
            {"file": "suit-of-pentacles/nine-of-pentacles.png", "desc": "The IX of Pentacles represents significant financial reward, but one borne of hard work and careful planning on your part; a just reward for prudent actions. It may also indicate that a time of hardship for you is ending and a counter-balancing time of pleasant living is at hand."},
            {"file": "suit-of-pentacles/two-of-pentacles.png", "desc": "The II is, as always, bound up in the forces of change, and of balance. Like its brothers, the II of Pentacles can mean good or ill, but it as a strong indicator that the status quo will be disrupted. "},
            {"file": "suit-of-pentacles/five-of-pentacles.png", "desc": "The V of Pentacles can, depending on the rest of your spread, refer to financial matters, employment, or relationships. Unfortunately, it is a negative indicator for all of them, suggesting duplicity, loss of jobs, and the possibility of infidelity."},
            {"file": "suit-of-pentacles/three-of-pentacles.png", "desc": "If you can maintain a clear sense of purpose over the coming months, you are well positioned to see you hard work get the recognition it deserves. It is not guaranteed, but if you maintain your own pace, and it may tax your interpersonal skills, as you will need to rely and trust on others for the best outcome."},
            {"file": "suit-of-pentacles/six-of-pentacles.png", "desc": "Success in your life is bound up to generosity. This may mean your prosperity will arise from your investment in others, perhaps a financial investment, or maybe advice and support for a friend. This card can also mean the reverse, that your success will arise from the generosity of someone else."},
            {"file": "suit-of-pentacles/seven-of-pentacles.png", "desc": "A balanced card by nature the VII suggest you will avoid failure, but fall short of runaway success in an endeavour. Or, equally possible, that you will achieve your goals, but not in the time frame you had hoped for."},
            {"file": "suit-of-pentacles/queen-of-pentacles.png", "desc": "The Queen is a card steeped in the tradition of family, and reflects a person, usually a woman, who is financially adroit, and possess a very pragmatic, practical, nature. This person will come to your aid in some financial matter, most likely advice on how to better manage your money."},
            {"file": "suit-of-pentacles/eight-of-pentacles.png", "desc": "If you are involved in any work requiring creative inspiration or craftsmanship, the VIII of Pentacles is a very positive card. This is doubly true if you are using skills you are still trying to master. This is as likely to be a hobby as your primary work."},
            {"file": "major-arcana/the-chariot.png", "desc": "You have some hard work ahead of you. It may be resolved quickly, but the Chariot is a powerful card, and the labor you are undertaking will probably trend towards long and difficult. You will quite possibly experience rough roads, long uphill slopes, dead ends, and painful setbacks."},
            {"file": "major-arcana/wheel-of-fortune.png", "desc": "Symbolic of life's cycles, the Wheel of Fortune speaks to good beginnings. Most likely, you will find the events foretold to be positive, but, being aspects of luck, they may also be beyond your control and influence."},
            {"file": "major-arcana/the-fool.png", "desc": "The Fool is a very powerful card in the Tarot deck, usually representing a new beginning -- and, consequently, an end to something in your old life. The Fool's position in your spread reveals which aspects of your life may be subject to change."},
            {"file": "major-arcana/the-lovers.png", "desc": "Your first instinct will most likely be to associate this card as representing love, but, much like love, it does not possess a simple nature. Not only does love comes in many forms, but the Lovers may indicate important or difficult choices ahead in your life."},
            {"file": "major-arcana/the-high-priestess.png", "desc": "Your identification with the High Priestess suggests you possess inherent good judgment, in the form of strong intuition. She may indicate that reason should take second place to instinct. Your head must trust in the wisdom of your heart for a change."},
            {"file": "major-arcana/the-heirophant.png", "desc": "Depending on your own nature, the Hierophant can mean very different things. At its root, it represents doctrine, but doctrine can come in the form of teaching and guidance or rigid authority."},
            {"file": "major-arcana/the-world.png", "desc": "The World is an indicator of a major and inexorable change, of tectonic breadth. This change represents a chance for you to bring about a desirable end to the Old and a good beginning to the New."},
            {"file": "major-arcana/the-empress.png", "desc": "Traditionally associated with strong maternal influence, the presence of the Empress is excellent news if you are looking for harmony in your marriage or hoping to start a family."},
            {"file": "major-arcana/the-magician.png", "desc": "The Magician generally associates with intelligent and skillful communicators. His presence in your spread indicates a level of self-confidence and drive which allows you to translate ideas into action."},
            {"file": "major-arcana/the-star.png", "desc": "The Star's presence signifies a period of respite and renewal for you. This renewal may be spiritual, physical, or both. It is a particularly positive sign if you or someone close is recovering from illness or injury. It is a light in the darkness, illuminating your future and your past."},
            {"file": "major-arcana/the-sun.png", "desc": "As an inherently good influence, finding the Sun is a positive development. It is suggestive of personal gain, and that personal goals and joy are within reach, if you are willing to invest the effort to actualize them."},
            {"file": "major-arcana/the-emperor.png", "desc": "Counterpart to the Empress, the Emperor is signifies a powerful influence, generally male in nature. This can also include concepts in your life historically considered masculine, such as leadership and authority, self-discipline, and stability through the power of action."},
            {"file": "major-arcana/the-hanged-man.png", "desc": "The Hanged Man can be interpreted in two very different ways. All change is a small kind of death, as the old must die to create the new, and it may simply indicate upheaval or change in your future, perhaps beyond your control, but more likely a decision that, for good or ill, you will not be able to turn back from."},
            {"file": "major-arcana/the-moon.png", "desc": "Something in your life is not what it seems. Perhaps a misunderstanding on your part, or a truth you cannot admit to yourself. It may also indicate something important being kept from you by another."},
            {"file": "major-arcana/the-tower.png", "desc": "Dark and foreboding, the Tower is the embodiment of disruption and conflict. Not just change, but the abrupt and jarring movement caused by the unforeseen and traumatic events which are part of life. The Tower in your spread is always a threat, but life inevitably involves tragedy, and you must decide whether you will face it with grace."},
            {"file": "major-arcana/strength.png", "desc": "Strength is the rawest form of power, and you possess it in some form. It is a very happy card if you are fighting illness or recovering from injury. As might be suspected, its influence over you, and the use you put it to, can trend towards light or dark."},
            {"file": "major-arcana/judgement.png", "desc": "Judgment tells a story of transition, but unlike Death or the Tower, it is not sudden change, or born of luck or intuition, but change that springs from reason. It signifies plans, often long in the making, coming to fruition."},
            {"file": "major-arcana/temperance.png", "desc": "An optimistic card, Temperance encourages you to find balance in your life and approach problems with a calm demeanour. It recognizes that opposing forces need not be at war within you. Tread carefully in any major decisions you make, with confidence that good decisions will lead to a good resolution for you."},
            {"file": "major-arcana/the-hermit.png", "desc": "There are times in every life, when one must step back and make a careful examination of their situations and decisions. Finding the Hermit in your spread suggests this is just such a time for you."},
            {"file": "major-arcana/death.png", "desc": "Death is indicative of change in your future. This change can be in almost any aspect of your life, but it will almost certainly be permanent, significant, and absolute. Death suggests a complete severance between the past and the future, and it will likely be painful."},
            {"file": "major-arcana/justice.png", "desc": "Justice is a very good card to find in your spread if you have acted with kindness and fairness towards other and, especially, if you have been a victim. It is a significant indicator of a positive resolution, although how and what sort will depend on your own experiences."},
            {"file": "major-arcana/the-devil.png", "desc": "The Devil is in the business of entrapment. It signifies a situation from which there is no escape, or a road leading to one. Forewarning may let you avoid the trap, or it may not. What sort of trap, and how you might avoid it, depends on where the Devil appears in your spread, and what other cards surround it."},
            {"file": "suit-of-cups/page-of-cups.png", "desc": "The Page of Cups, if it refers to you in your spread, suggests an introspective nature, inclined towards art, and possessing a kind heart. You may let credit you deserve pass you by out of shyness."},
            {"file": "suit-of-cups/seven-of-cups.png", "desc": "This card speaks strongly to your inner self. It is trying to tell you something about your unconscious or the realms of your imagination. Your hopes, dreams, and unrealized aspirations are all fair game to the VII of Cups."},
            {"file": "suit-of-cups/two-of-cups.png", "desc": "The single resounding theme associated with the II of Cups is partnership. What sort of partnership is less clear, but you are in the past, present, or future, part of a powerful one. This partnership will involve absolute trust and commanding respect."},
            {"file": "suit-of-cups/four-of-cups.png", "desc": "Apathy is the most insidious of evil. If its influence remains unchecked you may lose yourself, and not even realize what you have lost. This card is a strong warning that you must break out of your current cycles."},
            {"file": "suit-of-cups/ace-of-cups.png", "desc": "The Ace of Cups signifies the beginning of period of strong emotional health for you. Expect copious joy, happiness, and love to surround you during this time. Existing personal relationships may strengthen, meaningful new ones are likely to form."},
            {"file": "suit-of-cups/king-of-cups.png", "desc": "The King of Cups is the worldly and calm projection of authority. Find him in your spread is most likely a reference to someone else who will aid you in achieving your goals."},
            {"file": "suit-of-cups/nine-of-cups.png", "desc": "This card is a very powerful positive indicator for you! It represents a lasting or powerful contentment in your life. While nothing is permanent, somewhere along your life's path you can expect to be truly happy."},
            {"file": "suit-of-cups/three-of-cups.png", "desc": "This card is both a portent of celebration and cause for it. It tells of great happiness in the future for you, and not of the passing kind, but secure joy which will last and be shared with those around you."},
            {"file": "suit-of-cups/five-of-cups.png", "desc": "This card is a dark omen. Like the rest of its suit, it is bound your emotions, and it brings with it a warning of loss and disappointment. Expect a setback in your life, almost certainly emotional. While this may be emotional, it may be a project or goal you are particularly invested in, emotionally."},
            {"file": "suit-of-cups/queen-of-cups.png", "desc": "Sensitivity and an affectionate nature are traditionally associated with the Queen of Cups, who is the emotionally open balance to the King. Despite her open nature, you will still find her influence to be largely passive."},
            {"file": "suit-of-cups/six-of-cups.png", "desc": "The VI of Cups is rooted deep in the past, but it is also a card closely bound to your happiness. It suggests that your family, your old friends, perhaps even past lovers, are in the process of adding greatly to the joys in your life."},
            {"file": "suit-of-cups/eight-of-cups.png", "desc": "The VIII suggests that there is stability and security in your life, but at a personal cost. You are probably unfulfilled by your current life. Depending on the rest of your spread, it may be a strong push for you to move on, and find the courage to strike out in a new direction."},
            {"file": "suit-of-cups/ten-of-cups.png", "desc": "You can expect to attain some long goal if you find the X of Cups in your spread. This card is, like the rest of the Cups, imbued with emotional undertones."},
            {"file": "suit-of-cups/knight-of-cups.png", "desc": "The Knight of Cups encourages you to remember that victory is not just an exercise in strength of arms, but can be achieved through cleverness and a savvy mind."},
            {"file": "suit-of-wands/ten-of-wands.png", "desc": "If the X of Wands appears in your spread, you are likely working too hard, or taking on more burdens than you should. It can indicate both excessive workloads in pursuit of your goals, or as a result of attaining them."},
            {"file": "suit-of-wands/two-of-wands.png", "desc": "The II of Wands suggests the formation of partnerships in your immediate future, or the success of already existing joint ventures. You will likely find yourself in a position to reap the rewards of these partnerships, in the form of financial gain or promotion."},
            {"file": "suit-of-wands/king-of-wands.png", "desc": "The King of Wands may signify an upcoming financial windfall for you. It can also represent an association with a masculine authority figure, a leader and arbitrator. You may find yourself aided in solving a dispute. Be open to the advice of those with more experience than yourself."},
            {"file": "suit-of-wands/six-of-wands.png", "desc": "Your past efforts are about to pay dividends if you find the Six of Wands in your spread. Whether in the form of recognition for your past work or material reward, some level of success is in your future. If you are waiting for some particular news, this card is most likely a portent of good news."},
            {"file": "suit-of-wands/nine-of-wands.png", "desc": "The IX of Wands is a bittersweet discovery in your spread, as it suggests both struggles ahead and the capacity within you to overcome them. Your life is probably comfortable at the moment, but there are also likely signs of trouble in some of the less critical aspects of your personal or professional life."},
            {"file": "suit-of-wands/five-of-wands.png", "desc": "The Five of Wands is never a welcome card, as long tradition suggests you will be in line for struggle and aggravation. Pay close attention to the surrounding cards to discover clues about which areas of your life will be subject to these conflicts."},
            {"file": "suit-of-wands/queen-of-wands.png", "desc": "The Queen of Wands is associated with an outgoing and friendly personality, indicating you are extroverted but self-contained. An independent streak may contrast with your strong attachment to your close friends and family."},
            {"file": "suit-of-wands/ace-of-wands.png", "desc": "Drawing the Ace of Wands strongly suggests a new business enterprise being undertaken, traditionally, although some also interpret it to indicate childbirth. It speaks more strongly to the characteristics you will need to succeed in these new conditions."},
            {"file": "suit-of-wands/knight-of-wands.png", "desc": "The Knight of Wands is a maverick's card, and it may be associated with you if you are given to spontaneity, shifting your positions quickly. This may lead some to see you as capricious, but most will enjoy your energy."},
            {"file": "suit-of-wands/seven-of-wands.png", "desc": "You almost certainly have great reserves of courage, and the perseverance to see yourself through difficult times. You may not be aware you possess these qualities, but you will find yourself needing them soon. Expect conflicts, possibly small, but more likely significant."},
            {"file": "suit-of-wands/eight-of-wands.png", "desc": "Prepare yourself for an abrupt increase in the pace of your life. Things are about to get very busy. They good news is that any projects you begin will progress quickly, you will experience few delays, and the conclusion is likely to be successful."},
            {"file": "suit-of-wands/four-of-wands.png", "desc": "Peace and security follow in the wake of the Four of Wands, usually in the smaller aspects of your life. Do not let the limited scope bring you to underestimate the joy that simple successes can bring, however: This is a card of good endings and fresh starts."},
            {"file": "suit-of-wands/three-of-wands.png", "desc": "If you can bring the fullness of your creativity and inventiveness to the table, then the III of Wands brings good news. You are about to enter a time where your potential for productivity and accomplishment is very favourable. Keep your eyes open for new career opportunities and your mind open to new possibilities."},
            {"file": "suit-of-wands/page-of-wands.png", "desc": "A vital indicator, the Page suggests good news coming to you from or about a youthful individual. If the card is describing you, personally, it indicates you possess boundless energy, deep loyalty, and youthful love of learning. It may also point towards a new project you will soon be undertaking."},
            {"file": "suit-of-swords/nine-of-swords.png", "desc": "One of the more negative card to discover in your spread, the IX of Swords foretells or describes a powerful mental anguish. The source of this anguish may well be within you, arising from you being too quick to cast a negative light on your actions or abilities."},
            {"file": "suit-of-swords/queen-of-swords.png", "desc": "The Queen of Swords represents a very perceptive individual, sharp-witted and professionally distant. You will most likely find her to be your aid and counsel, possibly a teacher."},
            {"file": "suit-of-swords/seven-of-swords.png", "desc": "Another card which indicates forces opposing you, the VII of Swords points to there being a single source of your frustration. This is both positive, in that you may be able to identify that source and change your circumstances, and negative, in that this source may well be aware of you and deliberately sabotaging you."},
            {"file": "suit-of-swords/six-of-swords.png", "desc": "Your mental focus can put you on track to leave your current troubles behind, leading to better times ahead. It is important to face your problems from a mental standpoint, thinking through them. There is still trouble ahead for you, but the worst is over."},
            {"file": "suit-of-swords/knight-of-swords.png", "desc": "If you or someone close to you is represented by the Knight of Swords, beware. It is symbolic of a forceful personality, one which combines zealous dedication to success with razor-sharp intellect."},
            {"file": "suit-of-swords/two-of-swords.png", "desc": "Like crossed blades, the II of Swords represents a balance of forces. Not necessarily an absence of struggle, but an equal distribution of force in opposition. It may indicate you are in a position to mediate a conflict, or it may instead suggest you are caught in the middle of a dilemma with no clear outcome."},
            {"file": "suit-of-swords/page-of-swords.png", "desc": "Your personality may trend towards the stubborn and opinionated, if the Page represents you in the spread, but it is also indicative of strong analytical skills and an energetic nature."},
            {"file": "suit-of-swords/five-of-swords.png", "desc": "This card indicates conflict in your life. Worse yet, it is closely associated with defeat. It is likely that the defeat will be traumatic, and you will need to retreat and regroup. Your may have suffered injury to your pride or self-esteem, but the V of Swords is also a warning of a potential to get caught in the cycle."},
            {"file": "suit-of-swords/eight-of-swords.png", "desc": "Some things in life are beyond your control, and the VIII of Swords suggests that you are being actively held back by some of them. This can something as personal as a bad boss or as sweeping as international politics."},
            {"file": "suit-of-swords/ten-of-swords.png", "desc": "The X of Swords is a cause for fear in any who believe in the power of the cards, and you should prepare yourself for whatever it portends. It is one of many cards which can represent disaster, but, alone among them, it is a disaster which cannot be avoided."},
            {"file": "suit-of-swords/king-of-swords.png", "desc": "The King of Swords represents the professional aspects of authority. Often associated with those in legal or business careers, he most likely represents someone who will aid you in one of these fields."},
            {"file": "suit-of-swords/four-of-swords.png", "desc": "Representing order and stability, combined with the tumultuous nature of the Swords, the IV of Swords offers your respite from the battles in your life. The peace may be temporary, but appreciate it while it lasts. It may point towards recovery from prolonged illness."},
            {"file": "suit-of-swords/three-of-swords.png", "desc": "The presence of the III of Swords in your spread suggests significant pain in your life. This pain is likely caused by or the result of conflict, perhaps due to disrupted partnership or friendship. This pain may be part of a new beginning, but you must face your pain honestly to overcome it."},
            {"file": "suit-of-swords/ace-of-swords.png", "desc": "The Ace of Swords is, like all of the Aces, the purest embodiment of its suit. In relation to your personality or your actions it implies a strong element of focus, determination, and an intellectual capacity."}
        ];    
    }
}
