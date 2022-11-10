const socket = io();
var deck = []
var hand = []
var tmp_draw_card = ""
const image = "build_cards/"
const png = ".png"
var decklists = ""
var your_territory = ""
var enemy_territory = ""
var key = 0

const vue_territory = Vue.createApp({
    data(){
        return{
            images: [
                {
                    src: "",
                    key: 1
                }
            ]
        }
    }
}).mount('#your_territory')

const vue_enemy_territory = Vue.createApp({
    data(){
        return{
            images: [
                {
                    src: "",
                    key: 1
                }
            ]
        }
    }
}).mount('#enemy_territory')

socket.on('set_enemyTerritory',function(cardname){
    vue_enemy_territory.images[0].src = image + cardname + png
})

$(document).on('click','#setdeck',function(){
    $.when(
        $.when(
            your_territory = $('#territory').val(),
            decklists = $('#list').val()
        ).done(function(){
            deck = decklists.split(/\n/);
        })
    ).done(function(){
        vue_territory.images[0].src = image + your_territory + png
        socket.emit('v2_set_enemyTerritory',your_territory)
    });
})

$(document).on('click','#shuffle_deck',function(){
    $.when(
        arrShuffle(deck)
    ).done(function(){
        for(let i = 0; i < 5; i++){
            draw()
        }
    })
})

function draw(){
    tmp_draw_card = deck[0]
    deck.shift()
    key++
    hand.push({card: tmp_draw_card, id: key})
}

function render_hand(){
    const hand = document.querySelector('div#hands')
    hand.removeChild
}

function arrShuffle(arr){
    var len = arr.length;
    while(len > 0){
      var rnd = Math.floor(Math.random() * len);
      var tmp = arr[len-1];
      arr[len-1] = arr[rnd];
      arr[rnd] = tmp;
      len-=1;
    }
  }