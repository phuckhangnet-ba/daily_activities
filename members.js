//
// get member for activities
let actions_check = ["copyCard","updateCard"];	
let mems=members.slice();
if(managers.indexOf(localStorage.getItem('username')) === -1) 
	mems=mems.filter(x=>x.username===localStorage.getItem('username'));
else
	mems=mems.filter(x=>x.username!==localStorage.getItem('username'));
$.each(mems, function(mei, mem){		
	$('#dvMembers').append(mem_avatar(mem));
	$(`.actions_member#${mem.id}`).bind('click',actions_member_click);
});

function actions_member_click() {
	let id = $(this).attr('id');
	let fullName = $(this).attr('fullName');
	member_get_actions(id, fullName)
};

function member_get_actions(id, fullName){	
	$('#dvCards').hide();
	$('.tabs').hide();
	$('#dvActivity').prev('.member_fullName').remove();
	$('#dvActivity').before(`<div class="member_fullName" style="text-align: center"><h2>${fullName}</h2></div>`);
	$('#dvActivity').html('');
	$('#dvActivity').css({"display": "flex", "flex-direction": "column-reverse", "justify-content":"flex-end"});
	$.ajax(get_members.url.replace('{id}', id).replace('{typeget}', 'actions')).done(function (act_res) {
		let types=$.unique(act_res.map(x=>x.type))
		let actions=act_res.filter(x=>x.data.board.id===daily_booking_complete);
		actions=actions.filter(x=>actions_check.indexOf(x.type) > -1);
		actions.sort(function(a, b){
		    return (new Date(a.date))-(new Date(b.date))
		});
		//
		$.each(actions, function(i, act){
			_date=new Date(act.date); _time=_date.toLocaleString().split(',')[1]; _date=_date.toLocaleString().split(',')[0];
			if($(`#dvActivity > div[date="${_date}"]`).length===0){
				$('#dvActivity').append(`<div date="${_date}"><h2></h2><span date="${_date}" class="min_time cls_hide">${act.date}</span></div>`);
			}
			_card=act.data.card.name;
			_doing="";
			// booking
			if(act.type==="copyCard"){
				// _card=act.data.cardSource.name;
				_doing="Booking task from " + act.data.list.name + " >> " + act.data.card.name;
			}
			// doing
			if(act.type==="updateCard"){
				try{
					_doing=_card + ': ' + act.data.listBefore.name +' >> ' + act.data.listAfter.name;
				} catch{};
			}
			if(_doing !== "" && _doing !== null){
				let type=project.find(x=>_doing.indexOf(x.key)>-1);
				let tracking=`<div index="${act.date}" class="cls_flex"><b style="width: 7em">${_time}</b>
				<div style="width: 3em;background-color:${(type !== undefined?type.type:"")};margin-right:1em">&nbsp;</div><div>${_doing}</div></div>`;
				$(`#dvActivity > div[date="${_date}"]`).append(tracking);
			}
			if((actions.length-1)===i){
				let div_date=$('#dvActivity > div');
				$.each(div_date, function(di, div){
					let first=$($(div).children("div:first")).attr('index');
					let last=$($(div).children("div:last")).attr('index');
					first=new Date(first), last=new Date(last);
					$($(div).find('h2')).text(first.toLocaleString().split(',')[0] + ' Tổng: ' + time_diff(first,last)[0] +' giờ '+time_diff(first,last)[1]+' phút');
				});
			}
		});
	});
}