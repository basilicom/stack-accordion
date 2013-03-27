/*************************************************!
 *
 *   project:   Stack Accordion
 *   author:    Marco Senkpiel
 *   url:       http://marco-senkpiel.de/2013/03/26/jquery-stack-accordion-plugin/
 *   demo:      http://labs.marco-senkpiel.de/demos/stack-accordion/
 *   download:  https://github.com/basilicom/stack-accordion
 *
 *   Version:   1.0
 *   Copyright: (c) 2013 Marco Senkpiel
 *   Licence:   MIT
 *
 **************************************************/

(function ($) {
    var StackAccordion = function (accordion, options) {

        var defaults = {
                width: 600,
                height: 300,
                lapping: 0,
                cardWith: 500,
                duration: 500,
                easing: 'swing',
                triggerOnHover: false,
                onStart: null,
                onComplete: null
            },

            settings = $.extend({}, defaults, options),

            methods = {
                reset: function () {
                    core.resetPositions();
                }
            },

            core = {
                cards: [],
                cardsCount: 0,
                currentCard: 0,
                spaceBetweenCards: 0,
                spreading: 0,
                initialPositions: [],

                addIndices: function () {
                    core.cards.each(function (index) {
                        $(this).data('index', index);
                    });
                },

                applyStyles: function () {
                    accordion.addClass('stackAccordion').css({
                        width: settings.width,
                        height: settings.height
                    });

                    core.cards.each(function () {
                        $(this).css({
                            position: 'absolute'
                        });
                    });
                },

                setInitialPositions: function () {
                    core.cards.each(function (index) {
                        var $this = $(this);
                        var left = (index * core.spaceBetweenCards);

                        if (!index == 0) {
                            left -= settings.lapping;
                        }

                        core.initialPositions[index] = left;

                        $this.css({
                            left: left,
                            width: settings.cardWith,
                            height: '100%'
                        });
                    });
                },

                bindEvents: function () {
                    core.cards.each(function (index) {
                        var $card = $(this);
                        if (settings.triggerOnHover) {
                            $card.children('.trigger').on('mouseover.stackAccordion', {index: index}, core.triggerCard);
                        } else {
                            $card.children('.trigger').on('click.stackAccordion', {index: index}, core.triggerCard);
                        }
                    });
                },

                triggerCard: function (e) {
                    core.currentCard = e.data.index;
                    core.animateCards();
                },

                animateCards: function () {
                    core.cards.each(function (index) {

                        var $card = $(this);
                        var position = 0;

                        if (index > 0) {
                            if (index <= core.currentCard) {
                                position = (core.spreading * index);
                                core.moveCard($card, index, position);
                            } else {
                                position = ((core.spreading * index) + ((settings.cardWith - settings.lapping) - core.spreading));
                                core.moveCard($card, index, position);
                            }
                        }
                    });
                },

                moveCard: function ($card, index, position) {
                    core.onAnimationStart(index);
                    $card.stop().animate({
                        left: position
                    }, {
                        duration: settings.duration,
                        easing: settings.easing,
                        complete: core.onAnimationComplete
                    });
                },

                onAnimationStart: function (index) {
                    if (index == core.cardsCount - 1) {
                        if (typeof settings.onStart === 'function') {
                            settings.onStart();
                        }
                    }
                },

                onAnimationComplete: function () {
                    if ($(this).data('index') == core.cardsCount - 1) {
                        if (typeof settings.onComplete === 'function') {
                            settings.onComplete(core.currentCard);
                        }
                    }
                },

                resetPositions: function () {
                    core.cards.each(function (index) {
                        core.moveCard($(this), index, core.initialPositions[index]);
                    });
                },

                init: function () {
                    core.cards = accordion.children('li');
                    core.cardsCount = core.cards.length;
                    core.spaceBetweenCards = Math.floor(settings.width / core.cardsCount);
                    core.spreading = (settings.width - settings.cardWith) / (core.cardsCount - 1);

                    core.addIndices();
                    core.applyStyles();
                    core.setInitialPositions();
                    core.bindEvents();
                }
            };

        core.init();

        return methods;
    };

    $.fn.stackAccordion = function (method) {

        var element = this;
        var instance = element.data('stackAccordion');

        if (typeof method === 'object' || !method) {
            return element.each(function () {
                var stackAccordion;
                if (!instance){
                    stackAccordion = new StackAccordion(element, method);
                    element.data('stackAccordion', stackAccordion);
                }
            });

        } else if (typeof method === 'string' && instance[method]) {
            // call public methods
            instance[method].call(element);
            return element;
        }
    };
})(jQuery);