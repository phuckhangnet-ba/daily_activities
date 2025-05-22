
//
// add id to tab div
$.each($(`.tabs > div`), function(i, di){
	$(di).attr("id",lists.find(x=>x.name===$(di).text()).id);
	if(i===0) $(di).trigger('click');
});

$(`.tabs div`).click(function(e) {
	$(`.tabs div`).removeClass('active');$(this).addClass('active');
	let idlist=$(this).attr('id');
	let namelist=$(this).text();
	load_cards(idlist, namelist);
});

function prj_click() {
	// let idlist=$(this).attr('idlist');
	// let namelist=$(this).attr('namelist');
	let prj=$(this).text();
	$(`#dvCards table tr`).show();
	$(`#dvCards table tr:not([prj="${prj}"])`).hide();
	// load_cards(idlist, namelist,$(this).text());
};

function load_cards(idlist, namelist, filter=""){	
	$('#dvCards').html('');
	$('#dvCards').css({});
	$('#dvCards').prev('.project').remove();
	let add_table= async(idlist, namelist)=>{	
		$('#dvCards').html('');
		$('#dvCards').append(`<table id="${idlist}"><thead><tr><th>Project</th><th>Card name</th><th></th></tr></thead><tbody></tbody></table>`);
	}
	add_table(idlist, namelist).then(function(){
		// console.log(get_lists)
		$.ajax(get_lists.url.replace('{id}',idlist).replace('{typeget}','cards')).done(function (card_res) {
			let cards=[];
			$('#dvCards table').before(`<div class="cls_flex project" style="justify-content: flex-end">${project.filter(x=>card_res.filter(x2=>x2.name.indexOf(x.key) > -1).length > 0).map(x=>`<div style="background-color:${x.type};margin-right:0.5em; padding: 0.5em 0.8em">
			<a href="#" class="prj_click" idlist="${idlist}" namelist="${namelist}" style="color:white; white-space: nowrap;">${x.key}</a></div>`).join('')}</div>`);
			$('.prj_click').bind('click',prj_click);
			$.each(card_res, function(ci, card){
				let prj=project.find(x=>card.name.indexOf(x.key)>-1);
				if(prj !== undefined){
					let objCard={
								"id":card.id,
								"original_name":card.name,
								"name":card.name.replace(project.find(x=>card.name.indexOf(x.key)>-1).key,"").replace("-","").trim()
										+ (["🌻 Todo List"].indexOf(namelist)===-1?'<br><b>Last activity: '+ (new Date(card.dateLastActivity)).toLocaleString()+'</b>':'')
										+ ((card.due !== null && prj.index===1)?'<br><b>Deadline: '+ (new Date(card.due)).toLocaleString().split(',')[0]+'</b>':''),
								"member":members.filter(x=>card.idMembers.indexOf(x.id)>-1),
								"project":prj,
							   };
					cards.push(objCard);
				}
			});
			let sort_cards= async(cards)=>{	
				cards.sort(function(a, b){
				    return (a.project.key > b.project.key) && (a.project.index - b.project.index);
				});
				return cards;
			}
			sort_cards(cards).then(function(re_cards){
				re_cards.map(card=>$(`#dvCards > table > tbody`).append(`<tr prj="${card.project.key}" style="background-color:${card.project.color}" id="${card.id}">`));
				$.each(re_cards, function(ca, objCard){
					let col_tool="";
					if(namelist==="🌻 Todo List"){
						col_tool=`<button name="${objCard.original_name}" id="${objCard.id}" class="cls_btn_tool booking_card">⚡</button>`;
					}
					else if(namelist==="🎯 Backlog"){
						col_tool=`<button name="${objCard.original_name}" id="${objCard.id}" class="cls_btn_tool rebook_card">⚡</button>`;
					}
					else if(namelist==="⚡ Booking Tasks"){
						col_tool+=`<button name="${objCard.original_name}" id="${objCard.id}" class="cls_btn_tool backlog_card">🎯</button>`;
						col_tool+=`<button name="${objCard.original_name}" id="${objCard.id}" class="cls_btn_tool complete_card">🎉</button>`;
					}
					else{
						col_tool=objCard.member.map(mem=>
						`<div id="${mem.id}" fullName="${mem.fullName}" class="cls_flex">
						<img style="margin-right: 0.5em; border:1px solid blue; border-radius: 50%" id="${mem.id}"
						src="https://trello-members.s3.amazonaws.com/${mem.id}/${members_avatar.find(x=>x.id===mem.id).hash}/170.png" width="50" height="50" />
						${mem.fullName}</div>`
						).join(' ');
					}
					$(`tr#${objCard.id}`)
							.append(`<td style="white-space: nowrap;">${objCard.project.key}</td>
										<td style="width:100%">${objCard.name}</td>
										<td>${col_tool}</td>
									`);
				});
				$('.cls_btn_tool').bind('click', booking_card_click);
			})
		});
	});
}
function booking_card_click(){
	let id=$(this).attr('id');
	let name=$(this).attr('name');
	let cls=$(this).attr('class').split(' ');
	let idMembers='6283b26b9d2bfe7c0d622c83';
	if(cls.indexOf('booking_card')>-1){
		let arr_value=[
			`idList=6825720a811d4c281604b176`,
			`idCardSource=${id}`,
			`keepFromSource=attachments,checklists,customFields,due,labels,start,stickers`,
			`dueComplete=false`,
			`idMembers=${idMembers}`,
			`name=${name} >> Test 2`,
			];

	    $.ajax({
	        headers: {
	            "Accept": "*/*",
	            "Content-Type": "application/json"
	        },
	        url: `https://api.trello.com/1/cards?${arr_value.join('&')}&key=${key}&token=${token}`,
	        type: 'POST',
	        dataType: 'json',
	        success: function(data) {
	        	_send(`${members.find(x=>x.id===idMembers).fullName} >> Booked card: ${name}`);
	        } 
	     });
	}
	else if(cls.indexOf('backlog_card')>-1){
		let arr_value=[
			`idList=6825720a811d4c281604b173`,
			];
	    $.ajax({
	        headers: {
	            "Accept": "*/*",
	            "Content-Type": "application/json"
	        },
	        url: `https://api.trello.com/1/cards/${id}?${arr_value.join('&')}&key=${key}&token=${token}`,
	        type: 'PUT',
	        dataType: 'json',
	        success: function(data) {
	        	_send(`${members.find(x=>x.id===idMembers).fullName} >> Saved card: ${name}`);
	        } 
	     });
	}
	else if(cls.indexOf('complete_card')>-1){
		let arr_value=[
			`idList=6825720a811d4c281604b174`,
			];
	    $.ajax({
	        headers: {
	            "Accept": "*/*",
	            "Content-Type": "application/json"
	        },
	        url: `https://api.trello.com/1/cards/${id}?${arr_value.join('&')}&key=${key}&token=${token}`,
	        type: 'PUT',
	        dataType: 'json',
	        success: function(data) {
	        	_send(`${members.find(x=>x.id===idMembers).fullName} >> Completed card: ${name}`);
	        } 
	     });
	}
	else if(cls.indexOf('rebook_card')>-1){
		let arr_value=[
			`idList=6825720a811d4c281604b176`,
			];
	    $.ajax({
	        headers: {
	            "Accept": "*/*",
	            "Content-Type": "application/json"
	        },
	        url: `https://api.trello.com/1/cards/${id}?${arr_value.join('&')}&key=${key}&token=${token}`,
	        type: 'PUT',
	        dataType: 'json',
	        success: function(data) {
	        	_send(`${members.find(x=>x.id===idMembers).fullName} >> Re-booked card: ${name}`);
	        } 
	     });
	}
}
//
// get member for activities
let actions_check = ["copyCard","updateCard"];
$.each(members, function(mei, mem){		
	$('#dvMembers').append(`<div><a href="#" id="${mem.id}" fullName="${mem.fullName}" class="cls_flex actions_member">
							<img style="margin-right: 0.5em; border:1px solid blue; border-radius: 50%" id="${mem.id}"
							src="https://trello-members.s3.amazonaws.com/${mem.id}/${members_avatar.find(x=>x.id===mem.id).hash}/170.png" width="50" height="50" />
							${mem.fullName}</a>
							</div>`);
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

function time_diff(start_datetime, end_datetime){
	var diff =  Math.abs(new Date(end_datetime) - new Date(start_datetime));
	var seconds = Math.floor(diff/1000); //ignore any left over units smaller than a second
	var minutes = Math.floor(seconds/60); 
	seconds = seconds % 60;
	var hours = Math.floor(minutes/60);
	minutes = minutes % 60;
	return [hours, minutes, seconds];
}
