var daily_booking_complete='6825720a811d4c281604b17b';
var key="eedfdce7222c6c76de15068a0f4126d2";
let token=localStorage.getItem('token');
//
var project=[
  {"key":"Tồn đọng", "color":"rgba(222, 146, 14, 0.3)","type":"rgba(222, 146, 14, 0.9)","index":2},
  {"key":"PTSOP P1", "color":"rgba(222, 146, 14, 0.3)","type":"rgba(222, 146, 14, 0.9)","index":2},
  {"key":"PTPOOLS P1", "color":"rgba(222, 146, 14, 0.3)","type":"rgba(222, 146, 14, 0.9)","index":2},
  {"key":"PKGEMS", "color":"rgba(222, 146, 14, 0.3)","type":"rgba(222, 146, 14, 0.9)","index":2},
  {"key":"Trợ lý bán hàng", "color":"rgba(222, 146, 14, 0.3)","type":"rgba(222, 146, 14, 0.9)","index":2},
  {"key":"Other", "color":"rgba(99, 97, 92, 0.3)","type":"rgba(99, 97, 92, 0.9)","index":3},
  {"key":"Meeting", "color":"rgba(21, 225, 236, 0.3)","type":"rgba(99, 97, 92, 0.9)","index":3},
  {"key":"ZALO", "color":"rgba(99, 47, 196, 0.3)","type":"rgba(99, 97, 92, 0.9)","index":3},
  {"key":"PTSOP P2", "color":"rgba(210, 5, 5, 0.3)","type":"rgba(27, 217, 33, 0.9)","index":1},
  {"key":"PTPOOLS P2", "color":"rgba(222, 146, 14, 0.3)","type":"rgba(27, 217, 33, 0.9)","index":1},
  {"key":"NTVWEB P1", "color":"rgba(14, 25, 222, 0.3)","type":"rgba(27, 217, 33, 0.9)","index":1},
  {"key":"NTVWEB P2", "color":"rgba(14, 25, 222, 0.3)","type":"rgba(27, 217, 33, 0.9)","index":1},
];
var des_team=['phnglan61','pchien3'];
var dev_team=['hau_pv','minhld7','vansuong1'];
var fe_team=['hau_pv'];
var be_team=['minhld7','vansuong1'];
var managers=['itphuckhangnet','nguyenkhang4'];
var lists = [{"id": "6825720a811d4c281604b175","name": "🌻 Todo List",},
  {"id": "6825720a811d4c281604b176","name": "⚡ Booking Tasks",},
  {"id": "6825720a811d4c281604b173","name": "🎯 Backlog",},
  {"id": "6825720a811d4c281604b174","name": "Completed 🎉",},
  {"id": "682bd915e5c2bec216a83a26","name": "🌻 Source",}];
var members=[
  {"id": "6283b26b9d2bfe7c0d622c83","fullName": "VanSuong","username": "vansuong1"},
  {"id": "5bbc0f4d7000a025a66ff75e","fullName": "HauPham","username": "hau_pv"},
  {"id": "682ebb05d7550d2587a0784f","fullName": "Lê Xuân Hiền","username": "lexuanhin3"},
  {"id": "67232cde1a540cd68a5b1d57","fullName": "IT PhucKhangNet","username": "itphuckhangnet"},
  {"id": "6825c112f5b9c4072479d39d","fullName": "Lan Nguyen","username": "phnglan61"},
  {"id": "647d971ee1cc237d88f49d30","fullName": "Minhld","username": "minhld7"},
  {"id": "5837aba78093a9e6c015c90d","fullName": "Nguyen Khang","username": "nguyenkhang4"},
  {"id": "67e63822afab307e6b0bc4cb","fullName": "Pchien","username": "pchien3"},
  ];
// members = members.filter(x=>arr_man.indexOf(x.username)===-1);
var members_avatar=[{"id":"67232cde1a540cd68a5b1d57","hash":"f4fdb8c7b8006eaf46bbc5b19c849ce2"},{"id":"682ebb05d7550d2587a0784f","hash":"f1d83a65f6764ba6204182a22d99ec4b"},{"id":"6283b26b9d2bfe7c0d622c83","hash":"7f2698934ee67e8be0053695f5f6539d"},{"id":"6825c112f5b9c4072479d39d","hash":"96a8665972124c628363cb250b5bb38e"},{"id":"67e63822afab307e6b0bc4cb","hash":"819ced8594b3b301411238a2e590e775"},{"id":"67232cde1a540cd68a5b1d57","hash":"a7cdc60bb234ee80f82c5338eb5c103a"},{"id":"5bbc0f4d7000a025a66ff75e","hash":"824888ed191c080edf9186a2c43c7483"},{"id":"647d971ee1cc237d88f49d30","hash":"af11e0991513821f69849b237588cdd7"}];
//
var members_res=[], list_res=[];
var get_boards = {
  "url": `https://api.trello.com/1/boards/${daily_booking_complete}/{typeget}?key=${key}&token=${token}`,
  "method": "GET",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Cookie": "dsc=e5ea343a883bb456d15a9b3be1521fc0503999f285c66899fb1f5a0ec90261e8"
  },
};
var get_members = {
  "url": `https://api.trello.com/1/members/{id}/{typeget}?key=${key}&token=${token}`,
  "method": "GET",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Cookie": "dsc=e5ea343a883bb456d15a9b3be1521fc0503999f285c66899fb1f5a0ec90261e8"
  },
};
var get_cards = {
  "url": `https://api.trello.com/1/cards/{id}/{typeget}?key=${key}&token=${token}`,
  "method": "GET",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Cookie": "dsc=e5ea343a883bb456d15a9b3be1521fc0503999f285c66899fb1f5a0ec90261e8"
  },
};
var get_lists = {
  "url": `https://api.trello.com/1/lists/{id}/{typeget}?key=${key}&token=${token}`,
  "method": "GET",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Cookie": "dsc=e5ea343a883bb456d15a9b3be1521fc0503999f285c66899fb1f5a0ec90261e8"
  },
};

var mem_avatar=(mem, nodiv=false)=>{
  let html='';
  if(members_avatar.find(x=>x.id===mem.id) !== undefined){
     html= `<div id="${mem.id}" fullName="${mem.fullName}" class="cls_flex" style="margin-bottom:1em">
      <img style="margin-right: 0.5em; border:1px solid blue; border-radius: 50%" id="${mem.id}"
      src="https://trello-members.s3.amazonaws.com/${mem.id}/${members_avatar.find(x=>x.id===mem.id).hash}/170.png" width="50" height="50" />
      ${mem.fullName}</div>`;
  }
  return html;
};

var time_diff=(start_datetime, end_datetime)=>{
  var diff =  Math.abs(new Date(end_datetime) - new Date(start_datetime));
  var seconds = Math.floor(diff/1000); //ignore any left over units smaller than a second
  var minutes = Math.floor(seconds/60); 
  seconds = seconds % 60;
  var hours = Math.floor(minutes/60);
  minutes = minutes % 60;
  return [hours, minutes, seconds];
}
