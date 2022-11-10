const socket = io();

let track_response
let table
let newRow
let newCell
let newText
let deck_contains
let hand_contains
let life_contains
let ter_contains
let ter_contains_d = []
let deck_contains_win
let hand_contains_win
let life_contains_win
let ter_contains_win
let ter_contains_win_d = []
let gnh
let gnh_wr
let selectoption

function round_up(num){
  return String(Math.round(num * 100)) + "%"
}

function makeselecttr(){
  for(var i=0; i < territory_list.length; i++){
    selectoption = document.createElement("option");
    if(i == 0){
      selectoption.value = i
    }else{
      selectoption.value = territory_list[i];  //value値
    }
    selectoption.text = territory_list[i];   //テキスト値
    document.getElementById("y_t").appendChild(selectoption)
  }
  for(var i=0; i < territory_list.length; i++){
    selectoption = document.createElement("option");
    if(i == 0){
      selectoption.value = i
    }else{
      selectoption.value = territory_list[i];  //value値
    }
    selectoption.text = territory_list[i];   //テキスト値
    document.getElementById("e_t").appendChild(selectoption)
  }
}

function filter(){
  var y_t = document.getElementById('y_t').value;
  var e_t = document.getElementById('e_t').value;
  socket.emit('sql-gettrack-filter',y_t,e_t)
  console.log(y_t + '+' + e_t)
}

$(document).ready(function(){
  console.log('===1===');
  socket.emit('sql-gettrack');
  makeselecttr();
})

socket.on('emit-settracks',function(res){
  console.log('===2===');
  track_response = res
  console.log(track_response)
  cards_disp()
})

function insert_table(init){
  newCell = newRow.insertCell();
  newText = document.createTextNode(init);
  newCell.appendChild(newText)
}

function cards_on(){
  $('.table').hide();
  $('#all_cards').show();
  $('#filter').show();
  $('#all_cards').tablesorter();
  $('#all_cards').trigger("update");
}

function cards_disp(){
  $('#all_cards_data').empty();
  table = document.getElementById('all_cards_data')
  for(let i = 0; i < cardlist.length; i++){
    deck_contains = 0
    hand_contains = 0
    deck_contains_win = 0
    hand_contains_win = 0
    life_contains = 0
    life_contains_win = 0

    //name
    newRow = table.insertRow();
    insert_table(cardlist[i]);

    for(let j = 0; j < track_response.length; j++){
      //gid count
      if(!(track_response[j].your_deck == null) && track_response[j].your_deck.includes(cardlist[i])){
        deck_contains++;
        //gid wincount
        if(track_response[j].win === "true"){
          deck_contains_win++;
        }
      }

      //gih count
      if(!(track_response[j].cih == null) && track_response[j].cih.includes(cardlist[i])){
        hand_contains ++;
        //gih wincount
        if(track_response[j].win === "true"){
          hand_contains_win ++;
        }
      }

      //gil count
      if(!(track_response[j].your_life == null) && track_response[j].your_life.includes(cardlist[i])){
        life_contains ++;
        //gil wincount
        if(track_response[j].win === "true"){
          life_contains_win ++;
        }
      }
    }
    //gid
    insert_table(deck_contains)

    //gid wr(dcw/dc)
    if(deck_contains === 0){
      insert_table("0%")
    }else{
      insert_table(round_up(deck_contains_win/deck_contains))
    }

    //gih
    insert_table(hand_contains)

    //gih wr(hcw/hc)
    if(hand_contains === 0){
      insert_table("0%")
    }else{
      insert_table(round_up(hand_contains_win/hand_contains))
    }

    //gnh(deck contains - hand contains)
    gnh = deck_contains - hand_contains
    insert_table(gnh)

    //gnh wr
    gnh_wr = deck_contains_win - hand_contains_win
    if(deck_contains === 0 || gnh === 0){
      insert_table("0%")
    }else{
      insert_table(round_up(gnh_wr/gnh))
    }

    //gil
    insert_table(life_contains)

    //gil wr(lcw/lc)
    if(life_contains === 0){
      insert_table("0%")
    }else{
      insert_table(round_up(life_contains_win/life_contains))
    }

    //iwd
    if(deck_contains === 0 || gnh === 0){
      insert_table("0%")
    }else{
      insert_table(round_up((hand_contains_win/hand_contains) - (gnh_wr/gnh)))
    }
  }
  cards_on();
}

function decks_disp(){
  $('.table').hide();
  $('#filter').hide();
  $('#decks').show();
}

function decks_on(){
  /*
  $('#territory_winrate').empty();
  table = document.getElementById('territory_winrate')
  for(let i = 1; i < territory_list.length; i++){
    ter_contains = 0
    ter_contains_win = 0
    ter_contains_d = []
    ter_contains_win_d = []

    newRow = table.insertRow();
    insert_table(territory_list[i]);

    for(let j = 0; j < track_response.length; j++){
      if(!(track_response[j].your_ter == null) && track_response[j].your_ter.includes(territory_list[i])){
        ter_contains++;
        if(track_response[j].win === "true"){
          ter_contains_win++;
        }
      }
      for(let p = 1; p < territory_list.length; p++){
        if(!(track_response[j].en_ter == null) && track_response[j].en_ter.includes(territory_list[p])){
          ter_contains_d[p]++
          if(track_response[j].win === "true"){
            ter_contains_win_d[p]++;
          }
        }
      }
    }
      insert_table(round_up(ter_contains_win/ter_contains))
      
      for(let p = 1; p < territory_list.length; p++){
        insert_table(round_up(ter_contains_win_d[p]/ter_contains_d[p]))
      }
      
  }
  */
  decks_disp()
}