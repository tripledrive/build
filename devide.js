var territory
var deck
var decklength
var active
var cards = []
var hands = []
var dum_hands = 0
var en = []
var en_enem = []
var life = []
var fi = []
var fi_enem = []
var gy = []
var gy_enem = []
var op = false
var rm = []
var rm_enem = []
var look = []
var judgement = 0
const socket = io();

//トラッキング用データ
var yourpoints = 0
var opppoints = 0 // yrp > oppならplayfirst = 1にする
var firsthands = []
var firstlife = []
var playfirst = 0 //1なら先攻
var ter_en

//オーラ対応
var aura = []
var put_aura_mode = false

socket.on('emit-setterritory',function(en_stat){
    ter_en = en_stat
    ace_enem.innerHTML = '<img src="build_cards/' + en_stat + '.png" class="cimg trt" style="width: 200px;height: auto;"></img>'
});

socket.on('emit-setto',function(en_stat){
    topen_enem.innerHTML = en_stat
});

socket.on('emit-setsheets',function(en_stat){
    sheets_enem.innerHTML = en_stat
});

socket.on('emit-setlife',function(en_stat){
    lifes_enem.innerHTML = en_stat
});

$(document).on('click','#setdeck',function(){
    $.when(
        $.when(
            territory = $('#territory').val(),
            deck = $('#list').val()
        ).done(function(){
            cards = deck.split(/\n/);
        })
    ).done(function(){
        ace.innerHTML = '<img src="build_cards/' + territory + '.png" class="cimg trt" style="width: 200px;height: auto;"></img>'
        updatesheets();
        set_to("(未開放)");
        console.log(territory);
        console.log(cards.length);
        socketpluscheckhand('emit-setterritory',territory)
    });
});

function set_to(str){
    topen.innerHTML = str;
    socketpluscheckhand('emit-setto',str)
}

function updatesheets(){
    var str = String(cards.length);
    sheets.innerHTML = str;
    socketpluscheckhand('emit-setsheets',str)
}

function uplifes(){
    var str = String(life.length)
    lifes.innerHTML = str
    socketpluscheckhand('emit-setlife',str)
}

$(document).on('click','.set_io',function(){
    $('.ready').toggle();
});

$(document).on('click','.open_tt',function(){
    if(!op){
        op = true
        set_to("(開放)");
        $('#topen').addClass('openned')
    }else{
        op = false
        set_to("(未開放)");
        $('#topen').removeClass('openned')
    }
});

$(document).on('click','.shf_2',function(){
    arrShuffle(cards)
});


$(document).on('click','.shuffle_deck',function(){
    $.when(
        $.when(
            arrShuffle(cards)
        ).done(function(){
            for(let i = 0; i < 5; i++){
                draw()
            }
        })
    ).done(function(){
        console.log(cards);
        console.log(hands);
        firsthands = hands;
        for(let i = 0; i < hands.length; i++){
            $('.hand').append('<img src="build_cards/' + hands[i] + '.png" id="hand_' + i +'" class="cimg hands">')
            updatesheets();
        }
    })
});

$(document).on('click','.maligun',function(){
    for(let i = 0; i < hands.length; i++){
        $('#hand_' + i).remove()
    }
    $.when(
        maligun()
    ).done(function(){
        $.when(
            arrShuffle(cards)
        ).done(function(){
            console.log(cards);
            console.log(hands);
            for(let i = 0; i < hands.length; i++){
                $('.hand').append('<img src="build_cards/' + hands[i] + '.png" id="hand_' + i +'" class="cimg hands">')
                updatesheets();
            }
        })
    })
});

socket.on('emit-seten',function(str,num){
    $('.energy_enem').append('<img src="build_cards/' + str + '.png" id="en_enem_' + num +'" class="cimg ens enm">')
});

socket.on('emit-setfie',function(str,num){
    $('.field_enem').append('<img src="build_cards/' + str + '.png" id="fi_enem_' + num +'" class="cimg ens enm">')
});

socket.on('emit-setgy',function(str,num){
    $('.gy_enem').append('<img src="build_cards/' + str + '.png" id="gy_enem_' + num +'" class="cimg ens enm">')
});

socket.on('emit-setrem',function(str,num){
    $('.rm_enem').append('<img src="build_cards/' + str + '.png" id="rm_enem_' + num +'" class="cimg ens enm">')
});

$(document).on('click','.setall',function(){
    en = []
    life = []
    firstlife = []
    $.when(
        charge()
    ).done(function(){
        $.when(
            setlife()
        ).done(function(){
            console.log(cards);
            console.log(life);
            firstlife = life;
            updatesheets();
            uplifes()
            for(let i = 0; i < en.length; i++){
                $('.energy').append('<img src="build_cards/' + en[i] + '.png" id="en_' + i +'" class="cimg ens">')
                socketpluscheckhand('emit-seten',en[i],i)
            }
        })
    })
});

$(document).on('click','.draw',function(){
    $.when(
        draw()
    ).done(function(){
        let i = hands.length - 1; 
        $('.hand').append('<img src="build_cards/' + hands[i] + '.png" id="hand_' + i +'" class="cimg hands">');
        updatesheets();
    })
});

function draw(){
    var top = cards.shift()
    hands.push(top)
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

function maligun(){
    for(let i = 0; i < 5; i++){
        var top = cards.shift()
        var htop = hands.shift()
        hands.push(top)
        cards.push(htop)
    }
}

function charge(){
    for(let i = 0; i < 2; i++){
        var top = cards.shift()
        en.push(top)
    }
}

function setlife(){
    for(let i = 0; i < 10; i++){
        var top = cards.shift()
        life.push(top)
    }
}

socket.on('emit-pullaura',function(num){
    var pull_fie_id = num.replace('enem_','')
    var pull = []
    for(i = 0; i < aura.length; i++){
        if(aura[i].parent_id == pull_fie_id){
            pull.push(aura[i].card_src)
        }
    }
    socket.emit('call-pullaura',pull)
})

socket.on('emit-getaura',function(auracards){
    for(i = 0; i < auracards.length; i++){
          $('#select_aura').append('<img src="'+ auracards[i] +'" class="aura_img"></img>')
      } 
})

$(document).on('click','.aura_img',function(e){
    var num = $(this).attr('id')
    $.when(
        select_reset()
    ).done(function(){
        active = num
        $('#' + num).addClass("active_")
        console.log(num)
    })
})

$(document).on('click','.cimg',function(e){
    var num = $(this).attr('id')
    var src = $(this).attr('src')
    select_aura.innerHTML = ""
    if(!e.ctrlKey){
        $.when(
            select_reset()
        ).done(function(){
            active = num
            $('#' + num).addClass("active")
            console.log(num)
        })
    }else{
        active = num
        $('#' + num).addClass("active")
        console.log(num) 
    }
    selected_card.innerHTML = '<img src="'+ src +'" class="cimg" style="width:320px; height:auto;"></img>'
    if(num.indexOf('enem') != -1){
        socket.emit('call_aura',num)
    }else{
    for(i = 0; i < aura.length; i++){
        if(aura[i].parent_id == $('.active').attr('id') ){
          $('#select_aura').append('<img src="'+ aura[i].card_src +'" id="aura_'+ i +'" class="aura_img"></img>')
        }
      } 
    }
});

function select_reset(){
    $('#' + active).removeClass("active")
    $('.active_').removeClass("active_")
}

$(document).on('click','.tap',function(){
    tapping();
    $('.active').removeClass('active')
});

$(document).on('click','.active',function(){
    tapping();
});

function tapping(){
    if(!($('.active').hasClass('hands')) && !($('.active').hasClass('gys')) && !($('.active').hasClass('looks'))){
        if($('.active').hasClass('tapped')){
            $('.active' + '.tapped').each(function(){
                var num = $(this).attr("id");
                var id = num.split("_");
                var tmp = id[0] + "_enem_" + id[1]
                socket.emit('remtap',tmp)
            })
            $('.active').removeClass('tapped')
        }else{
            $('.active').each(function(){
                var num = $(this).attr("id");
                var id = num.split("_");
                var tmp = id[0] + "_enem_" + id[1]
                socket.emit('addtap',tmp)
            })
            $('.active').addClass('tapped')
        }
    }
}

socket.on('addtap',function(tmp){
    $('#' + tmp).addClass('tapped')
})

socket.on('remtap',function(tmp){
    $('#' + tmp).removeClass('tapped')
})

socket.on('emit-remen',function(id){
    $('#en_enem_' + id).remove()
});

socket.on('emit-remfie',function(id){
    $('#fi_enem_' + id).remove()
});

socket.on('emit-remgy',function(id){
    $('#gy_enem_' + id).remove()
});

socket.on('emit-remrem',function(id){
    $('#rm_enem_' + id).remove()
});

$(document).on('click','.set_eng',function(){
    var act = document.getElementById(active)
    var num = $('.active').attr('id')
    var id = num.split("_")
    var tmp = id[1]
    if($('.active').hasClass('hands')){
        var checkcard = hands[tmp]
        en.push(checkcard)
        $.when(
            act.remove(),
        ).done(function(){
            var len = en.length - 1
            $('.energy').append('<img src="build_cards/' + en[len] + '.png" id="en_' + len +'" class="cimg ens">')
            socketpluscheckhand('emit-seten',en[len],len)
        })
    }else if($('.active').hasClass('fie')){
        var checkcard = fi[tmp]
        en.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remfie',tmp),
            remove_aura(num)
        ).done(function(){
            var len = en.length - 1
            $('.energy').append('<img src="build_cards/' + en[len] + '.png" id="en_' + len +'" class="cimg ens">')
            socketpluscheckhand('emit-seten',en[len],len)
        })
    }else if($('.active').hasClass('gys')){
        var checkcard = gy[tmp]
        en.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remgy',tmp)
        ).done(function(){
            var len = en.length - 1
            $('.energy').append('<img src="build_cards/' + en[len] + '.png" id="en_' + len +'" class="cimg ens">')
            socketpluscheckhand('emit-seten',en[len],len)
        })
    }else if($('.active').hasClass('rms')){
        var checkcard = rm[tmp]
        en.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remrem',tmp)
        ).done(function(){
            var len = en.length - 1
            $('.energy').append('<img src="build_cards/' + en[len] + '.png" id="en_' + len +'" class="cimg ens">')
            socketpluscheckhand('emit-seten',en[len],len)
        })
    }else if($('.active').hasClass('looks')){
        var checkcard = look[tmp]
        en.push(checkcard)
        $.when(
            act.remove(),
        ).done(function(){
            var len = en.length - 1
            $('.energy').append('<img src="build_cards/' + en[len] + '.png" id="en_' + len +'" class="cimg ens">')
            socketpluscheckhand('emit-seten',en[len],len)
        })
    }
});

$(document).on('click','.set_fie_at',function(){
    var len
    $.when(
    fi.push(territory)
    ).done(function(){
        len = fi.length - 1
        $('.field').append('<img src="build_cards/' + fi[len] + '.png" id="fi_' + len +'" class="cimg fie a_tet">')
        socketpluscheckhand('emit-setfie',fi[len],len)
    })
});

$(document).on('click','.set_fie',function(){
    var act = document.getElementById(active)
    var num = $('.active').attr('id')
    var id = num.split("_")
    var tmp = id[1]
    if($('.active').hasClass('hands')){
        var checkcard = hands[tmp]
        fi.push(checkcard)
        $.when(
            act.remove()
        ).done(function(){
            var len = fi.length - 1
            $('.field').append('<img src="build_cards/' + fi[len] + '.png" id="fi_' + len +'" class="cimg fie">')
            socketpluscheckhand('emit-setfie',fi[len],len)
        })
    }else if($('.active').hasClass('ens')){
        var checkcard = en[tmp]
        fi.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remen',tmp)
        ).done(function(){
            var len = fi.length - 1
            $('.field').append('<img src="build_cards/' + fi[len] + '.png" id="fi_' + len +'" class="cimg fie">')
            socketpluscheckhand('emit-setfie',fi[len],len)
        })
    }else if($('.active').hasClass('gys')){
        var checkcard = gy[tmp]
        fi.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remgy',tmp)
        ).done(function(){
            var len = fi.length - 1
            $('.field').append('<img src="build_cards/' + fi[len] + '.png" id="fi_' + len +'" class="cimg fie">')
            socketpluscheckhand('emit-setfie',fi[len],len)
        })
    }else if($('.active').hasClass('rms')){
        var checkcard = rm[tmp]
        fi.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remrem',tmp)
        ).done(function(){
            var len = fi.length - 1
            $('.field').append('<img src="build_cards/' + fi[len] + '.png" id="fi_' + len +'" class="cimg fie">')
            socketpluscheckhand('emit-setfie',fi[len],len)
        })
    }else if($('.active').hasClass('looks')){
        var checkcard = look[tmp]
        fi.push(checkcard)
        $.when(
            act.remove()
        ).done(function(){
            var len = fi.length - 1
            $('.field').append('<img src="build_cards/' + fi[len] + '.png" id="fi_' + len +'" class="cimg fie">')
            socketpluscheckhand('emit-setfie',fi[len],len)
        })
    }
});

$(document).on('click', '.close_at', function(){
    var num = $('.a_tet').attr('id')
    var id = num.split("_")
    var tmp = id[1]
    $('.a_tet').remove()
    socketpluscheckhand('emit-remfie',tmp)
})

$(document).on('click','.set_hand',function(){
    var act = document.getElementById(active)
    var num = $('.active').attr('id')
    var id = num.split("_")
    var tmp = id[1]
    if($('.active').hasClass('fie')){
        var checkcard = fi[tmp]
        hands.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remfie',tmp),
            remove_aura(num)
        ).done(function(){
            var len = hands.length - 1
            $('.hand').append('<img src="build_cards/' + hands[len] + '.png" id="hand_' + len +'" class="cimg hands">')
        })
    }else if($('.active').hasClass('ens')){
        var checkcard = en[tmp]
        hands.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remen',tmp)
        ).done(function(){
            var len = hands.length - 1
            $('.hand').append('<img src="build_cards/' + hands[len] + '.png" id="hand_' + len +'" class="cimg hands">')
        })
    }else if($('.active').hasClass('gys')){
        var checkcard = gy[tmp]
        hands.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remgy',tmp)
        ).done(function(){
            var len = hands.length - 1
            $('.hand').append('<img src="build_cards/' + hands[len] + '.png" id="hand_' + len +'" class="cimg hands">')
        })
    }else if($('.active').hasClass('rms')){
        var checkcard = rm[tmp]
        hands.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remrem',tmp)
        ).done(function(){
            var len = hands.length - 1
            $('.hand').append('<img src="build_cards/' + hands[len] + '.png" id="hand_' + len +'" class="cimg hands">')
        })
    }else if($('.active').hasClass('looks')){
        var checkcard = look[tmp]
        hands.push(checkcard)
        $.when(
            act.remove()
        ).done(function(){
            var len = hands.length - 1
            $('.hand').append('<img src="build_cards/' + hands[len] + '.png" id="hand_' + len +'" class="cimg hands">')
        })
    }
});

$(document).on('click','.set_gy',function(){
    var act = document.getElementById(active)
    var num = $('.active').attr('id')
    var id = num.split("_")
    var tmp = id[1]
    if($('.active').hasClass('fie')){
        var checkcard = fi[tmp]
        gy.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remfie',tmp),
            remove_aura(num)
        ).done(function(){
            var len = gy.length - 1
            $('.gy').append('<img src="build_cards/' + gy[len] + '.png" id="gy_' + len +'" class="cimg gys">')
            socketpluscheckhand('emit-setgy',gy[len],len)
        })
    }else if($('.active').hasClass('ens')){
        var checkcard = en[tmp]
        gy.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remen',tmp)
        ).done(function(){
            var len = gy.length - 1
            $('.gy').append('<img src="build_cards/' + gy[len] + '.png" id="gy_' + len +'" class="cimg gys">')
            socketpluscheckhand('emit-setgy',gy[len],len)
        })
    }else if($('.active').hasClass('hands')){
        var checkcard = hands[tmp]
        gy.push(checkcard)
        $.when(
            act.remove()
        ).done(function(){
            var len = gy.length - 1
            $('.gy').append('<img src="build_cards/' + gy[len] + '.png" id="gy_' + len +'" class="cimg gys">')
            socketpluscheckhand('emit-setgy',gy[len],len)
        })
    }else if($('.active').hasClass('rms')){
        var checkcard = rm[tmp]
        gy.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remrem',tmp)
        ).done(function(){
            var len = gy.length - 1
            $('.gy').append('<img src="build_cards/' + gy[len] + '.png" id="gy_' + len +'" class="cimg gys">')
            socketpluscheckhand('emit-setgy',gy[len],len)
        })
    }else if($('.active').hasClass('looks')){
        var checkcard = look[tmp]
        gy.push(checkcard)
        $.when(
            act.remove()
        ).done(function(){
            var len = gy.length - 1
            $('.gy').append('<img src="build_cards/' + gy[len] + '.png" id="gy_' + len +'" class="cimg gys">')
            socketpluscheckhand('emit-setgy',gy[len],len)
        })
    }
});

$(document).on('click','.set_rm',function(){
    var act = document.getElementById(active)
    var num = $('.active').attr('id')
    var id = num.split("_")
    var tmp = id[1]
    if($('.active').hasClass('fie')){
        var checkcard = fi[tmp]
        rm.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remfie',tmp),
            remove_aura(num)
        ).done(function(){
            var len = rm.length - 1
            $('.rm').append('<img src="build_cards/' + rm[len] + '.png" id="rm_' + len +'" class="cimg rms">')
            socketpluscheckhand('emit-setrem',rm[len],len)
        })
    }else if($('.active').hasClass('ens')){
        var checkcard = en[tmp]
        rm.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remen',tmp)
        ).done(function(){
            var len = rm.length - 1
            $('.rm').append('<img src="build_cards/' + rm[len] + '.png" id="rm_' + len +'" class="cimg rms">')
            socketpluscheckhand('emit-setrem',rm[len],len)
        })
    }else if($('.active').hasClass('hands')){
        var checkcard = hands[tmp]
        rm.push(checkcard)
        $.when(
            act.remove()
        ).done(function(){
            var len = rm.length - 1
            $('.rm').append('<img src="build_cards/' + rm[len] + '.png" id="rm_' + len +'" class="cimg rms">')
            socketpluscheckhand('emit-setrem',rm[len],len)
        })
    }else if($('.active').hasClass('gys')){
        var checkcard = gy[tmp]
        rm.push(checkcard)
        $.when(
            act.remove(),
            socketpluscheckhand('emit-remgy',tmp)
        ).done(function(){
            var len = rm.length - 1
            $('.rm').append('<img src="build_cards/' + rm[len] + '.png" id="rm_' + len +'" class="cimg rms">')
            socketpluscheckhand('emit-setrem',rm[len],len)
        })
    }else if($('.active').hasClass('looks')){
        var checkcard = look[tmp]
        rm.push(checkcard)
        $.when(
            act.remove()
        ).done(function(){
            var len = rm.length - 1
            $('.rm').append('<img src="build_cards/' + rm[len] + '.png" id="rm_' + len +'" class="cimg rms">')
            socketpluscheckhand('emit-setrem',rm[len],len)
        })
    }
});

$(document).on('click','.damage',function(){
    var top = life.shift()
    gy.push(top)
    var len = gy.length - 1
    uplifes()
    $('.gy').append('<img src="build_cards/' + gy[len] + '.png" id="gy_' + len +'" class="cimg gys">')
    socketpluscheckhand('emit-setgy',gy[len],len)
});

$(document).on('click','.heal',function(){
    var top = cards.shift()
    life.unshift(top)
    updatesheets();
    uplifes()
});

$(document).on('click','.boost_life',function(){
    var top = life.shift()
    en.push(top)
    var len = en.length - 1
    uplifes()
    $('.energy').append('<img src="build_cards/' + en[len] + '.png" id="en_' + len +'" class="cimg ens">')
    socketpluscheckhand('emit-seten',en[len],len)
});

$(document).on('click','.boost_deck',function(){
    var top = cards.shift()
    en.push(top)
    var len = en.length - 1
    updatesheets();
    $('.energy').append('<img src="build_cards/' + en[len] + '.png" id="en_' + len +'" class="cimg ens">')
    socketpluscheckhand('emit-seten',en[len],len)
});

$(document).on('click','.untap',function(){
    if($('.field').children().hasClass('tapped')){
        $('.field').children('.tapped').each(function(){
            var num = $(this).attr("id");
            var id = num.split("_");
            var tmp = id[0] + "_enem_" + id[1]
            socketpluscheckhand('remtap',tmp)
        })
        $('.field').children().removeClass('tapped')
    }
    if($('.energy').children().hasClass('tapped')){
        $('.energy').children('.tapped').each(function(){
            var num = $(this).attr("id");
            var id = num.split("_");
            var tmp = id[0] + "_enem_" + id[1]
            socketpluscheckhand('remtap',tmp)
        })
        $('.energy').children().removeClass('tapped')
    }
});

$(document).on('click','.clr',function(){
    $('.active').removeClass('active')
});

$(document).on('click','.pig',function(){
    var top = cards.shift()
    gy.push(top)
    var len = gy.length - 1
    updatesheets();
    $('.gy').append('<img src="build_cards/' + gy[len] + '.png" id="gy_' + len +'" class="cimg gys">')
    socketpluscheckhand('emit-setgy',gy[len],len)
});

$(document).on('click','.looktop',function(){
    var top = cards.shift()
    look.push(top)
    var len = look.length - 1
    updatesheets();
    $('.look').append('<img src="build_cards/' + look[len] + '.png" id="look_' + len +'" class="cimg looks">')
});

$(document).on('click','.set_top',function(){
    var act = document.getElementById(active)
    var num = $('.active').attr('id')
    var id = num.split("_")
    var tmp = id[1]
    var checkcard = checkarea(id[0],tmp)
    cards.unshift(checkcard)
    
    if($('.active').hasClass('fie')){
        $.when(
            socketpluscheckhand('emit-remfie',tmp),
            remove_aura(num)
        ).done(function(){
            act.remove()
        })
    }else if($('.active').hasClass('ens')){
        $.when(
            socketpluscheckhand('emit-remen',tmp)
        ).done(function(){
            act.remove()
        })
    }else if($('.active').hasClass('gys')){
        $.when(
            socketpluscheckhand('emit-remgy',tmp)
        ).done(function(){
            act.remove()
        })
    }else if($('.active').hasClass('hands')){
        act.remove()
    }
    updatesheets();
});


$(document).on('click','.set_top_look',function(){
    var act = document.getElementById(active)
    var num = $('.active').attr('id')
    var id = num.split("_")
    var tmp = id[1]
    var checkcard = checkarea(id[0],tmp)
    cards.unshift(checkcard)
    if($('.active').hasClass('fie')){
        $.when(
            socketpluscheckhand('emit-remfie',tmp),
            remove_aura(num)
        ).done(function(){
            act.remove()
        })
    }else if($('.active').hasClass('ens')){
        $.when(
            socketpluscheckhand('emit-remen',tmp)
        ).done(function(){
            act.remove()
        })
    }else if($('.active').hasClass('gys')){
        $.when(
            socketpluscheckhand('emit-remgy',tmp)
        ).done(function(){
            act.remove()
        })
    }else if($('.active').hasClass('hands')){
        act.remove()
    }
    act.remove()
    updatesheets();
});

$(document).on('click','.set_bot',function(){
    var act = document.getElementById(active)
    var num = $('.active').attr('id')
    var id = num.split("_")
    var tmp = id[1]
    var checkcard = checkarea(id[0],tmp)
    cards.push(checkcard)
    act.remove()
    updatesheets();
});

function checkarea(e,tmp){
    if(e == "look"){
        return look[tmp]
    }else if(e == "gy"){
        return gy[tmp]
    }else if(e == "en"){
        return en[tmp]
    }else if(e == "hand"){
        return hands[tmp]
    }else if(e == "fi"){
        return fi[tmp]
    }
}

$(document).on('click','.fatigue',function(){
    var top = life.shift()
    hands.push(top)
    var len = hands.length - 1
    uplifes()
    $('.hand').append('<img src="build_cards/' + hands[len] + '.png" id="hand_' + len +'" class="cimg hands">')
});

$(document).on('click','.dice',function(){
    var number
    $.when(
        number = getRandomArbitrary(1,100)
    ).done(function(){
        yourpoints = number;
        d100.innerHTML = String(number)
        socket.emit('emit-d100',String(number))
    })
});

socket.on('emit-d100',function(score){
    opppoints = score;
    d100_enem.innerHTML = score
})

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

socket.on('emit-getturn',function(dummy){
    $.when(
        $('.turn').removeClass('turn')
    ).done(function(){
        $('.status').addClass('turn')
    })
});
  
$(document).on('click','.t_end',function(){
    $.when(
        $('.turn').removeClass('turn')
    ).done(function(){
        $('.status_enem').addClass('turn')
        socketpluscheckhand('emit-getturn',"dummy")
    })
})

$(document).on('click','.finish_game',function(){
    socket.emit('reload')
    location.reload();
})

socket.on('reload',function(){
    location.reload();
})

function socketpluscheckhand(event,call,call2){
    dum_hands = 0
    if(call2 == null){
        socket.emit(event,call)
    }else{
        socket.emit(event,call,call2)
    }
    $.when(
        $('.hands').each(function(){
            dum_hands += 1
        })
    ).done(function(){
        socket.emit('emit-hundnumbers',dum_hands);
        cardinhand.innerHTML = dum_hands
    })
}

socket.on('emit-hundnumbers',function(numb){
    var cardsinhand = String(numb);
    console.log(numb)
    cardinhand_enem.innerHTML = cardsinhand;
})

$(document).on('click','.judge_up',function(){
    $.when(
        judgement += 1,
        judge.innerHTML = judgement
    ).done(function(){
        socketpluscheckhand('emit-judgement',judgement)
    })
})

$(document).on('click','.judge_down',function(){
    $.when(
        judgement -= 1,
        judge.innerHTML = judgement
    ).done(function(){
        socketpluscheckhand('emit-judgement',judgement)
    })
})

socket.on('emit-judgement',function(numb){
    var jg = String(numb);
    judge_enem.innerHTML = jg;
})

var tmp_aura_card_src
var tmp_aura_card_id

$(document).on('click','.put_aura',function(){
    $('.put_aura').toggle();
    $('.select_field').toggle();
    tmp_aura_card_src = $('.active').attr('src')
    tmp_aura_card_id = $('.active').attr('id')
    $('.active').removeClass('active')
})

$(document).on('click','.select_field',function(){
    var act = document.getElementById(active)
    $('.put_aura').toggle();
    $('.select_field').toggle();
        if($('.active').length && $('.active').attr('id') != tmp_aura_card_id){
            aura.push({
                card_src: tmp_aura_card_src,
                parent_id: $('.active').attr('id')
            })
            tmp_aura_card_src = ""
            var tmp_card_stats = tmp_aura_card_id.split('_')
            switch(tmp_card_stats[0]){
            case 'fi':
                socketpluscheckhand('emit-remfie',tmp_card_stats[1]);
                break;
            case 'en':
                socketpluscheckhand('emit-remen',tmp_card_stats[1]);
                break;
            case 'gy':
                socketpluscheckhand('emit-remgy',tmp_card_stats[1]);
                break;
            case 'rm':
                socketpluscheckhand('emit-remrem',tmp_card_stats[1]);
                break;
            default:
                break;
            }
            $('#'+tmp_aura_card_id).remove()
        }
        $('.active').removeClass('active')

})

$(document).on('click','.put_aura_gy',function(){
    if($('.active_').hasClass('aura_img')){
        var aura_len = parseInt($('.active_').attr('id').replace('aura_',''))
        gy.push(aura[aura_len].card_src.replace('build_cards/','').replace('.png',''))
        var len = gy.length - 1
        $('.gy').append('<img src="build_cards/' + gy[len] + '.png" id="gy_' + len +'" class="cimg gys">')
        socketpluscheckhand('emit-setgy',gy[len],len)
        aura.splice(aura_len,1)
        $('.active_').remove()
    }
})

function remove_aura(card_id){
    var len = gy.length - 1
    for(i = 0; i < aura.length; i++){
        if(aura[i].parent_id == card_id){
            gy.push(aura[i].card_src.replace('build_cards/','').replace('.png',''))
            $('.gy').append('<img src="build_cards/' + gy[len] + '.png" id="gy_' + len +'" class="cimg gys">')
            socketpluscheckhand('emit-setgy',gy[len],len)
            len++
        }
    }
}

// ----------------------
// vivavo 2.0 tracker-mode
// トラッキング用
// ----------------------
$(document).on('click','.defeat_call',function(){
    $.when(function(){
        if(yourpoints > opppoints){
            playfirst = "true"
        }
    }).done(function(){
        $.when(
            socket.emit('sql-settrack',territory,(deck.split(/\n/)).join('/'),hands.join('/'),ter_en,playfirst,"false",firstlife.join('/'))
        ).done(function(){
            $.when(
                socket.emit('defeat')
            ).done(function(){
                if(!alert("あなたの負けです\n対戦データを登録しました")){
                    location.reload();
                }
            })
            return false;
        })
    })
})

socket.on('defeat',function(){
    $.when(function(){
        if(yourpoints > opppoints){
            playfirst = "true"
        }
    }).done(function(){
        $.when(
            socket.emit('sql-settrack_',territory,(deck.split(/\n/)).join('/'),hands.join('/'),ter_en,playfirst,"true",firstlife.join('/'))
        ).done(function(){
            if(!alert("対戦相手が投了しました\n対戦データを登録しました")){
                location.reload();
            }
        })
    })
})